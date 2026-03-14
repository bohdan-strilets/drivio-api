import { Injectable } from '@nestjs/common';
import { Prisma, UserStatus } from '@prisma/client';

import { UserNotFoundException } from '../../../common/error/exceptions';
import { UserRepository } from '../repositories';
import { UserResponse, UserWithCredentials } from '../types';
import { normalizeEmail, toUserResponse } from '../user.utils';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(data: Prisma.UserCreateInput): Promise<UserResponse> {
    const normalizedEmail = normalizeEmail(data.email);
    const user = await this.userRepository.create({
      ...data,
      email: normalizedEmail,
    });

    return toUserResponse(user);
  }

  async findByEmail(email: string): Promise<UserResponse | null> {
    const normalizedEmail = normalizeEmail(email);
    const user = await this.userRepository.findByEmail(normalizedEmail);

    if (!user) return null;
    return toUserResponse(user);
  }

  async findById(id: string): Promise<UserResponse> {
    const user = await this.userRepository.findById(id);

    if (!user) throw new UserNotFoundException();
    return toUserResponse(user);
  }

  async findByEmailWithCredentials(
    email: string,
  ): Promise<UserWithCredentials | null> {
    const normalizedEmail = normalizeEmail(email);
    const user =
      await this.userRepository.findByEmailWithCredentials(normalizedEmail);

    if (!user) return null;
    return user;
  }

  async findByIdWithCredentials(id: string): Promise<UserWithCredentials> {
    const user = await this.userRepository.findByIdWithCredentials(id);
    if (!user) throw new UserNotFoundException();
    return user;
  }

  async updateById(
    id: string,
    data: Prisma.UserUpdateInput,
  ): Promise<UserResponse> {
    try {
      const user = await this.userRepository.updateById(id, data);
      return toUserResponse(user);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new UserNotFoundException();
      }
      throw error;
    }
  }

  async updateStatus(id: string, status: UserStatus): Promise<UserResponse> {
    const user = await this.userRepository.updateStatus(id, status);
    return toUserResponse(user);
  }

  async markEmailVerified(id: string): Promise<UserResponse> {
    const user = await this.userRepository.markEmailVerified(id);
    return toUserResponse(user);
  }

  async updateLoginInfo(id: string): Promise<UserResponse> {
    const user = await this.userRepository.updateLoginInfo(id);
    return toUserResponse(user);
  }

  async deleteById(id: string): Promise<UserResponse> {
    const user = await this.userRepository.deleteById(id);
    return toUserResponse(user);
  }
}
