import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MediaUsage, MediaUsageType } from '@prisma/client';

import { PrismaService } from '@database';

import { MediaUsageRepository } from '../repositories/media-usage.repository';
import { MediaRepository } from '../repositories/media.repository';

@Injectable()
export class MediaUsageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaUsageRepository: MediaUsageRepository,
    private readonly mediaRepository: MediaRepository,
  ) {}

  async attachMedia(
    entityType: MediaUsageType,
    entityId: string,
    mediaId: string,
    position?: number,
  ): Promise<MediaUsage> {
    const media = await this.mediaRepository.findById(mediaId);
    if (!media) {
      throw new NotFoundException('Media not found');
    }
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.mediaUsage.findMany({
        where: { entityType, entityId },
        orderBy: { position: 'asc' },
      });
      const alreadyAttached = existing.some((u) => u.mediaId === mediaId);
      if (alreadyAttached) {
        throw new ConflictException('Media is already attached to this entity');
      }
      const resolvedPosition = position ?? existing.length;
      return tx.mediaUsage.create({
        data: {
          mediaId,
          entityType,
          entityId,
          position: resolvedPosition,
        },
      });
    });
  }

  async detachMedia(id: string): Promise<void> {
    const usage = await this.mediaUsageRepository.findById(id);
    if (!usage) {
      throw new NotFoundException('Media usage not found');
    }
    await this.mediaUsageRepository.delete(id);
  }

  async getMediaForEntity(
    entityType: MediaUsageType,
    entityId: string,
  ): Promise<Awaited<ReturnType<MediaUsageRepository['findByEntity']>>> {
    return this.mediaUsageRepository.findByEntity(entityType, entityId);
  }
}
