export const VALIDATION_RULES = {
  name: {
    minLength: 3,
    maxLength: 100,
  },
  password: {
    minLength: 6,
    maxLength: 128,
  },
  customAlias: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9-]+$/,
  },
  expiresAtSeconds: {
    min: 1,
  },
} as const;
