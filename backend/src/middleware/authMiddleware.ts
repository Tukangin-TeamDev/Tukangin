import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import prisma from '../config/prisma';
import { AppError } from '../utils/errorHandler';

// Tambahkan tipe user untuk Express Request
type AppUser = {
  id: string;
  email: string;
  role: string;
  profile?: any;
};

// Extend Express Request agar mengenal req.user
declare module 'express-serve-static-core' {
  interface Request {
    user?: AppUser;
  }
}

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check for token in Authorization header
    let token: string | undefined;
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } 
    // Check for token in cookies as fallback
    else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return next(new AppError('Token akses tidak ditemukan', 401));
    }

    // Verifikasi token ke Supabase
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      // Try to refresh token if available
      if (req.cookies && req.cookies.refreshToken) {
        try {
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession({
            refresh_token: req.cookies.refreshToken,
          });
          
          if (refreshError || !refreshData.session || !refreshData.user) {
            return next(new AppError('Session expired. Please login again', 401));
          }
          
          // Set new cookies
          res.cookie('accessToken', refreshData.session.access_token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          });
          
          res.cookie('refreshToken', refreshData.session.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
          });
          
          // Use the new user data
          data.user = refreshData.user;
        } catch (refreshError) {
          return next(new AppError('Failed to refresh session', 401));
        }
      } else {
        return next(new AppError('Token tidak valid atau kadaluarsa', 401));
      }
    }

    // At this point data.user should be defined, but let's add a guard just in case
    if (!data.user) {
      return next(new AppError('User data not found', 401));
    }

    // Ambil user dari database lokal
    const user = await prisma.user.findUnique({
      where: { id: data.user.id },
      include: {
        customer: true,
        serviceProvider: true,
        admin: true,
      },
    });

    if (!user || !user.isActive) {
      return next(new AppError('Akun tidak ditemukan atau tidak aktif', 401));
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      profile: user.customer || user.serviceProvider || user.admin || {},
    };

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Role-based authorization middleware
 * @param allowedRoles Array of roles allowed to access the route
 */
export const authorize = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('You are not authorized to access this resource', 403));
    }
    
    next();
  };
};
