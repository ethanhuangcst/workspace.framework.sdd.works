import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { assertCsrf } from "@/auth/csrf";
import { requireAdminApi } from "@/auth/require-admin-api";
import { db } from "@/lib/db";
import { createKeySchema, keyFieldErrorKey } from "@/lib/keys";
import { encryptKeyValue, decryptKeyValue } from "@/lib/keys-crypto";

function toRow(row: {
  keyId: string;
  keyName: string;
  keyDescription: string;
  keyValue: string;
}) {
  return {
    id: row.keyId,
    name: row.keyName,
    description: row.keyDescription,
    value: decryptKeyValue(row.keyValue),
  };
}

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const rows = await db.key.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ keys: rows.map(toRow) });
}

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

  const parsed = createKeySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { key: keyFieldErrorKey(parsed.error.issues[0]) } },
      { status: 400 },
    );
  }

  try {
    const created = await db.key.create({
      data: {
        keyName: parsed.data.name,
        keyDescription: parsed.data.description ?? "",
        keyValue: encryptKeyValue(parsed.data.value),
      },
    });
    return NextResponse.json({ key: toRow(created) }, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: { key: "errors.key_name_taken" } },
        { status: 409 },
      );
    }
    throw error;
  }
}
