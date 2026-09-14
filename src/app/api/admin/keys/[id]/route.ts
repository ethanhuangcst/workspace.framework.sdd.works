import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { assertCsrf } from "@/auth/csrf";
import { requireAdminApi } from "@/auth/require-admin-api";
import { db } from "@/lib/db";
import { keyNameErrorKey, updateKeySchema } from "@/lib/keys";
import { decryptKeyValue, encryptKeyValue } from "@/lib/keys-crypto";

type RouteContext = { params: Promise<{ id: string }> };

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

export async function GET(_request: NextRequest, context: RouteContext) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const { id } = await context.params;
  const row = await db.key.findUnique({ where: { keyId: id } });
  if (!row) {
    return NextResponse.json(
      { error: { key: "errors.not_found" } },
      { status: 404 },
    );
  }
  return NextResponse.json({ key: toRow(row) });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  if (!assertCsrf(request)) {
    return NextResponse.json({ error: { key: "errors.csrf" } }, { status: 403 });
  }

  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const { id } = await context.params;
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { error: { key: "errors.invalid_input" } },
      { status: 400 },
    );
  }

  const parsed = updateKeySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { key: keyNameErrorKey(parsed.error.issues[0]) } },
      { status: 400 },
    );
  }

  const existing = await db.key.findUnique({ where: { keyId: id } });
  if (!existing) {
    return NextResponse.json(
      { error: { key: "errors.not_found" } },
      { status: 404 },
    );
  }

  const data: {
    keyName?: string;
    keyDescription?: string;
    keyValue?: string;
  } = {};
  if (parsed.data.name !== undefined) data.keyName = parsed.data.name;
  if (parsed.data.description !== undefined) {
    data.keyDescription = parsed.data.description;
  }
  if (parsed.data.value !== undefined) {
    data.keyValue = encryptKeyValue(parsed.data.value);
  }

  try {
    const updated = await db.key.update({
      where: { keyId: id },
      data,
    });
    return NextResponse.json({ key: toRow(updated) });
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

export async function DELETE(request: NextRequest, context: RouteContext) {
  if (!assertCsrf(request)) {
    return NextResponse.json({ error: { key: "errors.csrf" } }, { status: 403 });
  }

  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const { id } = await context.params;
  try {
    await db.key.delete({ where: { keyId: id } });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: { key: "errors.not_found" } },
        { status: 404 },
      );
    }
    throw error;
  }
  return NextResponse.json({ ok: true });
}
