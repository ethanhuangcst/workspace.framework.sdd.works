import { spawn, spawnSync, type ChildProcessWithoutNullStreams } from "node:child_process";
import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
} from "node:fs";
import { createServer, type Server } from "node:http";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import { afterEach, describe, expect, it } from "vitest";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

function hostBinaryName(): string {
  const platform = process.platform;
  const arch = process.arch === "arm64" ? "arm64" : "x64";
  if (platform === "darwin") return `sdd-mcp-darwin-${arch}`;
  if (platform === "linux") return `sdd-mcp-linux-${arch}`;
  if (platform === "win32") return `sdd-mcp-windows-${arch}.exe`;
  throw new Error(`Unsupported platform ${platform}`);
}

function buildHostBinary(): string {
  const bun = join(ROOT, "node_modules", ".bin", "bun");
  expect(existsSync(bun)).toBe(true);
  const outfile = join(ROOT, "dist", hostBinaryName());
  const build = spawnSync(
    bun,
    [
      "build",
      "--compile",
      join(ROOT, "src", "mcp", "stdio.ts"),
      "--outfile",
      outfile,
    ],
    { cwd: ROOT, encoding: "utf8", env: process.env },
  );
  expect(build.status, build.stderr).toBe(0);
  expect(existsSync(outfile)).toBe(true);
  return outfile;
}

/** Minimal ustar tar with one top-level dir (for tar --strip-components 1). */
function buildSpikeTarball(): Buffer {
  const top = "sdd-pack";
  const rel = `${top}/skills/spike/SKILL.md`;
  const content = Buffer.from("# feature-14 fixture\n", "utf8");
  const nameBytes = Buffer.from(rel, "utf8");
  if (nameBytes.length >= 100) throw new Error("path too long for ustar");

  const header = Buffer.alloc(512, 0);
  nameBytes.copy(header, 0);
  header.write("0000644\0", 100, 8, "utf8"); // mode
  header.write("0000000\0", 108, 8, "utf8"); // uid
  header.write("0000000\0", 116, 8, "utf8"); // gid
  const sizeOct = content.length.toString(8).padStart(11, "0") + "\0";
  header.write(sizeOct, 124, 12, "utf8");
  header.write("00000000000\0", 136, 12, "utf8"); // mtime
  header.write("        ", 148, 8, "utf8"); // checksum placeholder
  header.write("0", 156, 1, "utf8"); // typefile
  header.write("ustar\0", 257, 6, "utf8");
  header.write("00", 263, 2, "utf8");

  let sum = 0;
  for (let i = 0; i < 512; i++) sum += header[i]!;
  const checksum = sum.toString(8).padStart(6, "0") + "\0 ";
  header.write(checksum, 148, 8, "utf8");

  const pad = (512 - (content.length % 512)) % 512;
  return Buffer.concat([header, content, Buffer.alloc(pad), Buffer.alloc(1024)]);
}

type FixtureServer = {
  url: string;
  close: () => Promise<void>;
};

async function startPackageFixture(): Promise<FixtureServer> {
  const gzipBody = gzipSync(buildSpikeTarball());
  const server: Server = createServer((req, res) => {
    const url = new URL(req.url ?? "/", "http://127.0.0.1");
    if (url.pathname !== "/api/sdd/package") {
      res.writeHead(404);
      res.end();
      return;
    }
    res.writeHead(200, {
      "Content-Type": "application/gzip",
      "Content-Length": String(gzipBody.length),
      "X-SDD-Commit": "fixture-commit",
      "X-SDD-Version": "fixture-v1",
    });
    res.end(gzipBody);
  });
  await new Promise<void>((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve());
  });
  const addr = server.address();
  if (!addr || typeof addr === "string") throw new Error("no port");
  return {
    url: `http://127.0.0.1:${addr.port}`,
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.close((err) => (err ? reject(err) : resolve()));
      }),
  };
}

function binaryEnv(home: string, serverUrl: string): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = {
    HOME: home,
    USERPROFILE: home,
    TMPDIR: join(home, "tmp"),
    PATH: "/usr/bin:/bin",
    NODE_ENV: "test",
    SDD_SERVER_URL: serverUrl,
  };
  mkdirSync(env.TMPDIR!, { recursive: true });
  // Do not inherit QWEN_* (or other LLM) credentials into the binary.
  return env;
}

