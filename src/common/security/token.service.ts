import { randomBytes, createHash, timingSafeEqual } from 'crypto';

import { Injectable } from '@nestjs/common';

import { EnvService } from '../../config/env.service';

import { HASH_ALGORITHM } from './constants';
import { GeneratedToken } from './types';

@Injectable()
export class TokenService {
  constructor(private readonly env: EnvService) {}

  generate(): GeneratedToken {
    const token = randomBytes(this.env.securityTokenBytes).toString('hex');
    const tokenHash = this.hashToken(token);
    return { token, tokenHash };
  }

  hashToken(plainToken: string): string {
    return createHash(HASH_ALGORITHM).update(plainToken).digest('hex');
  }

  verify(plainToken: string, tokenHash: string): boolean {
    if (tokenHash.length !== 64) return false;

    const computed = createHash(HASH_ALGORITHM)
      .update(plainToken)
      .digest('hex');

    const a = Buffer.from(computed, 'hex');
    const b = Buffer.from(tokenHash, 'hex');

    return timingSafeEqual(a, b);
  }
}
