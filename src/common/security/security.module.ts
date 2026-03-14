import { Global, Module } from '@nestjs/common';

import { ConfigModule } from '@config';

import { PasswordService } from './password.service';
import { TokenService } from './token.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [PasswordService, TokenService],
  exports: [PasswordService, TokenService],
})
export class SecurityModule {}
