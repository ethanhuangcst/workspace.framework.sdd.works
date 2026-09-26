/**
 * Feature-14 spike only. Not the product binary.
 * Speaks newline-delimited MCP stdio and writes one skill file plus a ledger
 * under SPIKE_CLIENT_ROOT. No SDK, no secrets, no network.
 */
import { createInterface } from "node:readline";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";

type Rpc = {
  jsonrpc?: string;
  id?: number | string;
  method?: string;
  params?: {
    name?: string;
    arguments?: { client_root?: string };
  };
};

const allowedRoot = process.env.SPIKE_CLIENT_ROOT
  ? resolve(process.env.SPIKE_CLIENT_ROOT)
  : "";

function send(message: unknown) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}

function assertClientRoot(clientRoot: string): string {
  if (!allowedRoot) {
    throw new Error("SPIKE_CLIENT_ROOT is required");
  }
  if (!clientRoot || clientRoot.includes("\0")) {
    throw new Error("client_root refused");
  }
  const root = resolve(clientRoot);
  const rel = relative(allowedRoot, root);
  if (rel.startsWith("..") || resolve(allowedRoot, rel) !== root) {
    throw new Error("client_root is outside SPIKE_CLIENT_ROOT");
  }
  return root;
}

function writeLedger(clientRoot: string) {
  const root = assertClientRoot(clientRoot);
  const relFile = join("skills", "spike", "SKILL.md");
  mkdirSync(join(root, "skills", "spike"), { recursive: true });
  writeFileSync(join(root, relFile), "# feature-14 spike\n");
  const ledger = {
    pack_complete: true,
    package_version: "spike",
    package_commit: "spike",
    files: [relFile],
  };
  const manifestPath = join(root, ".sdd-installed.json");
  writeFileSync(manifestPath, `${JSON.stringify(ledger, null, 2)}\n`);
  return { manifestPath, files: ledger.files, pack_complete: true };
}

function onMessage(msg: Rpc) {
  if (msg.method === "initialize") {
    send({
      jsonrpc: "2.0",
      id: msg.id,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: { name: "sdd-mcp-spike", version: "0.0.0-spike" },
      },
    });
    return;
  }
  if (msg.method === "notifications/initialized") return;
  if (msg.method === "tools/list") {
    send({
      jsonrpc: "2.0",
      id: msg.id,
      result: {
        tools: [
          {
            name: "sdd_install_framework",
            description:
              "Spike only. Writes skills/spike/SKILL.md and .sdd-installed.json under client_root when that path is inside SPIKE_CLIENT_ROOT. Not the product installer.",
            inputSchema: {
              type: "object",
              properties: { client_root: { type: "string" } },
              required: ["client_root"],
            },
          },
        ],
      },
    });
    return;
  }
  if (msg.method === "tools/call" && msg.params?.name === "sdd_install_framework") {
    try {
      const written = writeLedger(String(msg.params.arguments?.client_root ?? ""));
      send({
        jsonrpc: "2.0",
        id: msg.id,
        result: { content: [{ type: "text", text: JSON.stringify(written) }] },
      });
    } catch (error) {
      const text = error instanceof Error ? error.message : "write failed";
      send({
        jsonrpc: "2.0",
        id: msg.id,
        result: { isError: true, content: [{ type: "text", text }] },
      });
    }
  }
}

const lines = createInterface({ input: process.stdin });
lines.on("line", (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;
  try {
    onMessage(JSON.parse(trimmed) as Rpc);
  } catch {
    process.stderr.write("ignored non-json line\n");
  }
});
