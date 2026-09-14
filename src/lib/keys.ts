import { z } from "zod";

export const KEY_NAME_PATTERN = /^[A-Za-z][A-Za-z0-9_-]*$/;

/** CJK Unified Ideographs + Extension A + compatibility ideographs. */
const CJK_CHAR = /[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]/;

export const keyNameSchema = z
  .string()
  .min(1)
  .max(128)
  .regex(KEY_NAME_PATTERN, { message: "errors.key_name_invalid" });

export const keyValueSchema = z
  .string()
  .min(1)
  .max(16_384)
  .refine((value) => !CJK_CHAR.test(value), {
    message: "errors.key_value_no_chinese",
  });

export const createKeySchema = z.object({
  name: keyNameSchema,
  description: z.string().max(500).default(""),
  value: keyValueSchema,
});

export const updateKeySchema = z.object({
  name: keyNameSchema.optional(),
  description: z.string().max(500).optional(),
  value: keyValueSchema.optional(),
});

export const deleteKeysSchema = z.object({
  ids: z.array(z.string().uuid()).min(1).max(100),
});

export type CreateKeyInput = z.infer<typeof createKeySchema>;
export type UpdateKeyInput = z.infer<typeof updateKeySchema>;

export function keyFieldErrorKey(
  issue: z.ZodIssue | undefined,
):
  | "errors.key_name_invalid"
  | "errors.key_value_no_chinese"
  | "errors.invalid_input" {
  if (!issue) return "errors.invalid_input";
  if (issue.message === "errors.key_value_no_chinese") {
    return "errors.key_value_no_chinese";
  }
  if (
    issue.message === "errors.key_name_invalid" ||
    issue.path?.[0] === "name"
  ) {
    return "errors.key_name_invalid";
  }
  return "errors.invalid_input";
}

/** @deprecated Prefer keyFieldErrorKey */
export function keyNameErrorKey(
  issue: z.ZodIssue | undefined,
): "errors.key_name_invalid" | "errors.invalid_input" {
  const key = keyFieldErrorKey(issue);
  return key === "errors.key_value_no_chinese"
    ? "errors.invalid_input"
    : key;
}
