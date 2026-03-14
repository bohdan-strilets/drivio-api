import { Module } from '@nestjs/common';

import { UserController } from './user.controller';
import {
  AuthCredentialsRepository,
  EmailChangeTokenRepository,
  UserRepository,
} from './repositories';
import {
  AuthCredentialsService,
  EmailChangeTokenService,
  UserService,
} from './services';

@Module({
  controllers: [UserController],
  providers: [
    AuthCredentialsService,
    AuthCredentialsRepository,
    EmailChangeTokenService,
    EmailChangeTokenRepository,
    UserService,
    UserRepository,
  ],
  exports: [AuthCredentialsService, EmailChangeTokenService, UserService],
})
export class UserModule {}
