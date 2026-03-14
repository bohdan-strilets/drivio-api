import { Injectable } from '@nestjs/common';
import { Prisma, Session, SessionStatus } from '@prisma/client';

import { PrismaService } from '../../database';

@Injectable()
export class SessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.SessionCreateInput): Promise<Session> {
    return this.prisma.session.create({ data });
  }

  async findById(id: string): Promise<Session | null> {
    return this.prisma.session.findUnique({ where: { id } });
  }

  async findActiveByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<Session | null> {
    const session = await this.prisma.session.findUnique({
      where: { id_userId: { id, userId } },
    });
    return session?.status === SessionStatus.ACTIVE ? session : null;
  }

  async findByRefreshTokenHash(
    refreshTokenHash: string,
    userId: string,
  ): Promise<Session | null> {
    const session = await this.prisma.session.findUnique({
      where: { refreshTokenHash },
    });
    const now = new Date();
    if (
      !session ||
      session.userId !== userId ||
      session.status !== SessionStatus.ACTIVE ||
      session.expiresAt <= now
    ) {
      return null;
    }
    return session;
  }

  async findActiveByUserId(userId: string): Promise<Session[]> {
    return this.prisma.session.findMany({
      where: { userId, status: SessionStatus.ACTIVE },
      orderBy: { lastActivityAt: 'desc' },
    });
  }

  async updateLastActivity(id: string): Promise<Session> {
    return this.prisma.session.update({
      where: { id },
      data: { lastActivityAt: new Date() },
    });
  }

  async revokeById(id: string): Promise<Session> {
    const now = new Date();
    return this.prisma.session.update({
      where: { id },
      data: { status: SessionStatus.REVOKED, revokedAt: now },
    });
  }

  async rotateSessionTransaction(
    session: Session,
    newRefreshTokenHash: string,
    expiresAt: Date,
  ): Promise<Session> {
    const now = new Date();
    return this.prisma.$transaction(async (tx) => {
      await tx.session.update({
        where: { id: session.id },
        data: { status: SessionStatus.REVOKED, revokedAt: now },
      });
      return tx.session.create({
        data: {
          user: { connect: { id: session.userId } },
          refreshTokenHash: newRefreshTokenHash,
          deviceType: session.deviceType,
          deviceName: session.deviceName,
          deviceOS: session.deviceOS,
          deviceBrowser: session.deviceBrowser,
          ipAddress: session.ipAddress,
          userAgent: session.userAgent,
          country: session.country,
          city: session.city,
          lastActivityAt: now,
          expiresAt,
          createdAt: now,
        },
      });
    });
  }

  async revokeAllByUserId(userId: string): Promise<number> {
    const now = new Date();
    const result = await this.prisma.session.updateMany({
      where: { userId, status: SessionStatus.ACTIVE },
      data: { status: SessionStatus.REVOKED, revokedAt: now },
    });
    return result.count;
  }

  async revokeOtherSessionsByUserId(
    userId: string,
    currentSessionId: string,
  ): Promise<number> {
    const now = new Date();
    const result = await this.prisma.session.updateMany({
      where: {
        userId,
        status: SessionStatus.ACTIVE,
        id: { not: currentSessionId },
      },
      data: { status: SessionStatus.REVOKED, revokedAt: now },
    });
    return result.count;
  }

  async deleteExpired(olderThan: Date): Promise<number> {
    const result = await this.prisma.session.deleteMany({
      where: {
        expiresAt: { lt: olderThan },
        status: { not: SessionStatus.ACTIVE },
      },
    });
    return result.count;
  }
}
