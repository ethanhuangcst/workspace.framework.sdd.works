import { t, type Locale } from "@/i18n/t";

export type McpToolName =
  | "sdd_list_versions"
  | "sdd_get_key"
  | "sdd_install_framework"
  | "sdd_update_framework";

const TOOL_KEYS: Record<McpToolName, string> = {
  sdd_list_versions: "mcp.tools.sdd_list_versions",
  sdd_get_key: "mcp.tools.sdd_get_key",
  sdd_install_framework: "mcp.tools.sdd_install_framework",
  sdd_update_framework: "mcp.tools.sdd_update_framework",
};

function resolveLocale(): Locale {
  const raw = process.env.MCP_TOOL_LOCALE?.trim();
  if (raw === "zh-Hans" || raw === "zh-Hant" || raw === "en") {
    return raw;
  }
  return "en";
}

/** Resolve MCP tool description from message catalogs (I18N-02). */
export function mcpToolDescription(tool: McpToolName, locale?: Locale): string {
  const loc = locale ?? resolveLocale();
  return t(loc, TOOL_KEYS[tool]);
}
