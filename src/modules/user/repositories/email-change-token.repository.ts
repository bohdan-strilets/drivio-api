import { Injectable } from '@nestjs/common';
import { EmailChangeToken, Prisma } from '@prisma/client';

import { PrismaService } from '../../../database';

@Injectable()
export class EmailChangeTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: Prisma.EmailChangeTokenCreateInput,
  ): Promise<EmailChangeToken> {
    return this.prisma.emailChangeToken.create({ data });
  }

  async findByTokenHash(tokenHash: string): Promise<EmailChangeToken | null> {
    return this.prisma.emailChangeToken.findUnique({
      where: { tokenHash },
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

  async deleteExpired(): Promise<{ count: number }> {
    return this.prisma.emailChangeToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  }
}
