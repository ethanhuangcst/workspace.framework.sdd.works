import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  getAgentSetupUrl,
  getMcpHttpUrl,
  getMcpWebsiteUrl,
  isLocalMcpDev,
} from "@/mcp/brand";

const PROD_MCP = "https://framework.sdd.works/mcp";
const PROD_ORIGIN = "https://framework.sdd.works";

function renderPrompt(template: string): string {
  const mcpUrl = getMcpHttpUrl();
  const setupUrl = getAgentSetupUrl();
  const website = getMcpWebsiteUrl().replace(/\/$/, "");
  let body = template.replaceAll(PROD_MCP, mcpUrl);

  if (isLocalMcpDev()) {
    // Pack base and leftover production origin only — do not touch GitHub release hosts.
    body = body.replaceAll(PROD_ORIGIN, website);
  } else {
    body = body.replaceAll(
      "https://framework.sdd.works/agent-setup",
      setupUrl,
    );
  }

  if (isLocalMcpDev() && process.env.MCP_AUTH_TOKEN?.trim()) {
    body += `

## Local development (auth required)

MCP HTTP on localhost requires \`Authorization: Bearer\` when \`MCP_AUTH_TOKEN\` is set in the operator \`.env.local\`. For Cursor, merge:

\`\`\`json
"framework.sdd.works": {
  "url": "${mcpUrl}",
  "headers": {
    "Authorization": "Bearer <MCP_AUTH_TOKEN from operator .env.local>"
  }
}
\`\`\`

Read \`MCP_AUTH_TOKEN\` from the project's \`.env.local\` only when the user is running local E2E against this repo.
`;
  }

  return body;
}

export async function GET() {
  const promptPath = join(process.cwd(), "public", "agent-setup", "prompt.md");
  const template = readFileSync(promptPath, "utf8");
  const body = renderPrompt(template);
  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
