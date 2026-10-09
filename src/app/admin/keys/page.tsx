import { AdminKeysClient } from "./AdminKeysClient";
import { requireAdmin } from "@/auth/require-admin";
import { getRequestLocale } from "@/lib/request-locale";
import { db } from "@/lib/db";
import { decryptKeyValue } from "@/lib/keys-crypto";

export default async function AdminKeysRoute({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const admin = await requireAdmin();
  const params = await searchParams;
  const locale = await getRequestLocale();

  const rows = await db.key.findMany({ orderBy: { createdAt: "desc" } });
  const keys = rows.map((row) => ({
    id: row.keyId,
    name: row.keyName,
    description: row.keyDescription,
    value: decryptKeyValue(row.keyValue),
  }));

  return (
    <AdminKeysClient
      initialLocale={locale}
      name={admin.name || admin.username}
      initialKeys={keys}
      showSaved={params.saved === "1"}
    />
  );
}
