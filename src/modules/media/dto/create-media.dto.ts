import { MediaType } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateMediaDto {
  @IsUUID()
  ownerUserId!: string;

  @IsEnum(MediaType)
  type!: MediaType;

  @IsString()
  mimeType!: string;

  @IsString()
  originalName!: string;

  @IsString()
  cloudinaryPublicId!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  width?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  height?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  durationSeconds?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  sizeBytes?: number;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
