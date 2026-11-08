import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "text" | "page" | "danger-quiet";

export type ButtonProps = {
  variant?: ButtonVariant;
  href?: string;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
  "data-testid"?: string;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  target?: string;
  rel?: string;
};

function variantClass(variant: ButtonVariant): string {
  switch (variant) {
    case "text":
      return "btn-text";
    case "page":
      return "btn btn-page";
    case "danger-quiet":
      return "btn-text";
    case "primary":
    default:
      return "btn";
  }
}

function joinClass(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(" ");
}

export function Button({
  variant = "primary",
  href,
  disabled,
  children,
  className,
  "data-testid": testId,
  type = "button",
  onClick,
  target,
  rel,
}: ButtonProps) {
  const classes = joinClass(variantClass(variant), className);

  if (href && !disabled) {
    return (
      <a
        className={classes}
        href={href}
        data-testid={testId}
        target={target}
        rel={rel}
        onClick={onClick as never}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      data-testid={testId}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
