import { NextRequest, NextResponse } from "next/server";
import { assertCsrf } from "@/auth/csrf";
import { requireAdminApi } from "@/auth/require-admin-api";
import { evaluateAdminDelete } from "@/lib/admin-users";
import { db } from "@/lib/db";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(request: NextRequest, context: RouteContext) {
  if (!assertCsrf(request)) {
    return NextResponse.json(
      { error: { key: "errors.csrf" } },
      { status: 403 },
    );
  }

  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const { id } = await context.params;

  const invite = await db.inviteToken.findUnique({ where: { id } });
  if (invite && !invite.usedAt) {
    const guard = evaluateAdminDelete({
      actorId: auth.admin.id,
      targetKind: "invite",
      targetExists: true,
      activeAdminCount: 0,
    });
    if (!guard.ok) {
      return NextResponse.json({ error: { key: guard.key } }, { status: 400 });
    }
    await db.inviteToken.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  }

  const target = await db.admin.findUnique({ where: { id } });
  const activeAdminCount = await db.admin.count({
    where: { status: "ACTIVE" },
  });
  const guard = evaluateAdminDelete({
    actorId: auth.admin.id,
    targetKind: "admin",
    targetAdminId: target?.id,
    targetExists: Boolean(target),
    activeAdminCount,
  });
  if (!guard.ok) {
    const status =
      guard.key === "errors.not_found"
        ? 404
        : guard.key === "errors.cannot_delete_self"
          ? 403
          : 400;
    return NextResponse.json({ error: { key: guard.key } }, { status });
  }

  await db.admin.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
