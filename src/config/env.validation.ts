import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z.string().default('3000'),

  DATABASE_URL: z.string().url(),
});

export type EnvConfig = z.infer<typeof envSchema>;
