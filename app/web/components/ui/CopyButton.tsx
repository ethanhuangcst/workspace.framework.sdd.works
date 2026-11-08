"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export type CopyButtonProps = {
  value: string;
  label: ReactNode;
  copiedLabel: ReactNode;
  className?: string;
  "data-testid"?: string;
  resetMs?: number;
};

export function CopyButton({
  value,
  label,
  copiedLabel,
  className,
  "data-testid": testId,
  resetMs = 1600,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  async function handleCopy() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      }
    } catch {
      // Still show feedback; clipboard may be unavailable.
    }
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), resetMs);
  }

  return (
    <button
      type="button"
      className={className}
      data-testid={testId}
      onClick={handleCopy}
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
