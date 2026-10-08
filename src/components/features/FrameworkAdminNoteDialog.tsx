"use client";

import { useEffect, useRef, type RefObject } from "react";
import { t, type Locale } from "@/i18n/t";
import { Callout } from "@/components/ui/Callout";
import { AdminNoteProseBody } from "./AdminNoteProseBody";

export type FrameworkAdminNoteDialogProps = {
  open: boolean;
  locale: Locale;
  loading: boolean;
  errorKey: string | null;
  html: string | null;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
};

export function FrameworkAdminNoteDialog({
  open,
  locale,
  loading,
  errorKey,
  html,
  onClose,
  returnFocusRef,
}: FrameworkAdminNoteDialogProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    const focusTimer = window.setTimeout(() => {
      closeRef.current?.focus();
    }, 0);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(focusTimer);
    };
  }, [open, onClose]);

  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (wasOpenRef.current && !open) {
      returnFocusRef.current?.focus();
    }
    wasOpenRef.current = open;
  }, [open, returnFocusRef]);

  return (
    <div
      className={`dialog-backdrop${open ? " is-open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      aria-label="Admin note"
      data-testid="framework-admin-note-dialog"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="floating-frame">
        <div className="floating-frame__scroll">
          {loading ? (
            <p className="field-note" data-testid="framework-admin-note-loading">
              {t(locale, "admin.framework.admin_note_loading")}
            </p>
          ) : null}
          {errorKey ? (
            <Callout variant="error" data-testid="framework-admin-note-error">
              {t(locale, errorKey)}
            </Callout>
          ) : null}
          {html && !loading && !errorKey ? (
            <AdminNoteProseBody html={html} locale={locale} />
          ) : null}
        </div>
        <div className="floating-frame__actions">
          <button
            type="button"
            ref={closeRef}
            className="btn btn-page"
            data-testid="framework-admin-note-close"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
