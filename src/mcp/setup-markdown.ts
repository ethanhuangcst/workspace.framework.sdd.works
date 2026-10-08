import {
  getAgentSetupUrl,
  getMcpHttpUrl,
  getMcpWebsiteUrl,
  isLocalMcpDev,
} from "@/mcp/brand";

const PROD_MCP = "https://sdd.works/mcp";
const PROD_ORIGIN = "https://sdd.works";
const LEGACY_ORIGIN = "https://framework.sdd.works";
const LEGACY_MCP = `${LEGACY_ORIGIN}/mcp`;

/** Substitute production MCP URL and site origin for local / alternate bases. */
export function rewriteSetupMarkdownOrigins(template: string): string {
  const mcpUrl = getMcpHttpUrl();
  const setupUrl = getAgentSetupUrl();
  const website = getMcpWebsiteUrl().replace(/\/$/, "");
  let body = template
    .replaceAll(PROD_MCP, mcpUrl)
    .replaceAll(LEGACY_MCP, mcpUrl);

  if (isLocalMcpDev()) {
    // Pack base and leftover production origin only — do not touch GitHub release hosts.
    body = body
      .replaceAll(PROD_ORIGIN, website)
      .replaceAll(LEGACY_ORIGIN, website);
  } else {
    body = body
      .replaceAll("https://sdd.works/agent-setup", setupUrl)
      .replaceAll(`${LEGACY_ORIGIN}/agent-setup`, setupUrl)
      .replaceAll(PROD_ORIGIN, website)
      .replaceAll(LEGACY_ORIGIN, website);
  }

  return body;
}

/** Append local MCP HTTP bearer note when operator token is set (full setup only). */
export function appendLocalMcpAuthNote(body: string): string {
  if (!isLocalMcpDev() || !process.env.MCP_AUTH_TOKEN?.trim()) {
    return body;
  }

  const mcpUrl = getMcpHttpUrl();
  return `${body}

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
