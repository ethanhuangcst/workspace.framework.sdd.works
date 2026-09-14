import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { db } from "@/lib/db";
import { decryptKeyValue } from "@/lib/keys-crypto";
import { toolError, toolOk } from "./errors";

export type GetKeyAuth = {
  /** False → unauthorized (HTTP without bearer should never reach here). */
  authorized: boolean;
};

export async function getKey(
  keyName: string,
  auth: GetKeyAuth,
): Promise<CallToolResult> {
  if (!auth.authorized) {
    return toolError("unauthorized", "MCP authorization required for sdd_get_key.");
  }
  const name = keyName.trim();
  if (!name) {
    return toolError("invalid_input", "key_name is required.");
  }

  const row = await db.key.findUnique({ where: { keyName: name } });
  if (!row) {
    return toolError("not_found", "No key exists for that key_name.");
  }

  try {
    const key_value = decryptKeyValue(row.keyValue);
    return toolOk({ key_name: row.keyName, key_value });
  } catch {
    return toolError("not_found", "No key exists for that key_name.");
  }
}
