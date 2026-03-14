import { Injectable } from '@nestjs/common';
import { OAuthAccount, OAuthProvider, Prisma } from '@prisma/client';

import { PrismaService } from '@database';

@Injectable()
export class OAuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.OAuthAccountCreateInput): Promise<OAuthAccount> {
    return this.prisma.oAuthAccount.create({ data });
  }

  async findByProviderAndUserId(
    provider: OAuthProvider,
    providerUserId: string,
  ): Promise<OAuthAccount | null> {
    return this.prisma.oAuthAccount.findUnique({
      where: {
        provider_providerUserId: {
          provider,
          providerUserId,
        },
      },
    });
  }

  async findAllByUserId(userId: string): Promise<OAuthAccount[]> {
    return this.prisma.oAuthAccount.findMany({
      where: { userId },
    });
  }

  async updateTokens(
    provider: OAuthProvider,
    providerUserId: string,
    data: {
      providerAccessToken?: string | null;
      providerRefreshToken?: string | null;
    },
  ): Promise<OAuthAccount> {
    return this.prisma.oAuthAccount.update({
      where: {
        provider_providerUserId: {
          provider,
          providerUserId,
        },
      },
      data,
    });
  }

  async deleteByProviderAndUserId(
    provider: OAuthProvider,
    providerUserId: string,
  ): Promise<OAuthAccount> {
    return this.prisma.oAuthAccount.delete({
      where: {
        provider_providerUserId: {
          provider,
          providerUserId,
        },
      },
    });
  }
}
