import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getKey } from "@/core/tools/get-key";
import {
  installFrameworkStub,
  updateFrameworkStub,
} from "@/core/tools/install";
import { listVersions } from "@/core/tools/list-versions";
import { getMcpBrandIcons, getMcpWebsiteUrl } from "./brand";

export const SDD_TOOL_NAMES = [
  "sdd_install_framework",
  "sdd_update_framework",
  "sdd_list_versions",
  "sdd_get_key",
] as const;

export type McpChannel = "stdio" | "http";

export type CreateSddMcpServerOptions = {
  channel: McpChannel;
  /** When false, sdd_get_key returns unauthorized. */
  authorized: boolean;
};

/**
 * Shared MCP server for framework.sdd.works (transport-agnostic tool core).
 */
export function createSddMcpServer(
  options: CreateSddMcpServerOptions,
): McpServer {
  const { channel, authorized } = options;
  const server = new McpServer({
    name: "framework.sdd.works",
    version: "0.1.0",
    websiteUrl: getMcpWebsiteUrl(),
    icons: getMcpBrandIcons(),
  });

  server.registerTool(
    "sdd_list_versions",
    {
      description:
        "framework.sdd.works: list available framework package versions and high-level inventory (skills/rules/other) from the Settings GitHub source. Read-only. Never returns key values. Failures: package_unavailable.",
      inputSchema: {
        client: z
          .string()
          .optional()
          .describe("Optional client id for future path hints"),
      },
    },
    async () => listVersions(),
  );

  server.registerTool(
    "sdd_get_key",
    {
      description:
        "framework.sdd.works: return plaintext key_value for key_name from the admin key store. Auth required on HTTP (same bearer as transport). Failures: not_found, unauthorized. Does not leak other key names.",
      inputSchema: {
        key_name: z.string().min(1).describe("Unique English key name"),
      },
    },
    async ({ key_name }) => getKey(key_name, { authorized }),
  );

  server.registerTool(
    "sdd_install_framework",
    {
      description:
        "framework.sdd.works: install framework package into local client paths (stdio). HTTP returns local_install_required until a local bridge exists. Sprint 6 implements writes.",
      inputSchema: {
        version: z.string().optional(),
        client: z.string().optional(),
        os: z.string().optional(),
      },
    },
    async () => installFrameworkStub(channel),
  );

  server.registerTool(
    "sdd_update_framework",
    {
      description:
        "framework.sdd.works: update an existing local install (stdio). HTTP returns local_install_required. Sprint 6 implements writes.",
      inputSchema: {
        version: z.string().optional(),
        client: z.string().optional(),
        os: z.string().optional(),
      },
    },
    async () => updateFrameworkStub(channel),
  );

  return server;
}
