import { HttpStatus } from '@nestjs/common';

import { AppException } from '../app.exception';

export class UserAlreadyExistsException extends AppException {
  constructor() {
    super('USER_ALREADY_EXISTS', HttpStatus.CONFLICT);
  }
}
