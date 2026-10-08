"use client";

import { useEffect, useRef } from "react";
import { t, type Locale } from "@/i18n/t";

export function AdminNoteProseBody({
  html,
  locale,
}: {
  html: string;
  locale: Locale;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const copyLabel = t(locale, "admin.keys.copy");
    const copiedLabel = t(locale, "admin.common.copied");
    const buttons = root.querySelectorAll<HTMLButtonElement>(
      "button.codeblock-copy[data-copy-from-pre]",
    );
    const cleanups: Array<() => void> = [];

    buttons.forEach((btn) => {
      const block = btn.closest(".codeblock--file");
      const pre = block?.querySelector(".codeblock-text");
      const text = pre?.textContent ?? "";
      btn.textContent = copyLabel;
      let timer: ReturnType<typeof setTimeout> | undefined;

      const onClick = async () => {
        try {
          if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
          }
        } catch {
          // Clipboard may be unavailable in tests.
        }
        btn.textContent = copiedLabel;
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          btn.textContent = copyLabel;
        }, 1600);
      };

      btn.addEventListener("click", onClick);
      cleanups.push(() => {
        btn.removeEventListener("click", onClick);
        if (timer) clearTimeout(timer);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [html, locale]);

  return (
    <article
      ref={ref}
      className="guide-section guide-md-body guide-md-body--prose"
      data-testid="framework-admin-note-body"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
