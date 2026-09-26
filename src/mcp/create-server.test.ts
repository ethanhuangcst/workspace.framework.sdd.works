import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { PrismaClient } from "@prisma/client";
import { setPackageFetchForTests } from "@/core/tools/package-fetch";
import { clearPathDetectCache } from "@/core/path-detect";
import {
  setEnsureCacheFreshDepsForTests,
} from "@/core/sync/ensure-cache-fresh";
import { readPackageManifest } from "@/core/sync/manifest";
import {
  MANIFEST_FILENAME,
  packageTarPath,
  unpackedDir,
} from "@/core/sync/paths";
import { parseToolJson } from "@/core/tools/errors";
import { encryptKeyValue } from "@/lib/keys-crypto";
import {
  createSddMcpServer,
  SDD_STDIO_TOOL_NAMES,
  SDD_TOOL_NAMES,
} from "./create-server";

const hasDb = Boolean(process.env.DATABASE_URL);
const FIXTURE_KEY =
  process.env.KEYS_ENCRYPTION_KEY ??
  "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

describe("createSddMcpServer tool contracts", () => {
  it("should_advertise_two_tools_on_stdio", async () => {
    const server = createSddMcpServer({ channel: "stdio", authorized: true });
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();
    const client = new Client({ name: "test", version: "0.0.0" });
    await server.connect(serverTransport);
    await client.connect(clientTransport);
    const listed = await client.listTools();
    const names = listed.tools.map((t) => t.name).sort();
    expect(names).toEqual([...SDD_STDIO_TOOL_NAMES].sort());
    expect(names).not.toContain("sdd_get_key");
    expect(names).not.toContain("sdd_list_versions");
    const init = client.getServerVersion();
    expect(init?.name).toBe("framework.sdd.works");
    expect(init?.icons?.length).toBeGreaterThanOrEqual(2);
    expect(init?.icons?.[0]?.src).toMatch(/^https?:\/\/.+\/sdd-mark\.png$/);
    expect(init?.icons?.[1]?.src.startsWith("data:image/png;base64,")).toBe(
      true,
    );
    await client.close();
    await server.close();
  });

  it("should_advertise_brand_icons_on_http_initialize", async () => {
    const server = createSddMcpServer({ channel: "http", authorized: true });
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();
    const client = new Client({ name: "test", version: "0.0.0" });
    await server.connect(serverTransport);
    await client.connect(clientTransport);
    const init = client.getServerVersion();
    expect(init?.icons?.length).toBeGreaterThanOrEqual(2);
    expect(init?.icons?.[0]?.src).toMatch(/^https?:\/\/.+\/sdd-mark\.png$/);
    expect(init?.icons?.[1]?.src.startsWith("data:image/png;base64,")).toBe(
      true,
    );
    await client.close();
    await server.close();
  });

  it("should_advertise_three_tools_on_http", async () => {
    const server = createSddMcpServer({ channel: "http", authorized: true });
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();
    const client = new Client({ name: "test", version: "0.0.0" });
    await server.connect(serverTransport);
    await client.connect(clientTransport);
    const listed = await client.listTools();
    const names = listed.tools.map((t) => t.name).sort();
    expect(names).toEqual([...SDD_TOOL_NAMES].sort());
    expect(names).toContain("sdd_get_key");
    expect(names).not.toContain("sdd_list_versions");
    await client.close();
    await server.close();
  });

  it("should_return_unauthorized_for_get_key_when_not_authorized", async () => {
    const server = createSddMcpServer({ channel: "http", authorized: false });
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();
    const client = new Client({ name: "test", version: "0.0.0" });
    await server.connect(serverTransport);
    await client.connect(clientTransport);
    const result = await client.callTool({
      name: "sdd_get_key",
      arguments: { key_name: "any" },
    });
    const body = parseToolJson<{ error: { code: string } }>(
      result as never,
    );
    expect(body.error.code).toBe("unauthorized");
    await client.close();
    await server.close();
  });
});

const originalCacheDir = process.env.SDD_PACKAGE_CACHE_DIR;

function seedHttpCache(sha: string, version: string): void {
  const dir = mkdtempSync(join(tmpdir(), "sdd-mcp-cache-"));
  process.env.SDD_PACKAGE_CACHE_DIR = dir;
  mkdirSync(join(unpackedDir(sha), "skills/tdd"), { recursive: true });
  writeFileSync(join(unpackedDir(sha), "skills/tdd/SKILL.md"), "# tdd\n");
  writeFileSync(packageTarPath(sha), "fake-tarball");
  writeFileSync(
    join(dir, MANIFEST_FILENAME),
    JSON.stringify({
      latestCommit: sha,
      latestVersion: version,
      versions: [{ id: version, commitSha: sha }],
      inventory: { skills: ["tdd"], rules: [], agents: [], workflows: [], other: [] },
      syncedAt: "2026-01-01T00:00:00.000Z",
    }),
  );
}

function mockCacheFreshAsMatchingCache(): void {
  setEnsureCacheFreshDepsForTests({
    readManifest: readPackageManifest,
    resolveLive: async () => {
      const manifest = readPackageManifest();
      if (!manifest) {
        return { code: "sync_error", message: "sync_pending" };
      }
      return { commitSha: manifest.latestCommit, version: manifest.latestVersion };
    },
    sync: async () => {
      const manifest = readPackageManifest();
      return {
        status: "unchanged" as const,
        commitSha: manifest?.latestCommit ?? "sha-unknown",
        version: manifest?.latestVersion ?? "main",
      };
    },
    clearVersionsCache: () => {},
  });
}

