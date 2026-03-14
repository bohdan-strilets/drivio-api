import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { EnvService } from '@config';

@Injectable()
export class PasswordService {
  constructor(private readonly env: EnvService) {}

  async hash(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, this.env.bcryptSaltRounds);
  }

  async verify(plainPassword: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hash);
  }
}
