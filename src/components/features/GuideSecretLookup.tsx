"use client";

import { useEffect, useState, type FormEvent } from "react";
import { t, type Locale } from "@/i18n/t";
import { CopyButton } from "@/components/ui/CopyButton";

export function GuideSecretLookup({ locale }: { locale: Locale }) {
  const [secretName, setSecretName] = useState("");
  const [secretValue, setSecretValue] = useState<string | null>(null);
  const [secretErrorKey, setSecretErrorKey] = useState<string | null>(null);
  const [secretLookingUp, setSecretLookingUp] = useState(false);

  useEffect(() => {
    const selector =
      secretValue != null
        ? "[data-testid='secret-result']"
        : secretErrorKey
          ? "[data-testid='secret-error']"
          : null;
    if (!selector) return;
    const node = document.querySelector(selector);
    if (node && typeof (node as HTMLElement).scrollIntoView === "function") {
      (node as HTMLElement).scrollIntoView({
        block: "start",
        behavior: "smooth",
      });
    }
  }, [secretValue, secretErrorKey]);

  async function lookupSecret() {
    const name = secretName.trim();
    setSecretValue(null);
    setSecretErrorKey(null);
    if (!name) {
      setSecretErrorKey("admin.guide.secret_empty");
      return;
    }
    if (secretLookingUp) return;
    setSecretLookingUp(true);
    try {
      const res = await fetch("/api/sdd/secret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key_name: name }),
      });
      let data: { key_value?: string; error?: { key: string } } = {};
      try {
        data = (await res.json()) as {
          key_value?: string;
          error?: { key: string };
        };
      } catch {
        data = {};
      }
      if (!res.ok || data.key_value == null) {
        setSecretErrorKey(
          data.error?.key ?? "admin.guide.secret_missing",
        );
        return;
      }
      setSecretValue(data.key_value);
    } catch {
      setSecretErrorKey("admin.guide.secret_missing");
    } finally {
      setSecretLookingUp(false);
    }
  }

  function onSecretSubmit(event: FormEvent) {
    event.preventDefault();
    event.stopPropagation();
    void lookupSecret();
  }

  return (
    <section className="guide-section learn-embed-secret" id="learn-secret">
      <div className="secret-stack">
        <form
          className="secret-lookup secret-row-grid"
          data-testid="secret-lookup"
          onSubmit={onSecretSubmit}
        >
          <input
            className="input-box"
            type="text"
            name="secret_name"
            autoComplete="off"
            spellCheck={false}
            placeholder={t(locale, "admin.guide.secret_hint")}
            value={secretName}
            onChange={(event) => setSecretName(event.target.value)}
            data-testid="secret-name"
          />
            <button
              className="btn secret-action-btn"
              type="button"
              data-testid="secret-get"
              disabled={secretLookingUp}
              onClick={() => {
                void lookupSecret();
              }}
            >
              {t(locale, "admin.guide.secret_button")}
            </button>
          </form>
          {secretValue != null ? (
            <div
              className="secret-result-row secret-row-grid"
              data-testid="secret-result"
              aria-live="polite"
            >
              <pre className="input-box mono secret-result-value">{secretValue}</pre>
              <CopyButton
                className="btn secret-action-btn"
                value={secretValue}
                label={t(locale, "admin.guide.secret_copy")}
                copiedLabel={t(locale, "admin.common.copied")}
                data-testid="secret-result-copy"
              />
            </div>
          ) : null}
        {secretErrorKey ? (
          <p
            className="field-note secret-error"
            data-testid="secret-error"
            aria-live="polite"
          >
            {t(locale, secretErrorKey)}
          </p>
        ) : null}
      </div>
    </section>
  );
}
