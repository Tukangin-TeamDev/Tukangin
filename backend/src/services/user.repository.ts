import { User, Prisma } from '@prisma/client';
import { BaseRepository } from './repository.base';
import prisma from '../utils/prisma';
import { AppError } from '../types';

/**
 * Repository untuk model User
 */
export class UserRepository extends BaseRepository<User> {
  constructor() {
    super('user');
  }

  /**
   * Mencari user berdasarkan email
   */
  async findByEmail(email: string): Promise<User | null> {
    try {
      return await prisma.user.findUnique({
        where: { email },
      });
    } catch (error) {
      throw this.handleError('Error mencari user berdasarkan email', error);
    }
  }

  /**
   * Mengambil user dengan profil
   */
  async findByIdWithProfile(id: string): Promise<(User & { profile: any }) | null> {
    try {
      return await prisma.user.findUnique({
        where: { id },
        include: {
          profile: true,
        },
      });
    } catch (error) {
      throw this.handleError('Error mencari user dengan profil', error);
    }
  }

  /**
   * Membuat user baru beserta profil dalam satu transaksi
   */
  async createWithProfile(
    userData: Prisma.UserCreateInput,
    profileData: Prisma.UserProfileCreateWithoutUserInput
  ): Promise<User> {
    try {
      return await prisma.$transaction(async tx => {
        const user = await tx.user.create({
          data: {
            ...userData,
            profile: {
              create: profileData,
            },
          },
        });
        return user;
      });
    } catch (error) {
      throw this.handleError('Error membuat user dengan profil', error);
    }
  }

  /**
   * Handle error untuk repository
   */
  private handleError(message: string, error: any): AppError {
    console.error(`${message}: `, error);
    return new AppError(`${message}: ${error.message}`, 500);
  }
}
