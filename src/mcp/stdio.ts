import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createSddMcpServer } from "./create-server";

async function main() {
  const server = createSddMcpServer({ channel: "stdio", authorized: true });
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("MCP stdio failed:", error);
  process.exit(1);
});
