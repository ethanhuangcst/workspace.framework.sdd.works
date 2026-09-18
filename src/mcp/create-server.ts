import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getKey } from "@/core/tools/get-key";
import { installFramework, updateFramework } from "@/core/tools/install";
import type { InstallContext } from "@/core/tools/install";
import { listVersions } from "@/core/tools/list-versions";
import { getMcpBrandIcons, getMcpWebsiteUrl } from "./brand";

export const SDD_TOOL_NAMES = [
  "sdd_install_framework",
  "sdd_update_framework",
  "sdd_list_versions",
  "sdd_get_key",
] as const;

export const SDD_STDIO_TOOL_NAMES = [
  "sdd_install_framework",
  "sdd_update_framework",
  "sdd_list_versions",
] as const;

export type McpChannel = "stdio" | "http";

export type CreateSddMcpServerOptions = {
  channel: McpChannel;
  /** When false, sdd_get_key returns unauthorized. */
  authorized: boolean;
  clientInfo?: { name?: string };
  installHome?: string;
  skipLlm?: boolean;
};

/**
 * Shared MCP server for framework.sdd.works (transport-agnostic tool core).
 */
export function createSddMcpServer(
  options: CreateSddMcpServerOptions,
): McpServer {
  const { channel, authorized } = options;

  const installCtx = (): InstallContext => {
    let clientInfo = options.clientInfo;
    try {
      clientInfo = clientInfo ?? server.server.getClientVersion();
    } catch {
      /* handshake may not expose client yet */
    }
    return {
      channel,
      clientInfo,
      home: options.installHome,
      userProfile: options.installHome,
      env: options.installHome
        ? { HOME: options.installHome, USERPROFILE: options.installHome }
        : undefined,
      skipLlm: options.skipLlm,
    };
  };
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
    async () => listVersions({ channel }),
  );

  if (channel === "http") {
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
  }

  server.registerTool(
    "sdd_install_framework",
    {
      description:
        "framework.sdd.works: install framework package. Stdio writes local paths directly. HTTP returns packageUrl + paths + manifest + instructions for AI shell extraction. Optional force=true reinstalls even when version matches. Failures: path_rejected, client_unknown, already_up_to_date, package_unavailable, sync_pending.",
      inputSchema: {
        version: z.string().optional(),
        client: z.string().optional(),
        os: z.string().optional(),
        force: z.boolean().optional(),
        installed_commit: z.string().optional(),
        installed_version: z.string().optional(),
      },
    },
    async (args) => installFramework(args, installCtx()),
  );

  server.registerTool(
    "sdd_update_framework",
    {
      description:
        "framework.sdd.works: update an existing install. Alias of sdd_install_framework. Stdio writes locally; HTTP returns packageUrl + instructions for AI extraction. Optional force=true reinstalls even when version matches. Failures: already_up_to_date, path_rejected, package_unavailable, sync_pending.",
      inputSchema: {
        version: z.string().optional(),
        client: z.string().optional(),
        os: z.string().optional(),
        force: z.boolean().optional(),
        installed_commit: z.string().optional(),
        installed_version: z.string().optional(),
      },
    },
    async (args) => updateFramework(args, installCtx()),
  );

  return server;
}
