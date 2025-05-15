import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import { ApiResponse } from '../types';

// Tipe User sudah didefinisikan di types/express.d.ts

/**
 * Middleware untuk memeriksa apakah user memiliki peran yang diizinkan
 * @param allowedRoles Array peran yang diizinkan untuk mengakses endpoint
 */
export const checkRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Pastikan user sudah diautentikasi
      if (!req.user) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Tidak terautentikasi',
        };

        return res.status(401).json(response);
      }

      // Periksa apakah peran user termasuk dalam peran yang diizinkan
      if (!allowedRoles.includes(req.user.role)) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Akses ditolak',
          message: 'Anda tidak memiliki izin untuk mengakses resource ini',
        };

        return res.status(403).json(response);
      }

      return next();
    } catch (error) {
      console.error('Error checking role:', error);

      const response: ApiResponse<null> = {
        success: false,
        error: 'Terjadi kesalahan saat memeriksa izin akses',
      };

      return res.status(500).json(response);
    }
  };
};

/**
 * Middleware untuk memeriksa apakah user adalah pemilik resource
 * Digunakan untuk endpoint yang hanya boleh diakses oleh pemilik resource atau admin
 * @param userIdExtractor Fungsi untuk mengekstrak ID pemilik resource dari request
 */
export const checkOwnership = (userIdExtractor: (req: Request) => number | undefined) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Pastikan user sudah diautentikasi
      if (!req.user) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Tidak terautentikasi',
        };

        return res.status(401).json(response);
      }

      // Admin selalu memiliki akses penuh
      if (req.user.role === UserRole.ADMIN) {
        return next();
      }

      // Ekstrak ID pemilik resource
      const resourceOwnerId = userIdExtractor(req);

      // Jika ID tidak ditemukan
      if (!resourceOwnerId) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'ID pemilik resource tidak ditemukan',
        };

        return res.status(400).json(response);
      }

      // Periksa apakah user adalah pemilik resource
      if (req.user.id !== resourceOwnerId) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Akses ditolak',
          message: 'Anda tidak memiliki izin untuk mengakses resource ini',
        };

        return res.status(403).json(response);
      }

      return next();
    } catch (error) {
      console.error('Error checking ownership:', error);

      const response: ApiResponse<null> = {
        success: false,
        error: 'Terjadi kesalahan saat memeriksa kepemilikan resource',
      };

      return res.status(500).json(response);
    }
  };
};
