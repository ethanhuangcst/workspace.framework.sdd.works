import type { IncomingMessage } from "node:http";

/** ADR-049: HTTP MCP bearer gate. */
export function getConfiguredMcpAuthToken(): string | null {
  const token = process.env.MCP_AUTH_TOKEN?.trim();
  return token || null;
}

export function extractBearerToken(
  authorization: string | string[] | undefined,
): string | null {
  if (!authorization) return null;
  const raw = Array.isArray(authorization) ? authorization[0] : authorization;
  const match = /^Bearer\s+(.+)$/i.exec(raw.trim());
  return match?.[1]?.trim() || null;
}

export function isAuthorizedMcpBearer(
  authorization: string | string[] | undefined,
): boolean {
  const expected = getConfiguredMcpAuthToken();
  if (!expected) return false;
  const got = extractBearerToken(authorization);
  if (!got) return false;
  return got === expected;
}

export function assertRequestAuthorized(req: IncomingMessage): boolean {
  return isAuthorizedMcpBearer(req.headers.authorization);
}
