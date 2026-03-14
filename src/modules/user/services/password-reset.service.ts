import { Injectable } from '@nestjs/common';
import { PasswordResetToken, Prisma } from '@prisma/client';

import { PasswordResetTokenRepository } from '../repositories';

@Injectable()
export class PasswordResetService {
  constructor(
    private readonly passwordResetTokenRepository: PasswordResetTokenRepository,
  ) {}

  async create(
    data: Prisma.PasswordResetTokenCreateInput,
  ): Promise<PasswordResetToken> {
    return this.passwordResetTokenRepository.create(data);
  }

  async findByTokenHash(tokenHash: string): Promise<PasswordResetToken | null> {
    return this.passwordResetTokenRepository.findByTokenHash(tokenHash);
  }

  async markAsUsed(id: string): Promise<{ count: number }> {
    return this.passwordResetTokenRepository.markAsUsed(id);
  }

  async deleteByUserId(userId: string): Promise<{ count: number }> {
    return this.passwordResetTokenRepository.deleteByUserId(userId);
  }

  async deleteExpired(now = new Date()): Promise<{ count: number }> {
    return this.passwordResetTokenRepository.deleteExpired(now);
  }
}
