import { Injectable } from '@nestjs/common';
import { Limits, Prisma } from '@prisma/client';

import { PrismaService } from '@database';

@Injectable()
export class LimitsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.LimitsCreateInput): Promise<Limits> {
    return this.prisma.limits.create({ data });
  }

  async findByUserId(userId: string): Promise<Limits | null> {
    return this.prisma.limits.findUnique({
      where: { userId },
    });
  }

  async updateByUserId(
    userId: string,
    data: Prisma.LimitsUpdateInput,
  ): Promise<Limits> {
    return this.prisma.limits.update({
      where: { userId },
      data,
    });
  }
}
