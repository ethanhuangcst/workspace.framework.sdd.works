"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { KeysList, type KeyRow } from "@/components/features/KeysList";
import type { Locale } from "@/i18n/t";

export function AdminKeysClient({
  initialLocale,
  name,
  initialKeys,
  showSaved = false,
}: {
  initialLocale: Locale;
  name: string;
  initialKeys: KeyRow[];
  showSaved?: boolean;
}) {
  const router = useRouter();
  const [locale, setLocale] = useState(initialLocale);
  const [keys, setKeys] = useState(initialKeys);
  const [, startTransition] = useTransition();

  const onLocaleChange = useCallback((next: Locale) => {
    setLocale(next);
    startTransition(() => {
      void fetch("/api/admin/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: next }),
      });
    });
  }, []);

  const onSignOut = useCallback(async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }, [router]);

  const onDeleteSelected = useCallback(
    async (ids: string[]) => {
      const res = await fetch("/api/admin/keys/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      if (!res.ok) return;
      setKeys((prev) => prev.filter((k) => !ids.includes(k.id)));
      router.refresh();
    },
    [router],
  );

  return (
    <AppShell
      locale={locale}
      name={name}
      activeNav="keys"
      onLocaleChange={onLocaleChange}
      onSignOut={onSignOut}
      contentClassName="content--keys"
    >
      <KeysList
        locale={locale}
        keys={keys}
        showSaved={showSaved}
        onDeleteSelected={onDeleteSelected}
      />
    </AppShell>
  );
}
