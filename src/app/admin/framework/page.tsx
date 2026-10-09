import { AdminFrameworkClient } from "./AdminFrameworkClient";
import { requireAdmin } from "@/auth/require-admin";
import { getRequestLocale } from "@/lib/request-locale";

export default async function AdminFrameworkRoute() {
  const admin = await requireAdmin();
  const locale = await getRequestLocale();

  return (
    <AdminFrameworkClient
      initialLocale={locale}
      name={admin.name || admin.username}
    />
  );
}
