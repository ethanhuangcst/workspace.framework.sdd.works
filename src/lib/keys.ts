import { z } from "zod";

export const KEY_NAME_PATTERN = /^[A-Za-z][A-Za-z0-9_-]*$/;

export const keyNameSchema = z
  .string()
  .min(1)
  .max(128)
  .regex(KEY_NAME_PATTERN, { message: "errors.key_name_invalid" });

export const createKeySchema = z.object({
  name: keyNameSchema,
  description: z.string().max(500).default(""),
  value: z.string().min(1).max(16_384),
});

export const updateKeySchema = z.object({
  name: keyNameSchema.optional(),
  description: z.string().max(500).optional(),
  value: z.string().min(1).max(16_384).optional(),
});

export const deleteKeysSchema = z.object({
  ids: z.array(z.string().uuid()).min(1).max(100),
});

export type CreateKeyInput = z.infer<typeof createKeySchema>;
export type UpdateKeyInput = z.infer<typeof updateKeySchema>;

export function keyNameErrorKey(
  issue: z.ZodIssue | undefined,
): "errors.key_name_invalid" | "errors.invalid_input" {
  if (issue?.message === "errors.key_name_invalid") {
    return "errors.key_name_invalid";
  }
  return "errors.invalid_input";
}
