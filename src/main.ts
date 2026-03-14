import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { EnvService } from '@config';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const logger = new Logger(bootstrap.name);
  const envService = app.get(EnvService);

  const port = envService.port;
  const nodeEnv = envService.nodeEnv;

  await app.listen(port);

  logger.debug(`Server running on port: ${port}`);
  logger.debug(`Env mode: ${nodeEnv}`);
}
void bootstrap();
