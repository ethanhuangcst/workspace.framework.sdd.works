import { readFileSync } from "node:fs";
import { join } from "node:path";
import { rewriteSetupMarkdownOrigins } from "@shared/setup/setup-markdown";

export async function GET() {
  const promptPath = join(process.cwd(), "lite-prompts", "node.md");
  const template = readFileSync(promptPath, "utf8");
  const body = rewriteSetupMarkdownOrigins(template);
  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
