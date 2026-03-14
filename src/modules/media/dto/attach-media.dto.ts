import { MediaUsageType } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsUUID, Min } from 'class-validator';

export class AttachMediaDto {
  @IsUUID()
  mediaId!: string;

  @IsEnum(MediaUsageType)
  entityType!: MediaUsageType;

  @IsUUID()
  entityId!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;
}
