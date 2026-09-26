import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { assertCsrf } from "@/auth/csrf";
import { checkRateLimit } from "@/auth/rate-limit";
import { db } from "@/lib/db";
import { decryptKeyValue } from "@/lib/keys-crypto";

const bodySchema = z.object({
  key_name: z.string(),
});

export async function POST(request: NextRequest) {
  if (!assertCsrf(request)) {
    return NextResponse.json(
      { error: { key: "errors.csrf" } },
      { status: 403 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { error: { key: "admin.guide.secret_empty" } },
      { status: 400 },
    );
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { key: "admin.guide.secret_empty" } },
      { status: 400 },
    );
  }

  const keyName = parsed.data.key_name.trim();
  if (!keyName) {
    return NextResponse.json(
      { error: { key: "admin.guide.secret_empty" } },
      { status: 400 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const rate = checkRateLimit(`secret:${ip}`, 30, 15 * 60 * 1000);
  if (!rate.ok) {
    return NextResponse.json(
      { error: { key: "errors.rate_limited" } },
      { status: 429 },
    );
  }

  const row = await db.key.findUnique({ where: { keyName } });
  if (!row) {
    return NextResponse.json(
      { error: { key: "admin.guide.secret_missing" } },
      { status: 404 },
    );
  }

  try {
    const key_value = decryptKeyValue(row.keyValue);
    return NextResponse.json({ key_value });
  } catch {
    return NextResponse.json(
      { error: { key: "admin.guide.secret_missing" } },
      { status: 404 },
    );
  }
}
