import { cookies } from "next/headers";
import { AdminAccountsClient } from "@/components/features/AdminAccountsClient";
import { requireAdmin } from "@/auth/require-admin";
import { getLocaleFromCookieValue } from "@/lib/locale";
import { db } from "@/lib/db";

export default async function AdminAccountsRoute() {
  const admin = await requireAdmin();
  const cookieStore = await cookies();
  const locale = getLocaleFromCookieValue(cookieStore.get("sdd_locale")?.value);

  const [admins, invites] = await Promise.all([
    db.admin.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
      },
    }),
    db.inviteToken.findMany({
      where: { usedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
      select: { id: true, email: true },
    }),
  ]);

  const initialUsers = [
    ...admins.map((a) => ({
      id: a.id,
      kind: "admin" as const,
      email: a.email,
      name: a.name,
      username: a.username,
      status: "active" as const,
      canDelete: a.id !== admin.id,
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

  return (
    <AdminAccountsClient
      initialLocale={locale}
      name={admin.name || admin.username}
      initialUsers={initialUsers}
    />
  );
}
