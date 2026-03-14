import { Injectable } from '@nestjs/common';
import { AuthCredentials, Prisma } from '@prisma/client';

import { PrismaService } from '@database';

@Injectable()
export class AuthCredentialsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: Prisma.AuthCredentialsCreateInput,
  ): Promise<AuthCredentials> {
    return this.prisma.authCredentials.create({ data });
  }

  async findByUserId(userId: string): Promise<AuthCredentials | null> {
    return this.prisma.authCredentials.findUnique({
      where: { userId },
    });
  }

  async updateByUserId(
    userId: string,
    data: Prisma.AuthCredentialsUpdateInput,
  ): Promise<AuthCredentials> {
    return this.prisma.authCredentials.update({
      where: { userId },
      data,
    });
  }

  async updatePassword(
    userId: string,
    passwordHash: string,
  ): Promise<AuthCredentials> {
    return this.prisma.authCredentials.update({
      where: { userId },
      data: {
        passwordHash,
        passwordChangedAt: new Date(),
        passwordResetRequired: false,
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });
  }

  async incrementFailedAttempts(userId: string): Promise<AuthCredentials> {
    const now = new Date();
    return this.prisma.authCredentials.update({
      where: { userId },
      data: {
        failedLoginAttempts: { increment: 1 },
        lastFailedLoginAt: now,
      },
    });
  }

  async resetFailedAttempts(userId: string): Promise<AuthCredentials> {
    return this.prisma.authCredentials.update({
      where: { userId },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });
  }

  async setLockedUntil(
    userId: string,
    lockedUntil: Date | null,
  ): Promise<AuthCredentials> {
    return this.prisma.authCredentials.update({
      where: { userId },
      data: { lockedUntil },
    });
  }

  async setPasswordResetRequired(
    userId: string,
    passwordResetRequired: boolean,
  ): Promise<AuthCredentials> {
    return this.prisma.authCredentials.update({
      where: { userId },
      data: { passwordResetRequired },
    });
  }

  async deleteByUserId(userId: string): Promise<AuthCredentials> {
    return this.prisma.authCredentials.delete({
      where: { userId },
    });
  }
}
