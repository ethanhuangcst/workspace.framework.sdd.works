import { cookies } from "next/headers";
import { AdminFrameworkClient } from "./AdminFrameworkClient";
import { requireAdmin } from "@/auth/require-admin";
import { getLocaleFromCookieValue } from "@/lib/locale";

export default async function AdminFrameworkRoute() {
  const admin = await requireAdmin();
  const cookieStore = await cookies();
  const locale = getLocaleFromCookieValue(cookieStore.get("sdd_locale")?.value);

  return (
    <AdminFrameworkClient
      initialLocale={locale}
      name={admin.name || admin.username}
    />
  );
}
