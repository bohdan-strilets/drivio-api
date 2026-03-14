import { HttpStatus } from '@nestjs/common';

import { AppException } from '../app.exception';

export class UserSuspendedException extends AppException {
  constructor() {
    super('USER_SUSPENDED', HttpStatus.FORBIDDEN);
  }
}
