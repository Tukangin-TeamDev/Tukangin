import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { findUserById } from '../services/user.service';
import { ApiResponse } from '../types/common.types';

// Tipe untuk payload JWT
interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

/**
 * Middleware untuk memverifikasi token JWT dan menyediakan data user ke request
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Ambil token dari header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Token tidak ditemukan',
      };

      return res.status(401).json(response);
    }

    const token = authHeader.split(' ')[1];

    // Verifikasi token
    const secret = process.env.JWT_SECRET || 'your-secret-key';

    try {
      const decoded = jwt.verify(token, secret) as JwtPayload;

      // Cari user dari database untuk memastikan masih ada dan valid
      const user = await findUserById(decoded.id);

      if (!user) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'User tidak ditemukan',
        };

        return res.status(401).json(response);
      }

      // Tambahkan data user ke request
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      return next();
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Token kedaluwarsa',
        };

        return res.status(401).json(response);
      }

      if (err instanceof jwt.JsonWebTokenError) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Token tidak valid',
        };

        return res.status(401).json(response);
      }

      throw err;
    }
  } catch (err) {
    console.error('Error authenticating user:', err);

    const response: ApiResponse<null> = {
      success: false,
      error: 'Terjadi kesalahan saat autentikasi',
    };

    return res.status(500).json(response);
  }
};

/**
 * Middleware untuk memverifikasi akses admin
 */
export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Akses ditolak',
        message: 'Hanya admin yang dapat mengakses resource ini',
      };

      return res.status(403).json(response);
    }

    return next();
  } catch (error) {
    console.error('Error checking admin status:', error);

    const response: ApiResponse<null> = {
      success: false,
      error: 'Terjadi kesalahan saat memeriksa izin akses',
    };

    return res.status(500).json(response);
  }
};
