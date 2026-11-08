import { AdminSettingsClient } from "./AdminSettingsClient";
import { requireAdmin } from "@shared/auth/require-admin";
import { getRequestLocale } from "@shared/lib/request-locale";
import { db } from "@shared/lib/db";

export default async function AdminSettingsRoute() {
  const admin = await requireAdmin();
  const locale = await getRequestLocale();

  const row = await db.setting.findUnique({ where: { id: "singleton" } });

  return (
    <AdminSettingsClient
      initialLocale={locale}
      name={admin.name || admin.username}
      savedUrl={row?.githubUrl ?? ""}
    />
  );
}
