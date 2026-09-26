import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { installFramework, updateFramework } from "@/core/tools/install";
import type { InstallContext } from "@/core/tools/install";
import { listVersions } from "@/core/tools/list-versions";
import { getMcpBrandIcons, getMcpWebsiteUrl } from "./brand";
import { mcpToolDescription } from "./tool-descriptions";
import type { CreateSddMcpServerOptions } from "./server-options";

/**
 * Stdio MCP server for the compiled ~/.sdd/sdd-mcp binary.
 * Does not import Prisma, get-key, or HTTP install modules.
 */
export function createStdioMcpServer(
  options: Omit<CreateSddMcpServerOptions, "channel"> & {
    channel?: "stdio";
  } = { authorized: true },
): McpServer {
  const authorized = options.authorized;
  void authorized;

  const installCtx = (): InstallContext => {
    let clientInfo = options.clientInfo;
    try {
      clientInfo = clientInfo ?? server.server.getClientVersion();
    } catch {
      /* handshake may not expose client yet */
    }
    return {
      channel: "stdio",
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
      description: mcpToolDescription("sdd_list_versions"),
      inputSchema: {
        client: z
          .string()
          .optional()
          .describe("Optional client id for future path hints"),
      },
    },
    async () => listVersions({ channel: "stdio" }),
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
      },
    },
    async (args) => installFramework(args, installCtx()),
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
      },
    },
    async (args) => updateFramework(args, installCtx()),
  );

  return server;
}
