import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "sdd_session";

export type SessionPayload = {
  adminId: string;
  iat: number;
  v: number;
};

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("SESSION_SECRET is missing or too short");
  }
  return secret;
}

function sign(body: string): string {
  return createHmac("sha256", getSecret()).update(body).digest("base64url");
}

export function createSessionValue(
  adminId: string,
  sessionVersion: number,
): string {
  const payload: SessionPayload = {
    adminId,
    iat: Math.floor(Date.now() / 1000),
    v: sessionVersion,
  };
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString(
    "base64url",
  );
  return `${body}.${sign(body)}`;
}

export function readSessionValue(
  cookieValue: string | undefined | null,
): SessionPayload | null {
  if (!cookieValue) return null;
  const [body, sig] = cookieValue.split(".");
  if (!body || !sig) return null;
  const expected = sign(body);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  try {
    const parsed = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8"),
    ) as SessionPayload;
    if (
      typeof parsed.adminId !== "string" ||
      typeof parsed.iat !== "number" ||
      typeof parsed.v !== "number"
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function sessionCookieOptions(maxAgeSec = 60 * 60 * 24 * 14) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSec,
  };
}
