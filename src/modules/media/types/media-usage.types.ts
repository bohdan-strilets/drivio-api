import type { MediaUsageRepository } from '../repositories/media-usage.repository';

export type MediaUsageWithMedia = Awaited<
  ReturnType<MediaUsageRepository['findById']>
>;
