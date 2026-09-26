import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createStdioMcpServer } from "./create-server-stdio";

async function main() {
  const server = createStdioMcpServer({ authorized: true });
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("MCP stdio failed:", error);
  process.exit(1);
});
