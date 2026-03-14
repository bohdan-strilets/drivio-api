import { User } from '@prisma/client';

import { UserResponse } from './types';

export function toUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    avatarMediaId: user.avatarMediaId,
    coverMediaId: user.coverMediaId,
    status: user.status,
    emailVerified: user.emailVerified,
    emailVerifiedAt: user.emailVerifiedAt,
    lastLoginAt: user.lastLoginAt,
    loginCount: user.loginCount,
    registrationSource: user.registrationSource,
    locale: user.locale,
    timezone: user.timezone,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    deletedAt: user.deletedAt,
  };
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
