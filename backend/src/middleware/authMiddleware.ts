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
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('Token akses tidak ditemukan', 401));
    }
    const token = authHeader.split(' ')[1];

    // Verifikasi token ke Supabase
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      return next(new AppError('Token tidak valid atau kadaluarsa', 401));
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

// ...existing code for authorize (role-based)...
