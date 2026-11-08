import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  appendLocalMcpAuthNote,
  rewriteSetupMarkdownOrigins,
} from "@shared/setup/setup-markdown";

export async function GET() {
  const promptPath = join(process.cwd(), "lite-prompts", "prompt.md");
  const template = readFileSync(promptPath, "utf8");
  const body = appendLocalMcpAuthNote(rewriteSetupMarkdownOrigins(template));
  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
