import { Module } from '@nestjs/common';

import {
  AuthCredentialsRepository,
  EmailChangeTokenRepository,
  EmailVerificationTokenRepository,
  UserRepository,
} from './repositories';
import {
  AuthCredentialsService,
  EmailChangeTokenService,
  EmailVerificationTokenService,
  UserService,
} from './services';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  providers: [
    AuthCredentialsService,
    AuthCredentialsRepository,
    EmailChangeTokenService,
    EmailChangeTokenRepository,
    EmailVerificationTokenService,
    EmailVerificationTokenRepository,
    UserService,
    UserRepository,
  ],
  exports: [
    AuthCredentialsService,
    EmailChangeTokenService,
    EmailVerificationTokenService,
    UserService,
  ],
})
export class UserModule {}
