import { requireAdmin } from "@/auth/require-admin";
import { KeyCreateForm } from "@/components/features/KeyCreateForm";
import { getRequestLocale } from "@/lib/request-locale";

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
