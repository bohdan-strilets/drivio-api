import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UploadSignatureDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  folder?: string;
}
