import { Injectable } from '@nestjs/common';
import { EmailChangeToken, Prisma } from '@prisma/client';

import { PrismaService, PrismaTransactionClient } from '../../../database';

@Injectable()
export class EmailChangeTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: Prisma.EmailChangeTokenCreateInput,
  ): Promise<EmailChangeToken> {
    return this.prisma.emailChangeToken.create({ data });
  }

  async runInTransaction<T>(
    fn: (tx: PrismaTransactionClient) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction(fn);
  }

  async findByTokenHash(tokenHash: string): Promise<EmailChangeToken | null> {
    return this.prisma.emailChangeToken.findUnique({
      where: { tokenHash },
    });
  }

  async findByTokenHashTx(
    tx: PrismaTransactionClient,
    tokenHash: string,
  ): Promise<EmailChangeToken | null> {
    return tx.emailChangeToken.findUnique({
      where: { tokenHash },
    });
  }

  async markAsUsedTx(
    tx: PrismaTransactionClient,
    id: string,
    usedAt: Date,
  ): Promise<{ count: number }> {
    return tx.emailChangeToken.updateMany({
      where: {
        id,
        usedAt: null,
      },
      data: { usedAt },
    });
  }

  async markAsUsed(id: string): Promise<{ count: number }> {
    return this.prisma.emailChangeToken.updateMany({
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
    return this.prisma.emailChangeToken.deleteMany({
      where: { userId },
    });
  }

  async deleteExpired(now: Date): Promise<{ count: number }> {
    return this.prisma.emailChangeToken.deleteMany({
      where: { expiresAt: { lt: now } },
    });
  }
}
