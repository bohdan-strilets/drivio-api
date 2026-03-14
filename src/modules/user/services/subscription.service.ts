import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Prisma,
  Subscription,
  SubscriptionPlan,
  SubscriptionStatus,
} from '@prisma/client';

import { SubscriptionRepository } from '../repositories';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  async create(data: Prisma.SubscriptionCreateInput): Promise<Subscription> {
    return this.subscriptionRepository.create(data);
  }

  async findByUserId(userId: string): Promise<Subscription | null> {
    return this.subscriptionRepository.findByUserId(userId);
  }

  async updateByUserId(
    userId: string,
    data: Prisma.SubscriptionUpdateInput,
  ): Promise<Subscription> {
    return this.subscriptionRepository.updateByUserId(userId, data);
  }

  async upgradePlan(userId: string): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findByUserId(userId);
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }
    if (subscription.plan === SubscriptionPlan.PRO) {
      return subscription;
    }
    return this.subscriptionRepository.updateByUserId(userId, {
      plan: SubscriptionPlan.PRO,
      status: SubscriptionStatus.ACTIVE,
    });
  }

  async isActive(userId: string): Promise<boolean> {
    const subscription = await this.subscriptionRepository.findByUserId(userId);
    return (
      !!subscription &&
      subscription.status === SubscriptionStatus.ACTIVE &&
      (!subscription.expiresAt || subscription.expiresAt > new Date())
    );
  }
}
