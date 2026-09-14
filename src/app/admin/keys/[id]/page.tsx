import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { requireAdmin } from "@/auth/require-admin";
import { KeyEditForm } from "@/components/features/KeyEditForm";
import { getLocaleFromCookieValue } from "@/lib/locale";
import { db } from "@/lib/db";
import { decryptKeyValue } from "@/lib/keys-crypto";

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
  const cookieStore = await cookies();
  const locale = getLocaleFromCookieValue(cookieStore.get("sdd_locale")?.value);

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
