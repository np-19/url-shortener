import { z } from "zod";
import { VALIDATION_RULES } from "./constants.js";

const emailSchema = z.email("Invalid email address");

const passwordSchema = z
    .string()
    .min(VALIDATION_RULES.password.minLength, "Password must be at least 6 characters long")
    .max(VALIDATION_RULES.password.maxLength, "Password cannot exceed 128 characters");

export const createUserSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(VALIDATION_RULES.name.minLength, "Name must be at least 3 characters long")
            .max(VALIDATION_RULES.name.maxLength, "Name cannot exceed 100 characters"),
        email: emailSchema,
        password: passwordSchema,
    })
    .strict();

export const loginUserSchema = z
    .object({
        email: emailSchema,
        password: passwordSchema,
    })
    .strict();

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
