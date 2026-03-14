import { Module } from '@nestjs/common';

import { SecurityModule } from './common/security';
import { ConfigModule } from './config';
import { DatabaseModule } from './database';
import { SessionModule } from './modules/session/session.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    SecurityModule,
    UserModule,
    SessionModule,
  ],
})
export class AppModule {}
