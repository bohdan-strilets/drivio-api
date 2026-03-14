import { Module } from '@nestjs/common';

import {
  AuthCredentialsRepository,
  EmailChangeTokenRepository,
  EmailVerificationTokenRepository,
  LimitsRepository,
  OAuthRepository,
  UserRepository,
} from './repositories';
import {
  AuthCredentialsService,
  EmailChangeTokenService,
  EmailVerificationTokenService,
  LimitsService,
  OAuthService,
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
    OAuthService,
    OAuthRepository,
    UserService,
    UserRepository,
  ],
  exports: [
    AuthCredentialsService,
    EmailChangeTokenService,
    EmailVerificationTokenService,
    LimitsService,
    OAuthService,
    UserService,
  ],
})
export class UserModule {}
