import { HttpStatus } from '@nestjs/common';

import { AppException } from '../app.exception';

export class TokenInvalidException extends AppException {
  constructor() {
    super('TOKEN_INVALID', HttpStatus.UNAUTHORIZED);
  }
}
