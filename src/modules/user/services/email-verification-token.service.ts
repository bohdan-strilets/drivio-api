import { Injectable } from '@nestjs/common';
import { EmailVerificationToken, Prisma } from '@prisma/client';

import { TokenInvalidException } from '@common/error';
import { TokenService } from '@common/security';

import { EmailVerificationTokenRepository } from '../repositories';

@Injectable()
export class EmailVerificationTokenService {
  constructor(
    private readonly emailVerificationTokenRepository: EmailVerificationTokenRepository,
    private readonly tokenService: TokenService,
  ) {}

  async create(
    data: Prisma.EmailVerificationTokenCreateInput,
  ): Promise<EmailVerificationToken> {
    return this.emailVerificationTokenRepository.create(data);
  }

  async createTokenForUser(
    userId: string,
    email: string,
    expiresAt: Date,
  ): Promise<{ token: string; record: EmailVerificationToken }> {
    const { token, tokenHash } = this.tokenService.generate();
    const record = await this.emailVerificationTokenRepository.create({
      user: { connect: { id: userId } },
      email,
      tokenHash,
      expiresAt,
    });
    return { token, record };
  }

  private async findByTokenHash(
    tokenHash: string,
  ): Promise<EmailVerificationToken | null> {
    return this.emailVerificationTokenRepository.findByTokenHash(tokenHash);
  }

  async validateTokenOrThrow(
    plainToken: string,
  ): Promise<EmailVerificationToken> {
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

  async validateAndMarkAsUsed(
    plainToken: string,
  ): Promise<EmailVerificationToken> {
    const tokenHash = this.tokenService.hashToken(plainToken);
    const now = new Date();

    return this.emailVerificationTokenRepository.runInTransaction(
      async (tx) => {
        const token =
          await this.emailVerificationTokenRepository.findByTokenHashTx(
            tx,
            tokenHash,
          );

        if (!token || token.usedAt || token.expiresAt < now) {
          throw new TokenInvalidException();
        }

        const result = await this.emailVerificationTokenRepository.markAsUsedTx(
          tx,
          token.id,
          now,
        );

        if (result.count === 0) {
          throw new TokenInvalidException();
        }

        return token;
      },
    );
  }

  async markAsUsed(id: string): Promise<{ count: number }> {
    const result = await this.emailVerificationTokenRepository.markAsUsed(id);
    if (result.count === 0) {
      throw new TokenInvalidException();
    }
    return result;
  }

  async deleteByUserId(userId: string): Promise<{ count: number }> {
    return this.emailVerificationTokenRepository.deleteByUserId(userId);
  }

  async deleteExpired(now = new Date()): Promise<{ count: number }> {
    return this.emailVerificationTokenRepository.deleteExpired(now);
  }
}
