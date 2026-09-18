import { readFileSync } from "node:fs";
import { join } from "node:path";

export async function GET() {
  const scriptPath = join(process.cwd(), "scripts", "install.sh");
  const body = readFileSync(scriptPath, "utf8");
  return new Response(body, {
    headers: {
      "Content-Type": "text/x-shellscript",
      "Cache-Control": "no-cache",
    },
  });
}
