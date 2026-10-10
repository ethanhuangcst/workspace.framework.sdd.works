import { readFileSync } from "node:fs";
import { join } from "node:path";
import { rewriteSetupMarkdownOrigins } from "@/mcp/setup-markdown";

export async function GET() {
  const promptPath = join(
    process.cwd(),
    "public",
    "agent-setup",
    "install-full.md",
  );
  const template = readFileSync(promptPath, "utf8");
  const body = rewriteSetupMarkdownOrigins(template);
  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
