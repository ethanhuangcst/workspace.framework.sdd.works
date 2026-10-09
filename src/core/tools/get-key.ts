import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { db } from "@/lib/db";
import { decryptKeyValue } from "@/lib/keys-crypto";
import { toolError } from "./errors";

function toolSecret(text: string): CallToolResult {
  return { content: [{ type: "text", text }] };
}

export type GetKeyAuth = {
  /** False → unauthorized (HTTP without bearer should never reach here). */
  authorized: boolean;
};

export async function getKey(
  keyName: string,
  auth: GetKeyAuth,
): Promise<CallToolResult> {
  if (!auth.authorized) {
    return toolError("unauthorized");
  }
  const name = keyName.trim();
  if (!name) {
    return toolError("invalid_input");
  }

  const row = await db.key.findUnique({ where: { keyName: name } });
  if (!row) {
    return toolSecret("not_found");
  }

  try {
    return toolSecret(decryptKeyValue(row.keyValue));
  } catch {
    return toolSecret("not_found");
  }
}
