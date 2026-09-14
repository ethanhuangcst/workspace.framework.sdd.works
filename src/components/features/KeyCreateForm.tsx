"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { t, type Locale } from "@/i18n/t";
import { createKeySchema } from "@/lib/keys";

type FormValues = {
  name: string;
  description: string;
  value: string;
};

export function KeyCreateForm({
  initialLocale,
  name: adminName,
}: {
  initialLocale: Locale;
  name: string;
}) {
  const router = useRouter();
  const [locale, setLocale] = useState(initialLocale);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: { name: "", description: "", value: "" },
  });

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
  }, [router]);

  async function onSubmit(values: FormValues) {
    setErrorKey(null);
    const parsed = createKeySchema.safeParse(values);
    if (!parsed.success) {
      setErrorKey(
        parsed.error.issues[0]?.message === "errors.key_name_invalid"
          ? "errors.key_name_invalid"
          : "errors.invalid_input",
      );
      return;
    }
    const res = await fetch("/api/admin/keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });
    const data = (await res.json()) as { error?: { key: string } };
    if (!res.ok) {
      setErrorKey(data.error?.key ?? "errors.invalid_input");
      return;
    }
    router.push("/admin/keys?saved=1");
    router.refresh();
  }

  return (
    <AppShell
      locale={locale}
      name={adminName}
      activeNav="keys"
      onLocaleChange={onLocaleChange}
      onSignOut={onSignOut}
    >
      <div className="page-head">
        <p className="eyebrow">{t(locale, "admin.keys.eyebrow")}</p>
        <h1>{t(locale, "admin.keys.issue")}</h1>
        <p className="lead">{t(locale, "admin.keys.lead")}</p>
      </div>
      {errorKey ? (
        <p className="error" data-testid="key-form-error">
          {t(locale, errorKey)}
        </p>
      ) : null}
      <form
        className="form"
        style={{ maxWidth: "32rem" }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Field
          label={t(locale, "admin.keys.name")}
          fieldNote={t(locale, "admin.keys.name_hint")}
        >
          <input
            type="text"
            autoComplete="off"
            required
            data-testid="key-name"
            placeholder="cursor-prod"
            {...register("name")}
          />
        </Field>
        <Field label={t(locale, "admin.keys.description")}>
          <input
            type="text"
            data-testid="key-description"
            {...register("description")}
          />
        </Field>
        <Field
          label={t(locale, "admin.keys.value")}
          fieldNote={t(locale, "admin.keys.value_hint")}
        >
          <textarea
            required
            rows={4}
            data-testid="key-value"
            spellCheck={false}
            {...register("value")}
          />
        </Field>
        <div className="form-actions">
          <Button type="submit" data-testid="key-create-submit">
            {t(locale, "admin.keys.create_submit")}
          </Button>
          <Button variant="text" href="/admin/keys">
            {t(locale, "admin.common.cancel")}
          </Button>
        </div>
      </form>
    </AppShell>
  );
}
