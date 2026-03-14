export interface CloudinaryUploadOptions {
  folder?: string;
  resourceType?: 'image' | 'video' | 'raw' | 'auto';
  publicId?: string;
}

export interface CloudinaryUrlOptions {
  secure?: boolean;
  resourceType?: 'image' | 'video' | 'raw' | 'auto';
  transformation?: Array<Record<string, unknown>>;
  width?: number;
  height?: number;
  crop?: string;
  format?: string;
}
