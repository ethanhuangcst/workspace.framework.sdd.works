import { toolError } from "./errors";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

/** Sprint 6 will implement filesystem writes on stdio. */
export async function installFrameworkStub(channel: "stdio" | "http"): Promise<CallToolResult> {
  if (channel === "http") {
    return toolError(
      "local_install_required",
      "HTTP MCP cannot write the caller filesystem. Use stdio MCP on the developer machine (Sprint 6).",
    );
  }
  return toolError(
    "not_implemented",
    "sdd_install_framework is not implemented until Sprint 6.",
  );
}

export async function updateFrameworkStub(channel: "stdio" | "http"): Promise<CallToolResult> {
  if (channel === "http") {
    return toolError(
      "local_install_required",
      "HTTP MCP cannot write the caller filesystem. Use stdio MCP on the developer machine (Sprint 6).",
    );
  }
  return toolError(
    "not_implemented",
    "sdd_update_framework is not implemented until Sprint 6.",
  );
}