describe("MCP install/update contracts", () => {
  afterEach(() => {
    setPackageFetchForTests(null);
    setEnsureCacheFreshDepsForTests(null);
    clearPathDetectCache();
    if (originalCacheDir === undefined) {
      delete process.env.SDD_PACKAGE_CACHE_DIR;
    } else {
      process.env.SDD_PACKAGE_CACHE_DIR = originalCacheDir;
    }
  });

  it("should_install_over_stdio_and_return_package_url_on_http", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-mcp-home-"));
    const pkg = mkdtempSync(join(tmpdir(), "sdd-mcp-pkg-"));
    mkdirSync(join(pkg, "skills/tdd"), { recursive: true });
    writeFileSync(join(pkg, "skills/tdd/SKILL.md"), "# tdd\n");
    setPackageFetchForTests(async () => ({
      version: "v1.0.0",
      commitSha: "sha-v1.0.0",
      tempDir: pkg,
    }));

    const stdio = createSddMcpServer({
      channel: "stdio",
      authorized: true,
      clientInfo: { name: "cursor" },
      installHome: home,
      skipLlm: true,
    });
    const [c1, s1] = InMemoryTransport.createLinkedPair();
    const client = new Client({ name: "cursor", version: "0.0.0" });
    await stdio.connect(s1);
    await client.connect(c1);
    const installed = await client.callTool({
      name: "sdd_install_framework",
      arguments: { client: "cursor", os: "darwin" },
    });
    const body = parseToolJson<{ version: string; resolution_source: string }>(
      installed as never,
    );
    expect(body.version).toBe("v1.0.0");
    expect(body.resolution_source).toBe("seed");
    await client.close();
    await stdio.close();

    seedHttpCache("sha-http-mcp", "v1.0.0");
    mockCacheFreshAsMatchingCache();
    const httpWithHome = createSddMcpServer({
      channel: "http",
      authorized: true,
      installHome: home,
      skipLlm: true,
    });
    const [c2, s2] = InMemoryTransport.createLinkedPair();
    const httpClient = new Client({ name: "cursor", version: "0.0.0" });
    await httpWithHome.connect(s2);
    await httpClient.connect(c2);
    const httpInstall = await httpClient.callTool({
      name: "sdd_update_framework",
      arguments: { client: "cursor", os: "darwin" },
    });
    const httpBody = parseToolJson<{ packageUrl: string; version: string }>(
      httpInstall as never,
    );
    expect(httpBody.packageUrl).toContain("/api/sdd/package");
    expect(httpBody.version).toBe("v1.0.0");
    await httpClient.close();
    await httpWithHome.close();

    seedHttpCache("sha-http-portable", "v1.0.0");
    mockCacheFreshAsMatchingCache();
    const httpProd = createSddMcpServer({ channel: "http", authorized: true });
    const [c3, s3] = InMemoryTransport.createLinkedPair();
    const prodClient = new Client({ name: "cursor", version: "0.0.0" });
    await httpProd.connect(s3);
    await prodClient.connect(c3);
    const prodInstall = await prodClient.callTool({
      name: "sdd_install_framework",
      arguments: { client: "cursor", os: "darwin" },
    });
    const prodBody = parseToolJson<{
      extractTarget: string;
      previousManifest: unknown;
    }>(prodInstall as never);
    expect(prodBody.extractTarget).toBe("~/.cursor");
    expect(prodBody.previousManifest).toBeNull();
    await prodClient.close();
    await httpProd.close();
  });
});

describe.skipIf(!hasDb)("MCP get_key with DB", () => {
  const db = new PrismaClient();
  const keyName = `mcp_it_${Date.now()}`;

  beforeEach(async () => {
    process.env.KEYS_ENCRYPTION_KEY = FIXTURE_KEY;
    await db.key.deleteMany({ where: { keyName } });
    await db.key.create({
      data: {
        keyName,
        keyDescription: "mcp it",
        keyValue: encryptKeyValue("sk-mcp-secret", FIXTURE_KEY),
      },
    });
  });

  afterEach(async () => {
    await db.key.deleteMany({ where: { keyName } });
    if (process.env.KEYS_ENCRYPTION_KEY === FIXTURE_KEY) {
      delete process.env.KEYS_ENCRYPTION_KEY;
    }
  });

  it("should_return_plaintext_key_value_when_authorized_on_http", async () => {
    const server = createSddMcpServer({ channel: "http", authorized: true });
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();
    const client = new Client({ name: "test", version: "0.0.0" });
    await server.connect(serverTransport);
    await client.connect(clientTransport);
    const result = await client.callTool({
      name: "sdd_get_key",
      arguments: { key_name: keyName },
    });
    const body = parseToolJson<{ key_name: string; key_value: string }>(
      result as never,
    );
    expect(body.key_name).toBe(keyName);
    expect(body.key_value).toBe("sk-mcp-secret");
    await client.close();
    await server.close();
  });

  it("should_return_not_found_without_leaking_names", async () => {
    const server = createSddMcpServer({ channel: "http", authorized: true });
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();
    const client = new Client({ name: "test", version: "0.0.0" });
    await server.connect(serverTransport);
    await client.connect(clientTransport);
    const result = await client.callTool({
      name: "sdd_get_key",
      arguments: { key_name: "does_not_exist_xyz" },
    });
    const raw = JSON.stringify(result);
    expect(raw).not.toContain(keyName);
    expect(raw).not.toContain("sk-mcp-secret");
    const body = parseToolJson<{ error: { code: string } }>(result as never);
    expect(body.error.code).toBe("not_found");
    await client.close();
    await server.close();
  });
});
