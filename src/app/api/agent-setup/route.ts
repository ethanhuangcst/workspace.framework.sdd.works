import { readFileSync } from "node:fs";
import { join } from "node:path";

export async function GET() {
  const promptPath = join(process.cwd(), "public", "agent-setup", "prompt.md");
  const body = readFileSync(promptPath, "utf8");
  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
