import { cookies } from "next/headers";
import { AdminKeysClient } from "./AdminKeysClient";
import { requireAdmin } from "@/auth/require-admin";
import { getLocaleFromCookieValue } from "@/lib/locale";

export default async function AdminKeysRoute() {
  const admin = await requireAdmin();
  const cookieStore = await cookies();
  const locale = getLocaleFromCookieValue(cookieStore.get("sdd_locale")?.value);

  return (
    <AdminKeysClient
      initialLocale={locale}
      name={admin.name || admin.username}
    />
  );
}
