import { Injectable } from '@nestjs/common';
import { AuthCredentials, Prisma } from '@prisma/client';

import { UserNotFoundException } from '../../../common/error/exceptions';
import { PasswordService } from '../../../common/security';
import { AuthCredentialsRepository } from '../repositories';

@Injectable()
export class AuthCredentialsService {
  constructor(
    private readonly authCredentialsRepository: AuthCredentialsRepository,
    private readonly passwordService: PasswordService,
  ) {}

  async create(
    data: Prisma.AuthCredentialsCreateInput,
  ): Promise<AuthCredentials> {
    return this.authCredentialsRepository.create(data);
  }

  async findByUserId(userId: string): Promise<AuthCredentials | null> {
    return this.authCredentialsRepository.findByUserId(userId);
  }

  async findByUserIdOrThrow(userId: string): Promise<AuthCredentials> {
    const credentials = await this.findByUserId(userId);
    if (!credentials) {
      throw new UserNotFoundException();
    }
    return credentials;
  }

  async updatePassword(
    userId: string,
    passwordHash: string,
  ): Promise<AuthCredentials> {
    return this.throwUserNotFoundIfNotExists(
      this.authCredentialsRepository.updatePassword(userId, passwordHash),
    );
  }

  async setPassword(
    userId: string,
    plainPassword: string,
  ): Promise<AuthCredentials> {
    const passwordHash = await this.passwordService.hash(plainPassword);
    return this.updatePassword(userId, passwordHash);
  }

  async verifyPassword(
    userId: string,
    plainPassword: string,
  ): Promise<boolean> {
    const credentials = await this.findByUserId(userId);
    if (!credentials) {
      return false;
    }
    return this.passwordService.verify(plainPassword, credentials.passwordHash);
  }

  async incrementFailedAttempts(userId: string): Promise<AuthCredentials> {
    return this.throwUserNotFoundIfNotExists(
      this.authCredentialsRepository.incrementFailedAttempts(userId),
    );
  }

  async resetFailedAttempts(userId: string): Promise<AuthCredentials> {
    return this.throwUserNotFoundIfNotExists(
      this.authCredentialsRepository.resetFailedAttempts(userId),
    );
  }

  async setLockedUntil(
    userId: string,
    lockedUntil: Date | null,
  ): Promise<AuthCredentials> {
    return this.throwUserNotFoundIfNotExists(
      this.authCredentialsRepository.setLockedUntil(userId, lockedUntil),
    );
  }

  async setPasswordResetRequired(
    userId: string,
    passwordResetRequired: boolean,
  ): Promise<AuthCredentials> {
    return this.throwUserNotFoundIfNotExists(
      this.authCredentialsRepository.setPasswordResetRequired(
        userId,
        passwordResetRequired,
      ),
    );
  }

  async updateByUserId(
    userId: string,
    data: Prisma.AuthCredentialsUpdateInput,
  ): Promise<AuthCredentials> {
    return this.throwUserNotFoundIfNotExists(
      this.authCredentialsRepository.updateByUserId(userId, data),
    );
  }

  async deleteByUserId(userId: string): Promise<AuthCredentials> {
    return this.throwUserNotFoundIfNotExists(
      this.authCredentialsRepository.deleteByUserId(userId),
    );
  }

  private async throwUserNotFoundIfNotExists<T>(
    promise: Promise<T>,
  ): Promise<T> {
    try {
      return await promise;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new UserNotFoundException();
      }
      throw error;
    }
  }
}
