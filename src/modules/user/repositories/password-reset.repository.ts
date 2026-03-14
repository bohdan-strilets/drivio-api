import { Injectable } from '@nestjs/common';
import { PasswordResetToken, Prisma } from '@prisma/client';

import { PrismaService } from '@database';

@Injectable()
export class PasswordResetTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: Prisma.PasswordResetTokenCreateInput,
  ): Promise<PasswordResetToken> {
    return this.prisma.passwordResetToken.create({ data });
  }

  async findByTokenHash(tokenHash: string): Promise<PasswordResetToken | null> {
    return this.prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });
  }

  async markAsUsed(id: string): Promise<{ count: number }> {
    return this.prisma.passwordResetToken.updateMany({
      where: {
        id,
        usedAt: null,
      },
      data: { usedAt: new Date() },
    });
  }

  async deleteByUserId(userId: string): Promise<{ count: number }> {
    return this.prisma.passwordResetToken.deleteMany({
      where: { userId },
    });
  }

  async deleteExpired(now: Date): Promise<{ count: number }> {
    return this.prisma.passwordResetToken.deleteMany({
      where: { expiresAt: { lt: now } },
    });
  }
}
