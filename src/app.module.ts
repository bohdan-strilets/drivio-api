import { Module } from '@nestjs/common';

import { SecurityModule } from '@common/security';
import { ConfigModule } from '@config';
import { DatabaseModule } from '@database';
import { EmailModule } from '@modules/email';
import { SessionModule } from '@modules/session';
import { UserModule } from '@modules/user';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    SecurityModule,
    EmailModule,
    UserModule,
    SessionModule,
  ],
})
export class AppModule {}
