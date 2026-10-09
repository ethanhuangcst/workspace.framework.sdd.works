import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

export type McpErrorCode =
  | "not_found"
  | "unauthorized"
  | "invalid_input"
  | "package_unavailable"
  | "local_install_required"
  | "not_implemented"
  | "client_unknown"
  | "os_unsupported"
  | "path_rejected"
  | "client_config_unresolved"
  | "llm_unavailable"
  | "already_up_to_date"
  | "sync_pending"
  | "cache_stale"
  | "fixture_pack"
  | "version_not_found";

export function toolOk(data: unknown): CallToolResult {
  return {
    content: [{ type: "text", text: JSON.stringify(data) }],
  };
}

export function toolError(
  code: McpErrorCode,
  message?: string,
): CallToolResult {
  const error = message === undefined ? { code } : { code, message };
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify({ error }),
      },
    ],
    isError: true,
  };
}

export function parseToolJson<T>(result: CallToolResult): T {
  const text = result.content.find((c) => c.type === "text");
  if (!text || text.type !== "text") {
    throw new Error("expected text content");
  }
  return JSON.parse(text.text) as T;
}
