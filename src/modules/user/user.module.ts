import { Module } from '@nestjs/common';

import {
  AuthCredentialsRepository,
  EmailChangeTokenRepository,
  EmailVerificationTokenRepository,
  LimitsRepository,
  OAuthRepository,
  PasswordResetTokenRepository,
  SubscriptionRepository,
  UserRepository,
} from './repositories';
import {
  AuthCredentialsService,
  EmailChangeTokenService,
  EmailVerificationTokenService,
  LimitsService,
  OAuthService,
  PasswordResetService,
  SubscriptionService,
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
    SubscriptionService,
    SubscriptionRepository,
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
    SubscriptionService,
    UserService,
  ],
})
export class UserModule {}
