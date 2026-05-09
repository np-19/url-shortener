import { z } from 'zod';
import { VALIDATION_RULES } from './constants';

const emailSchema = z.string().trim().toLowerCase().email('Invalid email address');
const passwordSchema = z
  .string()
  .min(VALIDATION_RULES.password.minLength, 'Password must be at least 6 characters long')
  .max(VALIDATION_RULES.password.maxLength, 'Password cannot exceed 128 characters');

export const registerDataSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(VALIDATION_RULES.name.minLength, 'Name must be at least 3 characters long')
      .max(VALIDATION_RULES.name.maxLength, 'Name cannot exceed 100 characters'),
    email: emailSchema,
    password: passwordSchema,
  })
  .strict();

export const loginDataSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
  })
  .strict();

export const urlDataSchema = z
  .object({
    originalUrl: z.string().trim().url('Please enter a valid URL'),
    expiresAt: z.coerce
      .number()
      .int('Expiration time must be a whole number of seconds')
      .min(VALIDATION_RULES.expiresAtSeconds.min, 'Expiration time must be positive'),
    customAlias: z
      .string()
      .trim()
      .min(VALIDATION_RULES.customAlias.minLength, 'Custom alias must be at least 2 characters long')
      .max(VALIDATION_RULES.customAlias.maxLength, 'Custom alias cannot exceed 50 characters')
      .regex(VALIDATION_RULES.customAlias.pattern, 'Custom alias can only contain letters, numbers, and hyphens')
      .optional(),
  })
  .strict();

const userSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
  })
  .strict();

export const authResponseSchema = z
  .object({
    success: z.boolean(),
    message: z.string(),
    data: z
      .object({
        token: z.string(),
        user: userSchema,
      })
      .strict(),
  })
  .strict();

export const userResponseSchema = z
  .object({
    success: z.boolean(),
    data: z
      .object({
        id: z.string(),
        name: z.string(),
        email: z.string().email(),
        createdAt: z.string(),
      })
      .strict(),
  })
  .strict();

export const urlResponseSchema = z
  .object({
    shortId: z.string(),
  })
  .strict();

const userIdSchema = z.preprocess((value) => {
  if (value == null) {
    return undefined;
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'object' && value && 'toString' in value) {
    return String(value);
  }

  return value;
}, z.string().optional());

const urlItemSchema = z
  .object({
    _id: z.string(),
    originalUrl: z.string(),
    shortId: z.string(),
    clicks: z.number(),
    createdAt: z.string(),
    expiresAt: z.string(),
    userId: userIdSchema,
  })
  .passthrough();

export const urlsResponseSchema = z
  .object({
    urls: z.array(urlItemSchema),
  })
  .strict();

export const apiErrorSchema = z
  .object({
    message: z.string().optional(),
    error: z.string().optional(),
  })
  .strict();

export type RegisterData = z.infer<typeof registerDataSchema>;
export type LoginData = z.infer<typeof loginDataSchema>;
export type UrlData = z.infer<typeof urlDataSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type UrlResponse = z.infer<typeof urlResponseSchema>;
export type UrlItem = z.infer<typeof urlItemSchema>;
export type UrlsResponse = z.infer<typeof urlsResponseSchema>;
