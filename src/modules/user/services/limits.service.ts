import { Injectable } from '@nestjs/common';
import { Limits, Prisma } from '@prisma/client';

import { LimitsRepository } from '../repositories';

@Injectable()
export class LimitsService {
  constructor(private readonly limitsRepository: LimitsRepository) {}

  async create(data: Prisma.LimitsCreateInput): Promise<Limits> {
    return this.limitsRepository.create(data);
  }

  async findByUserId(userId: string): Promise<Limits | null> {
    return this.limitsRepository.findByUserId(userId);
  }

  async updateByUserId(
    userId: string,
    data: Prisma.LimitsUpdateInput,
  ): Promise<Limits> {
    return this.limitsRepository.updateByUserId(userId, data);
  }
}
