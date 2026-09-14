import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

export type McpErrorCode =
  | "not_found"
  | "unauthorized"
  | "invalid_input"
  | "package_unavailable"
  | "local_install_required"
  | "not_implemented";

export function toolOk(data: unknown): CallToolResult {
  return {
    content: [{ type: "text", text: JSON.stringify(data) }],
  };
}

export function toolError(
  code: McpErrorCode,
  message: string,
): CallToolResult {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify({ error: { code, message } }),
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
