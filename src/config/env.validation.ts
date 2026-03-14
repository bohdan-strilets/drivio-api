import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z.string().default('3000'),

  DATABASE_URL: z.string().url(),

  BCRYPT_SALT_ROUNDS: z.coerce.number().min(10).max(15).default(12),
  SECURITY_TOKEN_BYTES: z.coerce.number().min(16).max(64).default(32),
});

export type EnvConfig = z.infer<typeof envSchema>;
