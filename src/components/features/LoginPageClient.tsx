"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoginPage } from "@/components/features/LoginPage";
import type { Locale } from "@/i18n/t";

export type LoginPageClientProps = {
  initialLocale: Locale;
};

export function LoginPageClient({ initialLocale }: LoginPageClientProps) {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [error, setError] = useState(false);
  const [errorKey, setErrorKey] = useState("errors.login_failed");
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

  const onSubmit = useCallback(
    async (email: string, password: string) => {
      setError(false);
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        redirect?: string;
        error?: { key: string };
      };
      if (!res.ok) {
        setError(true);
        setErrorKey(data.error?.key ?? "errors.login_failed");
        if (data.redirect) {
          router.push(data.redirect);
        }
        return;
      }
      router.push(data.redirect ?? "/admin/keys");
      router.refresh();
    },
    [router],
  );

  return (
    <LoginPage
      locale={locale}
      onLocaleChange={onLocaleChange}
      onSubmit={onSubmit}
      error={error}
      errorKey={errorKey}
    />
  );
}
