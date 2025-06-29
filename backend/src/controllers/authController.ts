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
 * Login with Google OAuth
 */
export const googleAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.BACKEND_URL}/api/auth/google/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
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

/**
 * Google OAuth callback handler
 */
export const googleCallback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.query;

    if (typeof code !== 'string') {
      return next(new AppError('Invalid authorization code', 400));
    }

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !data.session || !data.user) {
      return next(new AppError(error?.message || 'Failed to exchange code for session', 401));
    }

    // Get user details from the session
    const { user: authUser, session } = data;

    if (!authUser || !authUser.email) {
      return next(new AppError('User information not found in session', 401));
    }

    // Extract user information from auth data
    const email = authUser.email;
    const fullName = authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || '';
    const avatarUrl = authUser.user_metadata?.avatar_url;

    // Check if user already exists in our database
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Create new user if doesn't exist
      user = await prisma.user.create({
        data: {
          id: authUser.id,
          email,
          provider: Provider.GOOGLE,
          providerAccountId: authUser.id,
          emailVerified: true,
          verifiedAt: new Date(),
          isActive: true,
          role: 'CUSTOMER', // Default role for new OAuth users
        },
      });

      // Create customer profile for new user
      await prisma.customer.create({
        data: {
          userId: user.id,
          fullName,
          avatarUrl: avatarUrl,
        },
      });
    } else {
      // Update existing user's login details
      await prisma.user.update({
        where: { id: user.id },
        data: {
          lastLogin: new Date(),
        },
      });

      // If customer profile doesn't exist, create it
      const existingCustomer = await prisma.customer.findUnique({
        where: { userId: user.id },
      });

      if (!existingCustomer) {
        await prisma.customer.create({
          data: {
            userId: user.id,
            fullName,
            avatarUrl: avatarUrl,
          },
        });
      }
    }

    // Set tokens in cookies
    const { access_token, refresh_token } = session;
    res.cookie('accessToken', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie('refreshToken', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // Determine redirect URL based on role
    let redirectUrl = '/dashboard';
    if (user.role === 'PROVIDER') {
      redirectUrl = '/provider/dashboard';
    } else if (user.role === 'ADMIN') {
      redirectUrl = '/admin/dashboard';
    }

    res.redirect(`${process.env.FRONTEND_URL}${redirectUrl}`);
  } catch (error) {
    next(error);
  }
};

/**
 * Login with email and password
 */
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

/**
 * Refresh authentication token
 */
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return next(new AppError('Refresh token diperlukan', 400));
    }

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data.session) {
      return next(new AppError('Gagal memperbarui token', 401));
    }

    res.status(200).json({
      success: true,
      data: {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user
 */
export const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await supabase.auth.signOut();

    // Clear cookies if using them
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.status(200).json({
      success: true,
      message: 'Logout berhasil',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // User should be available from auth middleware
    if (!req.user) {
      return next(new AppError('User not authenticated', 401));
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        customer: true,
        serviceProvider: {
          include: {
            services: true,
          },
        },
        admin: true,
      },
    });

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.customer || user.serviceProvider || user.admin,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Forgot password - sends reset instructions
 */
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL}/reset-password`,
    });

    if (error) {
      return next(new AppError(error.message, 400));
    }

    res.status(200).json({
      success: true,
      message: 'Instruksi reset password telah dikirim ke email Anda',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reset password with new password
 */
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { password } = req.body;

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      return next(new AppError(error.message, 400));
    }

    res.status(200).json({
      success: true,
      message: 'Password berhasil direset',
    });
  } catch (error) {
    next(error);
  }
};

// Placeholder implementations for remaining functions referenced in routes
export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  // Implementation would depend on your email verification flow
  res.status(501).json({ message: 'Not implemented yet' });
};

export const resendVerification = async (req: Request, res: Response, next: NextFunction) => {
  // Implementation would depend on your email verification flow
  res.status(501).json({ message: 'Not implemented yet' });
};

export const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  // Implementation would depend on your OTP verification flow
  res.status(501).json({ message: 'Not implemented yet' });
};

export const toggleTwoFactor = async (req: Request, res: Response, next: NextFunction) => {
  // Implementation would depend on your 2FA configuration
  res.status(501).json({ message: 'Not implemented yet' });
};

export const verifyResetOtp = async (req: Request, res: Response, next: NextFunction) => {
  // Implementation would depend on your OTP reset flow
  res.status(501).json({ message: 'Not implemented yet' });
};
