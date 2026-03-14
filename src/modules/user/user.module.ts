import { Module } from '@nestjs/common';

import {
  AuthCredentialsRepository,
  EmailChangeTokenRepository,
  EmailVerificationTokenRepository,
  LimitsRepository,
  UserRepository,
} from './repositories';
import {
  AuthCredentialsService,
  EmailChangeTokenService,
  EmailVerificationTokenService,
  LimitsService,
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
    LimitsService,
    LimitsRepository,
    UserService,
    UserRepository,
  ],
  exports: [
    AuthCredentialsService,
    EmailChangeTokenService,
    EmailVerificationTokenService,
    LimitsService,
    UserService,
  ],
})
export class UserModule {}
