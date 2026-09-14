import { NextRequest, NextResponse } from "next/server";
import { assertCsrf } from "@/auth/csrf";
import { requireAdminApi } from "@/auth/require-admin-api";
import { db } from "@/lib/db";
import { deleteKeysSchema } from "@/lib/keys";

export async function POST(request: NextRequest) {
  if (!assertCsrf(request)) {
    return NextResponse.json({ error: { key: "errors.csrf" } }, { status: 403 });
  }

  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { error: { key: "errors.invalid_input" } },
      { status: 400 },
    );
  }

  const parsed = deleteKeysSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { key: "errors.invalid_input" } },
      { status: 400 },
    );
  }

  await db.key.deleteMany({
    where: { keyId: { in: parsed.data.ids } },
  });
  return NextResponse.json({ ok: true });
}
