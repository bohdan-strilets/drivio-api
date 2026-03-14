import * as crypto from 'crypto';

import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

import { EnvService } from '@config';

import type {
  CloudinaryUploadOptions,
  CloudinaryUrlOptions,
} from '../types/cloudinary.types';

@Injectable()
export class CloudinaryService {
  constructor(private readonly envService: EnvService) {
    const cloudName = this.envService.cloudinaryCloudName;
    const apiKey = this.envService.cloudinaryApiKey;
    const apiSecret = this.envService.cloudinaryApiSecret;
    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });
    }
  }

  async upload(
    buffer: Buffer,
    options: CloudinaryUploadOptions = {},
  ): Promise<{
    publicId: string;
    url: string;
    width?: number;
    height?: number;
  }> {
    return new Promise((resolve, reject) => {
      const uploadOptions = {
        folder: options.folder,
        resource_type: options.resourceType ?? 'auto',
        public_id: options.publicId,
      };
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }
          if (!result?.public_id) {
            reject(new Error('Upload failed: no public_id returned'));
            return;
          }
          resolve({
            publicId: result.public_id,
            url: result.secure_url ?? '',
            width: result.width,
            height: result.height,
          });
        },
      );
      uploadStream.end(buffer);
    });
  }

  async delete(
    publicId: string,
    resourceType: 'image' | 'video' | 'raw' = 'image',
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      void cloudinary.uploader.destroy(
        publicId,
        { resource_type: resourceType },
        (error) => {
          if (error) reject(error);
          else resolve();
        },
      );
    });
  }

  generateUrl(publicId: string, options: CloudinaryUrlOptions = {}): string {
    const urlOptions: Record<string, unknown> = {
      secure: options.secure ?? true,
      resource_type: options.resourceType ?? 'image',
    };
    if (options.width != null) urlOptions.width = options.width;
    if (options.height != null) urlOptions.height = options.height;
    if (options.crop) urlOptions.crop = options.crop;
    if (options.format) urlOptions.format = options.format;
    if (options.transformation?.length)
      urlOptions.transformation = options.transformation;
    return cloudinary.url(publicId, urlOptions);
  }

  createUploadSignature(params: Record<string, string>): {
    signature: string;
    timestamp: number;
  } {
    const apiSecret = this.envService.cloudinaryApiSecret;
    if (!apiSecret) {
      throw new Error('Cloudinary API secret is not configured');
    }
    const timestamp = Math.round(Date.now() / 1000);
    const paramsWithTimestamp = { ...params, timestamp: String(timestamp) };
    const sortedKeys = Object.keys(paramsWithTimestamp).sort();
    const paramStr = sortedKeys
      .map((key) => `${key}=${paramsWithTimestamp[key]}`)
      .join('&');
    const signature = crypto
      .createHash('sha1')
      .update(paramStr + apiSecret)
      .digest('hex');
    return { signature, timestamp };
  }
}
