import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { EnvService } from './config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger(bootstrap.name);
  const envService = app.get(EnvService);

  const port = envService.port;
  const nodeEnv = envService.nodeEnv;

  await app.listen(port);

  logger.debug(`Server running on port: ${port}`);
  logger.debug(`Env mode: ${nodeEnv}`);
}
void bootstrap();
