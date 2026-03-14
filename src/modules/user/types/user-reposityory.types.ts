import { AuthCredentials, User } from '@prisma/client';

export type UserWithCredentials = User & {
  authCredentials: AuthCredentials | null;
};
