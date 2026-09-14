"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { FrameworkView } from "@/components/features/FrameworkView";
import type { Locale } from "@/i18n/t";

export function AdminFrameworkClient({
  initialLocale,
  name,
}: {
  initialLocale: Locale;
  name: string;
}) {
  const router = useRouter();
  const [locale, setLocale] = useState(initialLocale);
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

  return (
    <AppShell
      locale={locale}
      name={name}
      activeNav="framework"
      onLocaleChange={onLocaleChange}
      onSignOut={onSignOut}
    >
      <FrameworkView locale={locale} />
    </AppShell>
  );
}
