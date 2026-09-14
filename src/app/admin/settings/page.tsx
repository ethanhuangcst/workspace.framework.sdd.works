import { cookies } from "next/headers";
import { AdminSettingsClient } from "./AdminSettingsClient";
import { requireAdmin } from "@/auth/require-admin";
import { getLocaleFromCookieValue } from "@/lib/locale";
import { db } from "@/lib/db";

export default async function AdminSettingsRoute() {
  const admin = await requireAdmin();
  const cookieStore = await cookies();
  const locale = getLocaleFromCookieValue(cookieStore.get("sdd_locale")?.value);

  const row = await db.setting.findUnique({ where: { id: "singleton" } });

  return (
    <AdminSettingsClient
      initialLocale={locale}
      name={admin.name || admin.username}
      savedUrl={row?.githubUrl ?? ""}
    />
  );
}
