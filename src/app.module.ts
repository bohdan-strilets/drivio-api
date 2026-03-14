import { Module } from '@nestjs/common';

import { SecurityModule } from '@common/security';
import { ConfigModule } from '@config';
import { DatabaseModule } from '@database';
import { SessionModule } from '@modules/session';
import { UserModule } from '@modules/user';

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
