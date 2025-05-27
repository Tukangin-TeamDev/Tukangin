import prisma from '../utils/prisma';
import { AppError } from '../types';
import { PrismaClient } from '@prisma/client';

// Tipe untuk model yang didukung oleh Prisma
type PrismaModels = {
  [K in keyof PrismaClient]: PrismaClient[K] extends { findUnique: any } ? K : never;
}[keyof PrismaClient];

/**
 * Repository base class yang menyediakan operasi dasar untuk model apapun
 * Ini menggunakan generic untuk fleksibilitas dengan tipe model yang berbeda
 */
export abstract class BaseRepository<T> {
  protected model: any;

  constructor(modelName: PrismaModels) {
    // @ts-ignore: Kita perlu mengabaikan error di sini karena TypeScript tidak mengenali dynamic property access
    this.model = prisma[modelName];
    if (!this.model) {
      throw new Error(`Model ${modelName} tidak ditemukan di Prisma`);
    }
  }

  /**
   * Mencari semua entitas
   */
  async findAll(options: any = {}): Promise<T[]> {
    try {
      return await this.model.findMany(options);
    } catch (error) {
      throw new AppError(`Error mendapatkan ${this.model}: ${error}`, 500);
    }
  }

  /**
   * Mencari entitas berdasarkan ID
   */
  async findById(id: string, options: any = {}): Promise<T | null> {
    try {
      return await this.model.findUnique({
        where: { id },
        ...options,
      });
    } catch (error) {
      throw new AppError(`Error mendapatkan ${this.model} dengan id ${id}: ${error}`, 500);
    }
  }

  /**
   * Mencari entitas tunggal berdasarkan filter
   */
  async findOne(where: any, options: any = {}): Promise<T | null> {
    try {
      return await this.model.findFirst({
        where,
        ...options,
      });
    } catch (error) {
      throw new AppError(`Error mencari ${this.model}: ${error}`, 500);
    }
  }

  /**
   * Membuat entitas baru
   */
  async create(data: any): Promise<T> {
    try {
      return await this.model.create({
        data,
      });
    } catch (error) {
      throw new AppError(`Error membuat ${this.model}: ${error}`, 500);
    }
  }

  /**
   * Mengupdate entitas berdasarkan ID
   */
  async update(id: string, data: any): Promise<T> {
    try {
      return await this.model.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new AppError(`Error mengupdate ${this.model} dengan id ${id}: ${error}`, 500);
    }
  }

  /**
   * Menghapus entitas berdasarkan ID
   */
  async delete(id: string): Promise<T> {
    try {
      return await this.model.delete({
        where: { id },
      });
    } catch (error) {
      throw new AppError(`Error menghapus ${this.model} dengan id ${id}: ${error}`, 500);
    }
  }

  /**
   * Melakukan transaksi database
   * @param operations Fungsi yang akan dijalankan dalam transaksi
   */
  async transaction<R>(operations: (tx: any) => Promise<R>): Promise<R> {
    return prisma.$transaction(operations);
  }
}
