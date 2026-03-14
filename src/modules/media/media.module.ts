import { Module } from '@nestjs/common';

import { ConfigModule } from '@config';

import { MediaController } from './controllers/media.controller';
import { MediaUsageRepository } from './repositories/media-usage.repository';
import { MediaRepository } from './repositories/media.repository';
import { CloudinaryService } from './services/cloudinary.service';
import { MediaUploadService } from './services/media-upload.service';
import { MediaUsageService } from './services/media-usage.service';
import { MediaService } from './services/media.service';

@Module({
  imports: [ConfigModule],
  controllers: [MediaController],
  providers: [
    CloudinaryService,
    MediaRepository,
    MediaUsageRepository,
    MediaService,
    MediaUsageService,
    MediaUploadService,
  ],
  exports: [
    MediaService,
    MediaUsageService,
    MediaUploadService,
    CloudinaryService,
  ],
})
export class MediaModule {}
