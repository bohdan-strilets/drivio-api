import { Injectable } from '@nestjs/common';
import { EmailChangeToken, Prisma } from '@prisma/client';

import { TokenInvalidException } from '../../../common/error/exceptions';
import { TokenService } from '../../../common/security';
import { EmailChangeTokenRepository } from '../repositories';

@Injectable()
export class EmailChangeTokenService {
  constructor(
    private readonly emailChangeTokenRepository: EmailChangeTokenRepository,
    private readonly tokenService: TokenService,
  ) {}

  async create(
    data: Prisma.EmailChangeTokenCreateInput,
  ): Promise<EmailChangeToken> {
    return this.emailChangeTokenRepository.create(data);
  }

  async createTokenForUser(
    userId: string,
    newEmail: string,
    expiresAt: Date,
  ): Promise<{ token: string; record: EmailChangeToken }> {
    const { token, tokenHash } = this.tokenService.generate();
    const record = await this.emailChangeTokenRepository.create({
      user: { connect: { id: userId } },
      newEmail,
      tokenHash,
      expiresAt,
    });
    return { token, record };
  }

  private async findByTokenHash(
    tokenHash: string,
  ): Promise<EmailChangeToken | null> {
    return this.emailChangeTokenRepository.findByTokenHash(tokenHash);
  }

  async validateTokenOrThrow(plainToken: string): Promise<EmailChangeToken> {
    const tokenHash = this.tokenService.hashToken(plainToken);
    const now = new Date();
    const token = await this.findByTokenHash(tokenHash);

    if (!token) {
      throw new TokenInvalidException();
    }

    if (token.usedAt) {
      throw new TokenInvalidException();
    }

    if (token.expiresAt < now) {
      throw new TokenInvalidException();
    }

    return token;
  }

  async validateAndMarkAsUsed(plainToken: string): Promise<EmailChangeToken> {
    const tokenHash = this.tokenService.hashToken(plainToken);
    const now = new Date();

    return this.emailChangeTokenRepository.runInTransaction(async (tx) => {
      const token = await this.emailChangeTokenRepository.findByTokenHashTx(
        tx,
        tokenHash,
      );

      if (!token || token.usedAt || token.expiresAt < now) {
        throw new TokenInvalidException();
      }

      const result = await this.emailChangeTokenRepository.markAsUsedTx(
        tx,
        token.id,
        now,
      );

      if (result.count === 0) {
        throw new TokenInvalidException();
      }

      return token;
    });
  }

  async markAsUsed(id: string): Promise<{ count: number }> {
    const result = await this.emailChangeTokenRepository.markAsUsed(id);
    if (result.count === 0) {
      throw new TokenInvalidException();
    }
    return result;
  }

  async deleteByUserId(userId: string): Promise<{ count: number }> {
    return this.emailChangeTokenRepository.deleteByUserId(userId);
  }

  async deleteExpired(now = new Date()): Promise<{ count: number }> {
    return this.emailChangeTokenRepository.deleteExpired(now);
  }
}
