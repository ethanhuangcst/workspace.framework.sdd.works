"use client";

import { useEffect, type ReactNode } from "react";

export type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  body: ReactNode;
  actions: ReactNode;
  id?: string;
  className?: string;
};

export function Dialog({
  open,
  onClose,
  title,
  body,
  actions,
  id,
  className,
}: DialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <div
      id={id}
      className={
        className
          ? `dialog-backdrop${open ? " is-open" : ""} ${className}`
          : `dialog-backdrop${open ? " is-open" : ""}`
      }
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="dialog">
        <h2 className="dialog-title">{title}</h2>
        <p className="dialog-body">{body}</p>
        <div className="dialog-actions">{actions}</div>
      </div>
    </div>
  );
}
