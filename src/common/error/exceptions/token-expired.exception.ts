import { HttpStatus } from '@nestjs/common';

import { AppException } from '../app.exception';

export class TokenExpiredException extends AppException {
  constructor() {
    super('TOKEN_EXPIRED', HttpStatus.UNAUTHORIZED);
  }
}
