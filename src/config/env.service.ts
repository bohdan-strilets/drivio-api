import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EnvConfig } from './env.validation';

@Injectable()
export class EnvService {
  constructor(private readonly configService: ConfigService<EnvConfig, true>) {}

  get nodeEnv(): string {
    return this.configService.get('NODE_ENV');
  }

  get port(): string {
    return this.configService.get('PORT');
  }

  get databaseUrl(): string {
    return this.configService.get('DATABASE_URL');
  }
}
