import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Media, MediaType, Prisma } from '@prisma/client';

import { MediaRepository } from '../repositories';
import { MediaUsageRepository } from '../repositories/media-usage.repository';
import type { CloudinaryUrlOptions } from '../types';

import { CloudinaryService } from './cloudinary.service';

@Injectable()
export class MediaService {
  constructor(
    private readonly mediaRepository: MediaRepository,
    private readonly mediaUsageRepository: MediaUsageRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createMedia(
    ownerUserId: string,
    data: {
      type: MediaType;
      mimeType: string;
      originalName: string;
      cloudinaryPublicId: string;
      width?: number;
      height?: number;
      durationSeconds?: number;
      sizeBytes?: number;
      isPublic?: boolean;
    },
  ): Promise<Media> {
    const createData: Prisma.MediaCreateInput = {
      owner: { connect: { id: ownerUserId } },
      type: data.type,
      mimeType: data.mimeType,
      originalName: data.originalName,
      cloudinaryPublicId: data.cloudinaryPublicId,
      width: data.width,
      height: data.height,
      durationSeconds: data.durationSeconds,
      sizeBytes: data.sizeBytes,
      isPublic: data.isPublic ?? false,
    };
    return this.mediaRepository.create(createData);
  }

  async getMedia(id: string): Promise<Media> {
    const media = await this.mediaRepository.findById(id);
    if (!media) {
      throw new NotFoundException('Media not found');
    }
    return media;
  }

  async getMediaUrl(
    id: string,
    options: CloudinaryUrlOptions = {},
  ): Promise<string> {
    const media = await this.getMedia(id);
    return this.cloudinaryService.generateUrl(
      media.cloudinaryPublicId,
      options,
    );
  }

  async deleteMedia(id: string): Promise<void> {
    const media = await this.mediaRepository.findById(id);
    if (!media) {
      throw new NotFoundException('Media not found');
    }
    const usages = await this.mediaUsageRepository.findByMediaId(id);
    if (usages.length > 0) {
      throw new BadRequestException('Media is still used');
    }
    try {
      const resourceType =
        media.type === 'VIDEO'
          ? 'video'
          : media.type === 'DOCUMENT'
            ? 'raw'
            : 'image';
      await this.cloudinaryService.delete(
        media.cloudinaryPublicId,
        resourceType,
      );
    } catch {
      // Log but continue to remove DB record
    }
    await this.mediaRepository.delete(id);
  }
}