/**
 * spawnSync would block the Vitest event loop so an in-process fixture HTTP
 * server could never answer fetch — use async spawn and wait for id:2.
 */
async function rpcInstall(
  binary: string,
  home: string,
  serverUrl: string,
  client: string,
): Promise<{ stdout: string; stderr: string; code: number | null }> {
  const input = [
    JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: {},
        clientInfo: { name: "vitest", version: "0" },
      },
    }),
    JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }),
    JSON.stringify({
      jsonrpc: "2.0",
      id: 2,
      method: "tools/call",
      params: {
        name: "sdd_install_framework",
        arguments: { client, os: process.platform === "win32" ? "win32" : process.platform === "linux" ? "linux" : "darwin" },
      },
    }),
    "",
  ].join("\n");

  const child: ChildProcessWithoutNullStreams = spawn(binary, [], {
    env: binaryEnv(home, serverUrl),
    stdio: ["pipe", "pipe", "pipe"],
  });

  let stdout = "";
  let stderr = "";
  child.stdout.setEncoding("utf8");
  child.stderr.setEncoding("utf8");
  child.stdout.on("data", (chunk: string) => {
    stdout += chunk;
  });
  child.stderr.on("data", (chunk: string) => {
    stderr += chunk;
  });

  child.stdin.write(input);
  // Keep stdin open until id:2 arrives so the MCP transport does not EOF early.

  const timeoutMs = 20_000;
  const started = Date.now();
  await new Promise<void>((resolve, reject) => {
    const onData = () => {
      if (stdout.split("\n").some((l) => l.includes('"id":2'))) {
        cleanup();
        resolve();
      }
    };
    const timer = setTimeout(() => {
      cleanup();
      reject(
        new Error(
          `timeout waiting for tools/call id:2 after ${timeoutMs}ms\nstdout=${stdout}\nstderr=${stderr}`,
        ),
      );
    }, timeoutMs);
    const cleanup = () => {
      clearTimeout(timer);
      child.stdout.off("data", onData);
    };
    child.stdout.on("data", onData);
    onData();
    child.on("error", (err) => {
      cleanup();
      reject(err);
    });
    child.on("exit", (code) => {
      if (!stdout.split("\n").some((l) => l.includes('"id":2'))) {
        cleanup();
        reject(
          new Error(
            `binary exited ${code} before id:2 (${Date.now() - started}ms)\nstdout=${stdout}\nstderr=${stderr}`,
          ),
        );
      }
    });
  });

  child.stdin.end();
  const code = await new Promise<number | null>((resolve) => {
    const killTimer = setTimeout(() => {
      child.kill("SIGKILL");
    }, 5_000);
    child.on("close", (c) => {
      clearTimeout(killTimer);
      resolve(c);
    });
  });

  return { stdout, stderr, code };
}

const tempHomes: string[] = [];
let fixture: FixtureServer | null = null;

afterEach(async () => {
  if (fixture) {
    await fixture.close();
    fixture = null;
  }
  for (const home of tempHomes.splice(0)) {
    rmSync(home, { recursive: true, force: true });
  }
});

