import type {
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";

export type FieldProps = {
  label: ReactNode;
  fieldNote?: ReactNode;
  children?: ReactNode;
  className?: string;
  as?: "input" | "textarea";
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  textareaProps?: TextareaHTMLAttributes<HTMLTextAreaElement>;
};

export function Field({
  label,
  fieldNote,
  children,
  className,
  as = "input",
  inputProps,
  textareaProps,
}: FieldProps) {
  return (
    <label className={className}>
      <span>{label}</span>
      {children ??
        (as === "textarea" ? (
          <textarea {...textareaProps} />
        ) : (
          <input {...inputProps} />
        ))}
      {fieldNote != null ? (
        <span className="field-note">{fieldNote}</span>
      ) : null}
    </label>
  );
}
