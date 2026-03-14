import { Injectable } from '@nestjs/common';
import { MediaUsage, MediaUsageType, Prisma } from '@prisma/client';

import { PrismaService } from '@database';

@Injectable()
export class MediaUsageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.MediaUsageCreateInput): Promise<MediaUsage> {
    return this.prisma.mediaUsage.create({ data });
  }

  async findByEntity(
    entityType: MediaUsageType,
    entityId: string,
  ): Promise<MediaUsage[]> {
    return this.prisma.mediaUsage.findMany({
      where: { entityType, entityId },
      orderBy: { position: 'asc' },
    });
  }

  async findByMediaId(mediaId: string): Promise<MediaUsage[]> {
    return this.prisma.mediaUsage.findMany({
      where: { mediaId },
    });
  }

  async delete(id: string): Promise<MediaUsage> {
    return this.prisma.mediaUsage.delete({ where: { id } });
  }

  async findById(id: string): Promise<MediaUsage | null> {
    return this.prisma.mediaUsage.findUnique({
      where: { id },
      include: { media: true },
    });
  }
}
