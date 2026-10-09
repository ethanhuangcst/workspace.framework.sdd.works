import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getKey } from "@/core/tools/get-key";
import {
  installFrameworkHttp,
  updateFrameworkHttp,
} from "@/core/tools/install-http";
import type { InstallArgs, InstallContext } from "@/core/tools/install";
import type { InstallLedger } from "@/core/tools/install-plan";
import { getMcpBrandIcons, getMcpWebsiteUrl } from "./brand";
import { mcpToolDescription } from "./tool-descriptions";
import type { CreateSddMcpServerOptions } from "./server-options";
import { createStdioMcpServer } from "./create-server-stdio";

export type { McpChannel, CreateSddMcpServerOptions } from "./server-options";
export { createStdioMcpServer };

export const SDD_TOOL_NAMES = [
  "sdd_install_framework",
  "sdd_update_framework",
  "sdd_get_key",
] as const;

export const SDD_STDIO_TOOL_NAMES = [
  "sdd_install_framework",
  "sdd_update_framework",
] as const;

function withInventory(args: {
  version?: string;
  client?: string;
  os?: string;
  force?: boolean;
  installed_commit?: string;
  installed_version?: string;
  inventory?: { ledger: unknown; missing: string[] } | undefined;
}): InstallArgs {
  return {
    version: args.version,
    client: args.client,
    os: args.os,
    force: args.force,
    installed_commit: args.installed_commit,
    installed_version: args.installed_version,
    inventory: args.inventory
      ? {
          ledger: (args.inventory.ledger ?? null) as InstallLedger | null,
          missing: args.inventory.missing,
        }
      : undefined,
  };
}

/**
 * Shared MCP server for framework.sdd.works (transport-agnostic tool core).
 * Stdio binary entry uses createStdioMcpServer so Prisma stays out of the compile.
 */
export function createSddMcpServer(
  options: CreateSddMcpServerOptions,
): McpServer {
  const { channel, authorized } = options;

  if (channel === "stdio") {
    return createStdioMcpServer({
      authorized: options.authorized,
      clientInfo: options.clientInfo,
      installHome: options.installHome,
      skipLlm: options.skipLlm,
    });
  }

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
      skipLlm: true,
    };
  };
  const server = new McpServer({
    name: "framework.sdd.works",
    version: "0.1.0",
    websiteUrl: getMcpWebsiteUrl(),
    icons: getMcpBrandIcons(),
  });

  server.registerTool(
    "sdd_get_key",
    {
      description: mcpToolDescription("sdd_get_key"),
      inputSchema: {
        key_name: z.string(),
      },
    },
    async ({ key_name }) => getKey(key_name, { authorized }),
  );

  server.registerTool(
    "sdd_install_framework",
    {
      description: mcpToolDescription("sdd_install_framework"),
      inputSchema: {
        version: z.string().optional(),
        client: z.string().optional(),
        os: z.string().optional(),
        force: z.boolean().optional(),
        installed_commit: z.string().optional(),
        installed_version: z.string().optional(),
        inventory: z
          .object({
            ledger: z.unknown().nullable(),
            missing: z.array(z.string()),
          })
          .optional()
          .describe(
            "Disk inventory. Omit it to get writer_required. Send ledger null when the file is absent.",
          ),
      },
    },
    async (args) => installFrameworkHttp(withInventory(args), installCtx()),
  );

  server.registerTool(
    "sdd_update_framework",
    {
      description: mcpToolDescription("sdd_update_framework"),
      inputSchema: {
        version: z.string().optional(),
        client: z.string().optional(),
        os: z.string().optional(),
        force: z.boolean().optional(),
        installed_commit: z.string().optional(),
        installed_version: z.string().optional(),
        inventory: z
          .object({
            ledger: z.unknown().nullable(),
            missing: z.array(z.string()),
          })
          .optional(),
      },
    },
    async (args) => updateFrameworkHttp(withInventory(args), installCtx()),
  );

  return server;
}
