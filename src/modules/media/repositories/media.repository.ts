import { Injectable } from '@nestjs/common';
import { Media, Prisma } from '@prisma/client';

import { PrismaService } from '@database';

@Injectable()
export class MediaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.MediaCreateInput): Promise<Media> {
    return this.prisma.media.create({ data });
  }

  async findById(id: string): Promise<Media | null> {
    return this.prisma.media.findUnique({ where: { id } });
  }

  async delete(id: string): Promise<Media> {
    return this.prisma.media.delete({ where: { id } });
  }
}
