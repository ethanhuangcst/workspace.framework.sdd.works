import { requireAdmin } from "@shared/auth/require-admin";
import { KeyCreateForm } from "@web/components/features/KeyCreateForm";
import { getRequestLocale } from "@shared/lib/request-locale";

export default async function AdminKeysNewRoute() {
  const admin = await requireAdmin();
  const locale = await getRequestLocale();

  return (
    <KeyCreateForm
      initialLocale={locale}
      name={admin.name || admin.username}
    />
  );
}
