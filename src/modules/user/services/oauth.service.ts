import { Injectable } from '@nestjs/common';
import { OAuthAccount, OAuthProvider, Prisma } from '@prisma/client';

import { OAuthRepository } from '../repositories';

@Injectable()
export class OAuthService {
  constructor(private readonly oauthRepository: OAuthRepository) {}

  async create(data: Prisma.OAuthAccountCreateInput): Promise<OAuthAccount> {
    return this.oauthRepository.create(data);
  }

  async findByProviderAndUserId(
    provider: OAuthProvider,
    providerUserId: string,
  ): Promise<OAuthAccount | null> {
    return this.oauthRepository.findByProviderAndUserId(
      provider,
      providerUserId,
    );
  }

  async findAllByUserId(userId: string): Promise<OAuthAccount[]> {
    return this.oauthRepository.findAllByUserId(userId);
  }

  async updateTokens(
    provider: OAuthProvider,
    providerUserId: string,
    data: {
      providerAccessToken?: string | null;
      providerRefreshToken?: string | null;
    },
  ): Promise<OAuthAccount> {
    return this.oauthRepository.updateTokens(provider, providerUserId, data);
  }

  async deleteByProviderAndUserId(
    provider: OAuthProvider,
    providerUserId: string,
  ): Promise<OAuthAccount> {
    return this.oauthRepository.deleteByProviderAndUserId(
      provider,
      providerUserId,
    );
  }
}
