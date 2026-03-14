import { Injectable } from '@nestjs/common';
import { EmailChangeToken, Prisma } from '@prisma/client';

import { TokenInvalidException } from '../../../common/error/exceptions';
import { PrismaService } from '../../../database';
import { EmailChangeTokenRepository } from '../repositories';

@Injectable()
export class EmailChangeTokenService {
  constructor(
    private readonly emailChangeTokenRepository: EmailChangeTokenRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(
    data: Prisma.EmailChangeTokenCreateInput,
  ): Promise<EmailChangeToken> {
    return this.emailChangeTokenRepository.create(data);
  }

  private async findByTokenHash(
    tokenHash: string,
  ): Promise<EmailChangeToken | null> {
    return this.emailChangeTokenRepository.findByTokenHash(tokenHash);
  }

  async validateTokenOrThrow(tokenHash: string): Promise<EmailChangeToken> {
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

  async validateAndMarkAsUsed(tokenHash: string): Promise<EmailChangeToken> {
    const now = new Date();

    return this.prisma.$transaction(async (tx) => {
      const token = await tx.emailChangeToken.findUnique({
        where: { tokenHash },
      });

      if (!token || token.usedAt || token.expiresAt < now) {
        throw new TokenInvalidException();
      }

      return tx.emailChangeToken.update({
        where: { id: token.id },
        data: { usedAt: now },
      });
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

  async deleteExpired(): Promise<{ count: number }> {
    return this.emailChangeTokenRepository.deleteExpired();
  }
}
