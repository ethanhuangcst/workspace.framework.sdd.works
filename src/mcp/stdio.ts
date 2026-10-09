import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createStdioMcpServer } from "./create-server-stdio";
import { runWriteMode } from "./write-mode";

async function main() {
  if (process.argv.includes("--write")) {
    const code = await runWriteMode(process.argv.slice(2));
    process.exit(code);
  }
  const server = createStdioMcpServer({ authorized: true });
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("MCP stdio failed:", error);
  process.exit(1);
});
