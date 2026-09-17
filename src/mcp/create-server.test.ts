import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { PrismaClient } from "@prisma/client";
import {
  createFixtureGitHubPort,
  setGitHubPortForTests,
  clearFrameworkTreeCache,
} from "@/github/sync";
import { encryptKeyValue } from "@/lib/keys-crypto";
import { parseToolJson } from "@/core/tools/errors";
import { clearListVersionsCache } from "@/core/tools/list-versions";
import { createSddMcpServer, SDD_TOOL_NAMES } from "./create-server";

const hasDb = Boolean(process.env.DATABASE_URL);
const FIXTURE_KEY =
  process.env.KEYS_ENCRYPTION_KEY ??
  "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

describe("createSddMcpServer tool contracts", () => {
  afterEach(() => {
    setGitHubPortForTests(null);
    clearFrameworkTreeCache();
    clearListVersionsCache();
  });

  it("should_advertise_four_sdd_tools", async () => {
    const server = createSddMcpServer({ channel: "stdio", authorized: true });
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();
    const client = new Client({ name: "test", version: "0.0.0" });
    await server.connect(serverTransport);
    await client.connect(clientTransport);
    const listed = await client.listTools();
    const names = listed.tools.map((t) => t.name).sort();
    expect(names).toEqual([...SDD_TOOL_NAMES].sort());
    const init = client.getServerVersion();
    expect(init?.name).toBe("framework.sdd.works");
    expect(init?.icons?.length).toBeGreaterThan(0);
    expect(init?.icons?.[0]?.src.startsWith("data:image/png;base64,")).toBe(
      true,
    );
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

describe.skipIf(!hasDb)("MCP get_key and list_versions with DB", () => {
  const db = new PrismaClient();
  const keyName = `mcp_it_${Date.now()}`;

  beforeEach(async () => {
    process.env.KEYS_ENCRYPTION_KEY = FIXTURE_KEY;
    process.env.GITHUB_FIXTURE = "1";
    setGitHubPortForTests(createFixtureGitHubPort());
    clearListVersionsCache();
    await db.setting.upsert({
      where: { id: "singleton" },
      create: {
        id: "singleton",
        githubUrl: "https://github.com/fixture/sdd-framework",
      },
      update: { githubUrl: "https://github.com/fixture/sdd-framework" },
    });
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
    setGitHubPortForTests(null);
    clearListVersionsCache();
    delete process.env.GITHUB_FIXTURE;
  });

  it("should_return_plaintext_key_value_when_authorized", async () => {
    const server = createSddMcpServer({ channel: "stdio", authorized: true });
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
    const server = createSddMcpServer({ channel: "stdio", authorized: true });
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

  it("should_list_versions_and_inventory_without_key_values", async () => {
    const server = createSddMcpServer({ channel: "stdio", authorized: true });
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();
    const client = new Client({ name: "test", version: "0.0.0" });
    await server.connect(serverTransport);
    await client.connect(clientTransport);
    const result = await client.callTool({
      name: "sdd_list_versions",
      arguments: {},
    });
    const body = parseToolJson<{
      versions: { id: string }[];
      inventory: { skills: string[]; rules: string[] };
      paths_version: number;
    }>(result as never);
    expect(body.versions.length).toBeGreaterThan(0);
    expect(body.inventory.skills.length).toBeGreaterThan(0);
    expect(body.paths_version).toBeGreaterThanOrEqual(1);
    expect(JSON.stringify(body)).not.toContain("sk-mcp-secret");
    await client.close();
    await server.close();
  });
});
