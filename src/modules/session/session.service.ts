import { Injectable } from '@nestjs/common';
import { Prisma, Session } from '@prisma/client';

import { SessionRepository } from './session.repository';

@Injectable()
export class SessionService {
  constructor(private readonly sessionRepository: SessionRepository) {}

  async create(data: Prisma.SessionCreateInput): Promise<Session> {
    return this.sessionRepository.create(data);
  }

  async findById(id: string): Promise<Session | null> {
    return this.sessionRepository.findById(id);
  }

  async findActiveByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<Session | null> {
    return this.sessionRepository.findActiveByIdAndUserId(id, userId);
  }

  async findActiveByRefreshTokenHash(
    refreshTokenHash: string,
    userId: string,
  ): Promise<Session | null> {
    return this.sessionRepository.findByRefreshTokenHash(
      refreshTokenHash,
      userId,
    );
  }

  async findActiveByUserId(userId: string): Promise<Session[]> {
    return this.sessionRepository.findActiveByUserId(userId);
  }

  async validateSession(id: string, userId: string): Promise<Session | null> {
    const session = await this.sessionRepository.findActiveByIdAndUserId(
      id,
      userId,
    );

    if (!session) return null;

    const now = new Date();
    if (session.expiresAt < now) {
      await this.sessionRepository.revokeById(id);
      return null;
    }

    return session;
  }

  async rotateRefreshToken(
    oldRefreshTokenHash: string,
    userId: string,
    newRefreshTokenHash: string,
    expiresAt: Date,
  ): Promise<Session | null> {
    const session = await this.sessionRepository.findByRefreshTokenHash(
      oldRefreshTokenHash,
      userId,
    );

    if (!session) return null;

    return this.sessionRepository.rotateSessionTransaction(
      session,
      newRefreshTokenHash,
      expiresAt,
    );
  }

  async updateLastActivity(id: string): Promise<Session> {
    return this.sessionRepository.updateLastActivity(id);
  }

  async revokeById(id: string): Promise<Session> {
    return this.sessionRepository.revokeById(id);
  }

  async logout(sessionId: string): Promise<void> {
    await this.sessionRepository.revokeById(sessionId);
  }

  async revokeOtherSessions(
    userId: string,
    currentSessionId: string,
  ): Promise<void> {
    await this.sessionRepository.revokeOtherSessionsByUserId(
      userId,
      currentSessionId,
    );
  }

  async revokeAllByUserId(userId: string): Promise<number> {
    return this.sessionRepository.revokeAllByUserId(userId);
  }

  async cleanupExpired(olderThan: Date): Promise<number> {
    return this.sessionRepository.deleteExpired(olderThan);
  }
}
