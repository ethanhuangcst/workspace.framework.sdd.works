import { notFound } from "next/navigation";
import { requireAdmin } from "@shared/auth/require-admin";
import { KeyEditForm } from "@web/components/features/KeyEditForm";
import { getRequestLocale } from "@shared/lib/request-locale";
import { db } from "@shared/lib/db";
import { decryptKeyValue } from "@shared/lib/keys-crypto";

export default async function AdminKeysEditRoute({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ confirm?: string }>;
}) {
  const admin = await requireAdmin();
  const { id } = await params;
  const query = await searchParams;
  const locale = await getRequestLocale();

  const row = await db.key.findUnique({ where: { keyId: id } });
  if (!row) notFound();

  return (
    <KeyEditForm
      initialLocale={locale}
      name={admin.name || admin.username}
      keyId={row.keyId}
      openDelete={query.confirm === "delete"}
      initial={{
        name: row.keyName,
        description: row.keyDescription,
        value: decryptKeyValue(row.keyValue),
      }}
    />
  );
}
