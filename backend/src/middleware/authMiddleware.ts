import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';
import { AppError } from './errorHandler';
import { Role } from '@prisma/client';

// Extend Request interface to add user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: Role;
        [key: string]: any;
      };
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from headers
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('Token akses tidak ditemukan', 401));
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
      id: string;
      role: string;
      partial?: boolean;
    };

    // Reject partial tokens (only for 2FA)
    if (decoded.partial) {
      return next(new AppError('Otentikasi tidak lengkap', 401));
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        customer: true, 
        provider: true, 
        admin: true
      }
    });

    if (!user) {
      return next(new AppError('Token tidak valid', 401));
    }

    if (!user.isActive) {
      return next(new AppError('Akun dinonaktifkan', 403));
    }

    // Get profile data based on role
    let profileData = {};
    
    if (user.role === 'CUSTOMER' && user.customer) {
      profileData = {
        fullName: user.customer.fullName,
        avatarUrl: user.customer.avatarUrl
      };
    } else if (user.role === 'PROVIDER' && user.provider) {
      profileData = {
        fullName: user.provider.fullName,
        businessName: user.provider.businessName,
        isVerified: user.provider.isVerified,
        avatarUrl: user.provider.avatarUrl
      };
    } else if (user.role === 'ADMIN' && user.admin) {
      profileData = {
        fullName: user.admin.fullName,
        adminRole: user.admin.role
      };
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      twoFactorEnabled: user.twoFactorEnabled,
      emailVerified: user.emailVerified,
      profile: profileData
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError('Token tidak valid atau kadaluarsa', 401));
    }
    next(error);
  }
};

/**
 * Middleware untuk membatasi akses berdasarkan peran
 * @param roles - Array peran yang diizinkan untuk akses
 */
export const authorize = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Silakan login terlebih dahulu', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Anda tidak memiliki akses ke halaman ini', 403));
    }

    next();
  };
}; 