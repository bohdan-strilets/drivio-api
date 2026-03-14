import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { Media, MediaUsage, MediaUsageType } from '@prisma/client';

import { AttachMediaDto } from '../dto/attach-media.dto';
import { CreateMediaDto } from '../dto/create-media.dto';
import { UploadSignatureDto } from '../dto/upload-signature.dto';
import { MediaUploadService } from '../services/media-upload.service';
import { MediaUsageService } from '../services/media-usage.service';
import { MediaService } from '../services/media.service';
import type { UploadSignatureResult } from '../types';

@Controller('media')
export class MediaController {
  constructor(
    private readonly mediaUploadService: MediaUploadService,
    private readonly mediaService: MediaService,
    private readonly mediaUsageService: MediaUsageService,
  ) {}

  @Post('upload-signature')
  async createUploadSignature(
    @Body() dto: UploadSignatureDto,
  ): Promise<UploadSignatureResult> {
    return this.mediaUploadService.createUploadSignature(dto.folder);
  }

  @Post()
  async completeUpload(@Body() dto: CreateMediaDto): Promise<Media> {
    return this.mediaUploadService.completeUpload(dto.ownerUserId, {
      type: dto.type,
      mimeType: dto.mimeType,
      originalName: dto.originalName,
      cloudinaryPublicId: dto.cloudinaryPublicId,
      width: dto.width,
      height: dto.height,
      durationSeconds: dto.durationSeconds,
      sizeBytes: dto.sizeBytes,
      isPublic: dto.isPublic,
    });
  }

  @Post('attach')
  async attachMedia(@Body() dto: AttachMediaDto): Promise<MediaUsage> {
    return this.mediaUsageService.attachMedia(
      dto.entityType,
      dto.entityId,
      dto.mediaId,
      dto.position,
    );
  }

  @Get('entity/:type/:id')
  async getMediaForEntity(
    @Param('type', new ParseEnumPipe(MediaUsageType)) type: MediaUsageType,
    @Param('id', ParseUUIDPipe) entityId: string,
  ): Promise<MediaUsage[]> {
    return this.mediaUsageService.getMediaForEntity(type, entityId);
  }

  @Get(':id')
  async getMedia(@Param('id') id: string): Promise<Media> {
    return this.mediaService.getMedia(id);
  }

  @Delete(':id')
  async deleteMedia(@Param('id') id: string): Promise<void> {
    await this.mediaService.deleteMedia(id);
  }
}
