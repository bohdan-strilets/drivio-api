import { Language, RegistrationSource, UserStatus } from '@prisma/client';

export type UserResponse = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  avatarMediaId: string | null;
  coverMediaId: string | null;
  status: UserStatus;
  emailVerified: boolean;
  emailVerifiedAt: Date | null;
  lastLoginAt: Date | null;
  loginCount: number;
  registrationSource: RegistrationSource;
  locale: Language;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};
