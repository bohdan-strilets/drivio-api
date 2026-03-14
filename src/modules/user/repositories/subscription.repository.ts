import { Injectable } from '@nestjs/common';
import { Prisma, Subscription } from '@prisma/client';

import { PrismaService } from '@database';

@Injectable()
export class SubscriptionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.SubscriptionCreateInput): Promise<Subscription> {
    return this.prisma.subscription.create({ data });
  }

  async findByUserId(userId: string): Promise<Subscription | null> {
    return this.prisma.subscription.findUnique({
      where: { userId },
    });
  }

  async updateByUserId(
    userId: string,
    data: Prisma.SubscriptionUpdateInput,
  ): Promise<Subscription> {
    return this.prisma.subscription.update({
      where: { userId },
      data,
    });
  }
}
