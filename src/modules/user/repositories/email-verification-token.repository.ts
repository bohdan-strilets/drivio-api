import { Injectable } from '@nestjs/common';
import { EmailVerificationToken, Prisma } from '@prisma/client';

import { PrismaService, PrismaTransactionClient } from '../../../database';

@Injectable()
export class EmailVerificationTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: Prisma.EmailVerificationTokenCreateInput,
  ): Promise<EmailVerificationToken> {
    return this.prisma.emailVerificationToken.create({ data });
  }

  async runInTransaction<T>(
    fn: (tx: PrismaTransactionClient) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction(fn);
  }

  async findByTokenHash(
    tokenHash: string,
  ): Promise<EmailVerificationToken | null> {
    return this.prisma.emailVerificationToken.findUnique({
      where: { tokenHash },
    });
  }

  async findByTokenHashTx(
    tx: PrismaTransactionClient,
    tokenHash: string,
  ): Promise<EmailVerificationToken | null> {
    return tx.emailVerificationToken.findUnique({
      where: { tokenHash },
    });
  }

  async markAsUsedTx(
    tx: PrismaTransactionClient,
    id: string,
    usedAt: Date,
  ): Promise<{ count: number }> {
    return tx.emailVerificationToken.updateMany({
      where: {
        id,
        usedAt: null,
      },
      data: { usedAt },
    });
  }

  async markAsUsed(id: string): Promise<{ count: number }> {
    return this.prisma.emailVerificationToken.updateMany({
      where: {
        id,
        usedAt: null,
      },
      data: {
        usedAt: new Date(),
      },
    });
  }

  async deleteByUserId(userId: string): Promise<{ count: number }> {
    return this.prisma.emailVerificationToken.deleteMany({
      where: { userId },
    });
  }

  async deleteExpired(now: Date): Promise<{ count: number }> {
    return this.prisma.emailVerificationToken.deleteMany({
      where: { expiresAt: { lt: now } },
    });
  }
}
