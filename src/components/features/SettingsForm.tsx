"use client";

import { FormEvent, useEffect, useState } from "react";
import { t, type Locale } from "../../i18n/t";
import { Button } from "../ui/Button";
import { Callout } from "../ui/Callout";

export type SettingsFormProps = {
  locale: Locale;
  savedUrl: string;
  onSave: (url: string) => Promise<"ok" | "invalid" | "unreachable">;
  initialStatus?: "saved" | "unreachable" | null;
};

/** Settings URL form — mockup `11-settings.html` (content only; wrap in AppShell). */
export function SettingsForm({
  locale,
  savedUrl,
  onSave,
  initialStatus = null,
}: SettingsFormProps) {
  const [url, setUrl] = useState(savedUrl);
  const [baseline, setBaseline] = useState(savedUrl);
  const [status, setStatus] = useState<"saved" | "unreachable" | "invalid" | null>(
    initialStatus,
  );
  const [pending, setPending] = useState(false);
  const dirty = url.trim() !== baseline;

  useEffect(() => {
    setUrl(savedUrl);
    setBaseline(savedUrl);
  }, [savedUrl]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!dirty || pending) return;
    setPending(true);
    setStatus(null);
    const result = await onSave(url.trim());
    setPending(false);
    if (result === "ok") {
      setBaseline(url.trim());
      setStatus("saved");
      return;
    }
    setUrl(baseline);
    setStatus(result === "invalid" ? "invalid" : "unreachable");
  }

  return (
    <>
      <div className="page-head">
        <p className="eyebrow">{t(locale, "admin.settings.eyebrow")}</p>
        <h1>{t(locale, "admin.settings.title")}</h1>
        <p>{t(locale, "admin.settings.lead")}</p>
      </div>
      {status === "saved" ? (
        <Callout variant="success">{t(locale, "admin.settings.saved")}</Callout>
      ) : null}
      {status === "unreachable" ? (
        <Callout variant="error">
          {t(locale, "errors.settings_url_unreachable")}
        </Callout>
      ) : null}
      {status === "invalid" ? (
        <Callout variant="error">
          {t(locale, "errors.settings_url_invalid")}
        </Callout>
      ) : null}
      <form
        className="form"
        data-settings-form
        style={{ maxWidth: "32rem" }}
        onSubmit={handleSubmit}
      >
        <label className="settings-url-field">
          <span className="section-subtitle">
            {t(locale, "admin.settings.url")}
          </span>
          <input
            type="url"
            name="url"
            data-testid="settings-url"
            required
            placeholder="https://github.com/your-org/your-repo"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </label>
        <p className="field-note">{t(locale, "admin.settings.url_hint")}</p>
        <div className="form-actions">
          <Button
            type="submit"
            disabled={!dirty || pending}
            data-testid="settings-save"
          >
            {t(locale, "admin.settings.save")}
          </Button>
        </div>
      </form>
    </>
  );
}
