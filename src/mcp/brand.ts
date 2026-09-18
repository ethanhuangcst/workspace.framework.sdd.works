import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { MCP_MARK_BASE64 } from "./generated/mcp-mark-base64";

export type McpIcon = {
  src: string;
  mimeType: string;
  sizes?: string[];
};

const MCP_DIR = dirname(fileURLToPath(import.meta.url));
const MCP_MARK_RELATIVE = join("assets", "sdd-mark.png");

/** Absolute path to the square MCP list icon shipped beside MCP source. */
export function resolveMcpMarkPath(): string {
  return join(MCP_DIR, MCP_MARK_RELATIVE);
}

function readMarkBytes(): Buffer | null {
  const candidates = [
    resolveMcpMarkPath(),
    join(MCP_DIR, "..", "..", "public", "sdd-mark.png"),
    join(process.cwd(), "public", "sdd-mark.png"),
  ];
  for (const path of candidates) {
    try {
      return readFileSync(path);
    } catch {
      /* try next */
    }
  }
  try {
    return Buffer.from(MCP_MARK_BASE64, "base64");
  } catch {
    return null;
  }
}

/** Small PNG data URI fallback when clients cannot fetch HTTPS assets. */
export function getMcpMarkDataUri(): string | null {
  const buf = readMarkBytes();
  if (!buf) return null;
  return `data:image/png;base64,${buf.toString("base64")}`;
}

/**
 * Square SDD mark for MCP Connected-list tiles.
 * HTTPS URL first (clients fetch); compact data URI fallback (stdio / offline).
 * Do not use the wide portal wordmark here — it does not read at 16–24px.
 */
export function getMcpBrandIcons(): McpIcon[] {
  const base = getMcpWebsiteUrl().replace(/\/$/, "");
  const icons: McpIcon[] = [
    {
      src: `${base}/sdd-mark.png`,
      mimeType: "image/png",
      sizes: ["128x128", "48x48"],
    },
  ];
  const dataUri = getMcpMarkDataUri();
  if (dataUri) {
    icons.push({
      src: dataUri,
      mimeType: "image/png",
      sizes: ["128x128"],
    });
  }
  return icons;
}

export function getMcpWebsiteUrl(): string {
  return (
    process.env.PUBLIC_BASE_URL?.trim() || "https://framework.sdd.works"
  );
}

/** Public Streamable HTTP MCP URL (prod: same host /mcp; local: sibling port 3041). */
export function getMcpHttpUrl(): string {
  const explicit = process.env.MCP_PUBLIC_URL?.trim();
  if (explicit) return explicit;

  const base = process.env.PUBLIC_BASE_URL?.trim();
  const port = process.env.MCP_HTTP_PORT?.trim() || "3041";
  const path = process.env.MCP_HTTP_PATH?.trim() || "/mcp";
  let host = process.env.MCP_HTTP_HOST?.trim() || "127.0.0.1";
  if (host === "0.0.0.0") host = "127.0.0.1";

  if (base && /localhost|127\.0\.0\.1/i.test(base)) {
    return `http://${host}:${port}${path}`;
  }
  return `${getMcpWebsiteUrl().replace(/\/$/, "")}${path}`;
}

export function getAgentSetupUrl(): string {
  return `${getMcpWebsiteUrl().replace(/\/$/, "")}/agent-setup`;
}

export function isLocalMcpDev(): boolean {
  const base = process.env.PUBLIC_BASE_URL?.trim() ?? "";
  return /localhost|127\.0\.0\.1/i.test(base);
}
