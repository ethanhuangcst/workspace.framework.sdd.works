"use client";

import {
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { t, type Locale } from "../../i18n/t";

const EYE_SVG = (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
  >
    <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export type PasswordFieldProps = {
  locale: Locale;
  id?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: InputHTMLAttributes<HTMLInputElement>["onChange"];
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  "data-testid"?: string;
  label?: ReactNode;
  fieldNote?: ReactNode;
};

export function PasswordField({
  locale,
  id: idProp,
  name,
  value,
  defaultValue,
  onChange,
  autoComplete = "current-password",
  required,
  disabled,
  className,
  "data-testid": testId,
  label,
  fieldNote,
}: PasswordFieldProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const [visible, setVisible] = useState(false);

  const control = (
    <span className="password-field">
      <input
        id={id}
        type={visible ? "text" : "password"}
        name={name}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        autoComplete={autoComplete}
        required={required}
        disabled={disabled}
        data-testid={testId}
      />
      <button
        type="button"
        className="password-toggle"
        aria-label={t(
          locale,
          visible ? "admin.login.hide_password" : "admin.login.show_password",
        )}
        aria-pressed={visible}
        onClick={() => setVisible((v) => !v)}
      >
        {EYE_SVG}
      </button>
    </span>
  );

  if (label == null) {
    return className ? <div className={className}>{control}</div> : control;
  }

  return (
    <label className={className}>
      <span>{label}</span>
      {control}
      {fieldNote != null ? <span className="field-note">{fieldNote}</span> : null}
    </label>
  );
}
