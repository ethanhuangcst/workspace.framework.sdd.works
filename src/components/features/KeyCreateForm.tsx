"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { t, type Locale } from "@/i18n/t";
import { createKeySchema, keyFieldErrorKey } from "@/lib/keys";

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
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
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
      const key = keyFieldErrorKey(parsed.error.issues[0]);
      setErrorKey(key);
      if (key === "errors.key_name_invalid") {
        setError("name", { type: "validate", message: key });
      }
      if (key === "errors.key_value_no_chinese") {
        setError("value", { type: "validate", message: key });
      }
      return;
    }
    try {
      const res = await fetch("/api/admin/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = (await res.json()) as { error?: { key: string } };
      if (!res.ok) {
        const key = data.error?.key ?? "errors.invalid_input";
        setErrorKey(key);
        if (key === "errors.key_name_taken" || key === "errors.key_name_invalid") {
          setError("name", { type: "server", message: key });
        }
        if (key === "errors.key_value_no_chinese") {
          setError("value", { type: "server", message: key });
        }
        return;
      }
      router.push("/admin/keys?saved=1");
      router.refresh();
    } catch {
      setErrorKey("errors.invalid_input");
    }
  }

  const nameError =
    errors.name?.message === "errors.key_name_invalid" ||
    errors.name?.message === "errors.key_name_taken"
      ? t(locale, errors.name.message)
      : null;
  const valueError =
    errors.value?.message === "errors.key_value_no_chinese"
      ? t(locale, errors.value.message)
      : null;

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
        <p className="error" role="alert" data-testid="key-form-error">
          {t(locale, errorKey)}
        </p>
      ) : null}
      <form
        className="form"
        style={{ maxWidth: "32rem" }}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Field
          label={t(locale, "admin.keys.name")}
          fieldNote={t(locale, "admin.keys.name_hint")}
        >
          <input
            type="text"
            autoComplete="off"
            required
            pattern="[A-Za-z][A-Za-z0-9_-]*"
            title={t(locale, "errors.key_name_invalid")}
            data-testid="key-name"
            placeholder="cursor-prod"
            aria-invalid={Boolean(nameError)}
            {...register("name")}
          />
        </Field>
        {nameError ? (
          <p className="error" data-testid="key-name-error">
            {nameError}
          </p>
        ) : null}
        <Field label={t(locale, "admin.keys.description")}>
          <input
            type="text"
            data-testid="key-description"
            {...register("description")}
          />
        </Field>
        <Field label={t(locale, "admin.keys.value")}>
          <textarea
            required
            rows={4}
            data-testid="key-value"
            spellCheck={false}
            lang="en"
            aria-invalid={Boolean(valueError)}
            {...register("value")}
          />
        </Field>
        {valueError ? (
          <p className="error" data-testid="key-value-error">
            {valueError}
          </p>
        ) : null}
        <div className="form-actions">
          <Button
            type="submit"
            data-testid="key-create-submit"
            disabled={isSubmitting}
          >
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
