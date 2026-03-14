import { Module } from '@nestjs/common';

import { UserController } from './user.controller';
import {
  AuthCredentialsRepository,
  UserRepository,
} from './repositories';
import { AuthCredentialsService, UserService } from './services';

@Module({
  controllers: [UserController],
  providers: [
    AuthCredentialsService,
    AuthCredentialsRepository,
    UserService,
    UserRepository,
  ],
  exports: [AuthCredentialsService, UserService],
})
export class UserModule {}