describe("feature-14 local binary (MCP-02)", () => {
  it("should_name_five_os_arch_targets_in_build_script", () => {
    const script = readFileSync(
      join(ROOT, "scripts", "build-mcp-binary.sh"),
      "utf8",
    );
    expect(script).toContain("sdd-mcp-darwin-arm64");
    expect(script).toContain("sdd-mcp-darwin-x64");
    expect(script).toContain("sdd-mcp-linux-arm64");
    expect(script).toContain("sdd-mcp-linux-x64");
    expect(script).toContain("sdd-mcp-windows-x64.exe");
  });

  it("should_advertise_stdio_tools_from_compiled_host_binary", () => {
    const outfile = buildHostBinary();

    const input = [
      JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          protocolVersion: "2024-11-05",
          capabilities: {},
          clientInfo: { name: "vitest", version: "0" },
        },
      }),
      JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }),
      JSON.stringify({ jsonrpc: "2.0", id: 2, method: "tools/list" }),
      "",
    ].join("\n");

    const run = spawnSync(outfile, [], {
      input,
      encoding: "utf8",
      env: {
        PATH: "/usr/bin:/bin",
        HOME: process.env.HOME ?? tmpdir(),
        TMPDIR: process.env.TMPDIR ?? "/tmp",
        NODE_ENV: "test",
        SDD_SERVER_URL: "http://127.0.0.1:3040",
      },
      timeout: 15_000,
    });
    expect(run.signal, run.stderr).toBeNull();
    expect(run.status, run.stderr).toBe(0);

    const lines = run.stdout
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const toolsLine = lines.find((l) => l.includes('"id":2'));
    expect(toolsLine).toBeTruthy();
    const msg = JSON.parse(toolsLine!) as {
      result: { tools: { name: string }[] };
    };
    const names = msg.result.tools.map((t) => t.name);
    expect(names).toContain("sdd_install_framework");
    expect(names).toContain("sdd_update_framework");
    expect(names).not.toContain("sdd_list_versions");
    expect(names).not.toContain("sdd_get_key");
  }, 60_000);

  it("should_write_cursor_pack_ledger_via_compiled_binary_and_fixture_server", async () => {
    const binary = buildHostBinary();
    fixture = await startPackageFixture();
    const home = mkdtempSync(join(tmpdir(), "sdd-ac2-cursor-"));
    tempHomes.push(home);

    const { stdout, stderr, code } = await rpcInstall(
      binary,
      home,
      fixture.url,
      "cursor",
    );
    expect(code, stderr).toBe(0);

    const id2 = stdout
      .split("\n")
      .map((l) => l.trim())
      .find((l) => l.includes('"id":2'));
    expect(id2, stdout).toBeTruthy();
    const msg = JSON.parse(id2!) as {
      result?: { content?: { type: string; text: string }[]; isError?: boolean };
      error?: unknown;
    };
    expect(msg.result?.isError, id2).not.toBe(true);

    const ledgerPath = join(home, ".cursor", ".sdd-installed.json");
    expect(existsSync(ledgerPath)).toBe(true);
    const ledger = JSON.parse(readFileSync(ledgerPath, "utf8")) as {
      pack_complete?: boolean;
      files?: { skills?: string[] };
    };
    expect(ledger.pack_complete).toBe(true);
    expect(ledger.files?.skills).toContain("skills/spike/SKILL.md");
    expect(existsSync(join(home, ".cursor", "skills", "spike", "SKILL.md"))).toBe(
      true,
    );
    expect(existsSync(join(home, ".cursor", "framework.sdd.works.json"))).toBe(
      false,
    );
  }, 90_000);

  it("should_write_trae_cn_pack_under_trae_cn_not_cursor", async () => {
    const binary = buildHostBinary();
    fixture = await startPackageFixture();
    const home = mkdtempSync(join(tmpdir(), "sdd-ac2-trae-"));
    tempHomes.push(home);

    const { stdout, stderr, code } = await rpcInstall(
      binary,
      home,
      fixture.url,
      "trae-cn",
    );
    expect(code, stderr).toBe(0);

    const id2 = stdout
      .split("\n")
      .map((l) => l.trim())
      .find((l) => l.includes('"id":2'));
    expect(id2, stdout).toBeTruthy();

    const ledgerPath = join(home, ".trae-cn", ".sdd-installed.json");
    expect(existsSync(ledgerPath)).toBe(true);
    const ledger = JSON.parse(readFileSync(ledgerPath, "utf8")) as {
      pack_complete?: boolean;
      files?: { skills?: string[] };
    };
    expect(ledger.pack_complete).toBe(true);
    expect(ledger.files?.skills).toContain("skills/spike/SKILL.md");
    expect(
      existsSync(join(home, ".trae-cn", "skills", "spike", "SKILL.md")),
    ).toBe(true);
    expect(existsSync(join(home, ".cursor", ".sdd-installed.json"))).toBe(false);
  }, 90_000);
});
