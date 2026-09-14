"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { SettingsForm } from "@/components/features/SettingsForm";
import type { Locale } from "@/i18n/t";

export function AdminSettingsClient({
  initialLocale,
  name,
  savedUrl,
}: {
  initialLocale: Locale;
  name: string;
  savedUrl: string;
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

  const onSave = useCallback(async (url: string) => {
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (res.ok) {
        router.refresh();
        return "ok" as const;
      }
      const data = (await res.json()) as { error?: { key?: string } };
      if (data.error?.key === "errors.settings_url_invalid") {
        return "invalid" as const;
      }
      return "unreachable" as const;
    } catch {
      return "unreachable" as const;
    }
  }, [router]);

  return (
    <AppShell
      locale={locale}
      name={name}
      activeNav="settings"
      onLocaleChange={onLocaleChange}
      onSignOut={onSignOut}
    >
      <SettingsForm locale={locale} savedUrl={savedUrl} onSave={onSave} />
    </AppShell>
  );
}
