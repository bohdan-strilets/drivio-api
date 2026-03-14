import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z.string().default('3000'),

  DATABASE_URL: z.string().url(),

  BCRYPT_SALT_ROUNDS: z.coerce.number().min(10).max(15).default(12),
  SECURITY_TOKEN_BYTES: z.coerce.number().min(16).max(64).default(32),

  RESEND_API_KEY: z.string().min(1).optional(),
  EMAIL_FROM: z.string().email().optional(),

  CLOUDINARY_CLOUD_NAME: z.string().min(1).optional(),
  CLOUDINARY_API_KEY: z.string().min(1).optional(),
  CLOUDINARY_API_SECRET: z.string().min(1).optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;
