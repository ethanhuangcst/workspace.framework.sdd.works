import { cookies } from "next/headers";
import { requireAdmin } from "@/auth/require-admin";
import { KeyCreateForm } from "@/components/features/KeyCreateForm";
import { getLocaleFromCookieValue } from "@/lib/locale";

export default async function AdminKeysNewRoute() {
  const admin = await requireAdmin();
  const cookieStore = await cookies();
  const locale = getLocaleFromCookieValue(cookieStore.get("sdd_locale")?.value);

  return (
    <KeyCreateForm
      initialLocale={locale}
      name={admin.name || admin.username}
    />
  );
}
