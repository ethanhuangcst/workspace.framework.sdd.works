import { NextResponse } from "next/server";
import { requireAdminApi } from "@/auth/require-admin-api";
import { db } from "@/lib/db";

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const [admins, invites] = await Promise.all([
    db.admin.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        status: true,
      },
    }),
    db.inviteToken.findMany({
      where: { usedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
      },
    }),
  ]);

  const users = [
    ...admins.map((a) => ({
      id: a.id,
      kind: "admin" as const,
      email: a.email,
      name: a.name,
      username: a.username,
      status: "active" as const,
      canDelete: a.id !== auth.admin.id,
    })),
    ...invites.map((i) => ({
      id: i.id,
      kind: "invite" as const,
      email: i.email,
      name: null,
      username: null,
      status: "pending" as const,
      canDelete: true,
    })),
  ];

  return NextResponse.json({ users });
}
