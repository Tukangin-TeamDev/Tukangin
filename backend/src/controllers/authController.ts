import { supabase } from '../config/supabaseClient';
import { supabaseAdmin } from '../config/supabase';
import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { AppError } from '../utils/errorHandler';
import { Provider } from '@prisma/client';

/**
 * Register user with Supabase Auth
 */
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, phoneNumber, fullName, role } = req.body;

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto confirm for development
      user_metadata: {
        full_name: fullName,
        phone_number: phoneNumber,
        role: role,
      },
    });

    if (authError || !authData.user) {
      return next(new AppError(authError?.message || 'Gagal membuat akun', 400));
    }

    // Create user record in local database
    const user = await prisma.user.create({
      data: {
        id: authData.user.id, // Use Supabase user ID
        email,
        phoneNumber,
        role: role as 'CUSTOMER' | 'PROVIDER' | 'ADMIN',
        emailVerified: true,
        verifiedAt: new Date(),
        isActive: true,
      },
    });

    // Create role-specific record
    if (role === 'CUSTOMER') {
      await prisma.customer.create({
        data: {
          userId: user.id,
          fullName,
        },
      });
    } else if (role === 'PROVIDER') {
      await prisma.serviceProvider.create({
        data: {
          userId: user.id,
          fullName,
        },
      });
    }

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user with Supabase Auth
 */
export const googleLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.BACKEND_URL}/auth/google/callback`,
      },
    });

    if (error) {
      return next(new AppError(error.message, 400));
    }

    res.redirect(data.url);
  } catch (error) {
    next(error);
  }
};

export const googleCallback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.query;

    if (typeof code !== 'string') {
      return next(new AppError('Invalid authorization code', 400));
    }

    const { data: sessionData, error: sessionError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (sessionError || !sessionData.session) {
      return next(
        new AppError(sessionError?.message || 'Failed to exchange code for session', 401)
      );
    }

    const { user: authUser } = sessionData;

    if (!authUser || !authUser.email) {
      return next(new AppError('User information not found in session', 401));
    }

    // Upsert user in the local database
    const user = await prisma.user.upsert({
      where: {
        provider_providerAccountId: {
          provider: Provider.GOOGLE,
          providerAccountId: authUser.id,
        },
      },
      update: {
        email: authUser.email,
        lastLogin: new Date(),
      },
      create: {
        id: authUser.id,
        email: authUser.email,
        provider: Provider.GOOGLE,
        providerAccountId: authUser.id,
        emailVerified: true,
        verifiedAt: new Date(),
        isActive: true,
        role: 'CUSTOMER', // Default role for new OAuth users
      },
    });

    // If the user was just created, create a customer profile
    const existingCustomer = await prisma.customer.findUnique({ where: { userId: user.id } });
    if (!existingCustomer) {
      const fullName = authUser.user_metadata.full_name || authUser.email.split('@')[0];
      await prisma.customer.create({
        data: {
          userId: user.id,
          fullName: fullName,
        },
      });
    }

    // Set cookie and redirect
    const { access_token, refresh_token } = sessionData.session;
    res.cookie('accessToken', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    res.cookie('refreshToken', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      return next(new AppError('Email atau password salah', 401));
    }

    // Get user data from local database
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

    // Determine redirect URL based on role
    let redirectTo = '/dashboard';
    if (user.role === 'PROVIDER') {
      redirectTo = '/provider/dashboard';
    } else if (user.role === 'ADMIN') {
      redirectTo = '/admin/dashboard';
    }

    res.status(200).json({
      success: true,
      message: 'Login berhasil',
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.customer || user.serviceProvider || user.admin,
      },
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      redirectTo,
    });
  } catch (error) {
    next(error);
  }
};
