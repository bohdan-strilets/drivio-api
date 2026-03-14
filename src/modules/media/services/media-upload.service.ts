import { Injectable } from '@nestjs/common';
import { Media, MediaType } from '@prisma/client';

import { EnvService } from '@config';

import type { UploadSignatureResult } from '../types/media-upload.types';

import { CloudinaryService } from './cloudinary.service';
import { MediaService } from './media.service';

@Injectable()
export class MediaUploadService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly mediaService: MediaService,
    private readonly envService: EnvService,
  ) {}

  createUploadSignature(folder?: string): UploadSignatureResult {
    const apiKey = this.envService.cloudinaryApiKey;
    const cloudName = this.envService.cloudinaryCloudName;
    if (!apiKey || !cloudName) {
      throw new Error('Cloudinary is not configured');
    }
    const params: Record<string, string> = {};
    if (folder) params.folder = folder;
    const { signature, timestamp } =
      this.cloudinaryService.createUploadSignature(params);
    return {
      signature,
      timestamp,
      apiKey,
      cloudName,
      ...(folder && { folder }),
    };
  }

  async completeUpload(
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
    return this.mediaService.createMedia(ownerUserId, data);
  }
}
