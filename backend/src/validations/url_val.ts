import { z } from "zod";
import { VALIDATION_RULES } from "./constants.js";

const customAliasSchema = z
    .string()
    .trim()
    .min(VALIDATION_RULES.customAlias.minLength, "Custom alias must be at least 2 characters long")
    .max(VALIDATION_RULES.customAlias.maxLength, "Custom alias cannot exceed 50 characters")
    .regex(VALIDATION_RULES.customAlias.pattern, "Custom alias can only contain letters, numbers, and hyphens");

export const createUrlSchema = z
    .object({
        originalUrl: z.string().trim().url("Invalid URL format"),
        expiresAt: z.coerce
            .number()
            .int("Expiration time must be a whole number in seconds")
            .min(VALIDATION_RULES.expiresAtSeconds.min, "Expiration time must be a positive number"),
        customAlias: customAliasSchema.optional(),
    })
    .strict();

export type CreateUrlInput = z.infer<typeof createUrlSchema>;
