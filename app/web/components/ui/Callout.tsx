import type { ReactNode } from "react";

export type CalloutVariant = "success" | "error";

export type CalloutProps = {
  variant: CalloutVariant;
  children: ReactNode;
  className?: string;
  "data-testid"?: string;
};

function joinClass(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(" ");
}

export function Callout({
  variant,
  children,
  className,
  "data-testid": testId,
}: CalloutProps) {
  return (
    <div
      className={joinClass(
        "callout",
        variant === "success" ? "callout-success" : "callout-error",
        className,
      )}
      data-testid={testId}
    >
      <p className="callout-body">{children}</p>
    </div>
  );
}
