import { Logger } from '@nestjs/common';

import { envSchema, EnvConfig } from './env.validation';

const logger = new Logger('ConfigValidation');

export const validateEnv = (config: Record<string, unknown>): EnvConfig => {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    logger.error('Invalid environment variables:');
    logger.error(result.error.format());
    process.exit(1);
  }

  logger.log('Environment variables validated successfully');
  return result.data;
};
