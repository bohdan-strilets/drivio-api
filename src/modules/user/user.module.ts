import { Module } from '@nestjs/common';

import {
  AuthCredentialsRepository,
  EmailChangeTokenRepository,
  EmailVerificationTokenRepository,
  LimitsRepository,
  OAuthRepository,
  PasswordResetTokenRepository,
  UserRepository,
} from './repositories';
import {
  AuthCredentialsService,
  EmailChangeTokenService,
  EmailVerificationTokenService,
  LimitsService,
  OAuthService,
  PasswordResetService,
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
    PasswordResetService,
    PasswordResetTokenRepository,
    UserService,
    UserRepository,
  ],
  exports: [
    AuthCredentialsService,
    EmailChangeTokenService,
    EmailVerificationTokenService,
    LimitsService,
    OAuthService,
    PasswordResetService,
    UserService,
  ],
})
export class UserModule {}
