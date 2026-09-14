"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Field } from "@/components/ui/Field";
import { t, type Locale } from "@/i18n/t";
import { updateKeySchema } from "@/lib/keys";

type FormValues = {
  name: string;
  description: string;
  value: string;
};

export function KeyEditForm({
  initialLocale,
  name: adminName,
  keyId,
  initial,
  openDelete = false,
}: {
  initialLocale: Locale;
  name: string;
  keyId: string;
  initial: FormValues;
  openDelete?: boolean;
}) {
  const router = useRouter();
  const [locale, setLocale] = useState(initialLocale);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(openDelete);
  const [, startTransition] = useTransition();
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: initial,
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
    const parsed = updateKeySchema.safeParse(values);
    if (!parsed.success) {
      setErrorKey(
        parsed.error.issues[0]?.message === "errors.key_name_invalid"
          ? "errors.key_name_invalid"
          : "errors.invalid_input",
      );
      return;
    }
    const res = await fetch(`/api/admin/keys/${keyId}`, {
      method: "PATCH",
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

  async function onDelete() {
    const res = await fetch(`/api/admin/keys/${keyId}`, { method: "DELETE" });
    if (!res.ok) {
      const data = (await res.json()) as { error?: { key: string } };
      setErrorKey(data.error?.key ?? "errors.invalid_input");
      setConfirmOpen(false);
      return;
    }
    router.push("/admin/keys");
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
        <h1>{t(locale, "admin.keys.edit_title")}</h1>
        <p className="field-note">
          {t(locale, "admin.keys.id_label", { id: keyId })}
        </p>
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
        <Field label={t(locale, "admin.keys.value")}>
          <textarea
            required
            rows={4}
            data-testid="key-value"
            spellCheck={false}
            {...register("value")}
          />
        </Field>
        <div className="form-actions">
          <Button type="submit" data-testid="key-edit-submit">
            {t(locale, "admin.common.save")}
          </Button>
          <Button variant="text" href="/admin/keys">
            {t(locale, "admin.keys.back_list")}
          </Button>
        </div>
      </form>
      <div className="form-actions" style={{ maxWidth: "32rem", marginTop: "1.5rem" }}>
        <Button
          type="button"
          variant="text"
          data-testid="key-delete"
          onClick={() => setConfirmOpen(true)}
        >
          {t(locale, "admin.keys.delete")}
        </Button>
      </div>
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={t(locale, "admin.keys.delete_title")}
        body={t(locale, "admin.keys.delete_body")}
        actions={
          <>
            <Button
              type="button"
              data-testid="key-delete-confirm"
              onClick={() => void onDelete()}
            >
              {t(locale, "admin.keys.delete_submit")}
            </Button>
            <Button
              type="button"
              variant="text"
              onClick={() => setConfirmOpen(false)}
            >
              {t(locale, "admin.common.cancel")}
            </Button>
          </>
        }
      />
    </AppShell>
  );
}
