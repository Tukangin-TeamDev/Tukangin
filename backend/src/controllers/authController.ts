import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../config/prisma';
import { AppError } from '../middleware/errorHandler';
import { Role, Provider } from '@prisma/client';
import { sendOtpEmail } from '../utils/emailService';
import logger from '../utils/logger';

// Helpers
const generateToken = (userId: string, role: string): string => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// Generate partial token (untuk 2FA)
const generatePartialToken = (userId: string, role: string): string => {
  return jwt.sign(
    { id: userId, role, partial: true },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '15m' } // Token sementara hanya berlaku 15 menit
  );
};

// Generate OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTP in database
const storeOTP = async (
  userId: string,
  otp: string,
  type: string,
  expiresInMinutes: number = 10
): Promise<void> => {
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + expiresInMinutes);

  await prisma.otpCode.create({
    data: {
      userId,
      code: otp,
      type,
      expiresAt,
    },
  });
};

/**
 * Register a new user
 */
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, phoneNumber, fullName, role, businessName, address, bio } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phoneNumber }],
      },
    });

    if (existingUser) {
      return next(new AppError('Email atau nomor telepon sudah terdaftar', 400));
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with transaction
    const result = await prisma.$transaction(async prismaClient => {
      // Create user record
      const user = await prismaClient.user.create({
        data: {
          email,
          password: hashedPassword,
          phoneNumber,
          role: role as Role,
          provider: Provider.EMAIL,
          verificationToken: crypto.randomBytes(32).toString('hex'),
        },
      });

      // Create profile based on role
      if (role === 'CUSTOMER') {
        await prismaClient.customer.create({
          data: {
            userId: user.id,
            fullName,
          },
        });
      } else if (role === 'PROVIDER') {
        await prismaClient.provider.create({
          data: {
            userId: user.id,
            fullName,
            businessName: businessName || fullName,
            address,
            bio,
          },
        });
      } else if (role === 'ADMIN') {
        await prismaClient.admin.create({
          data: {
            userId: user.id,
            fullName,
          },
        });
      }

      return user;
    });

    // Generate OTP untuk verifikasi email
    const otp = generateOTP();
    await storeOTP(result.id, otp, 'VERIFY_EMAIL', 30); // OTP berlaku 30 menit

    // Kirim email verifikasi
    await sendOtpEmail(email, otp, 30, 'VERIFY_EMAIL');

    // Generate token untuk akses sementara
    const token = generateToken(result.id, result.role);

    // Return user data (tanpa password) dan token
    return res.status(201).json({
      success: true,
      message: 'Pendaftaran berhasil! Silakan verifikasi email Anda.',
      data: {
        id: result.id,
        email: result.email,
        role: result.role,
        phoneNumber: result.phoneNumber,
        emailVerified: result.emailVerified,
        needVerification: true,
      },
      token,
      redirectTo: `/verify-email?email=${encodeURIComponent(email)}`,
    });
  } catch (error) {
    logger.error('Registration error:', error);
    next(error);
  }
};

/**
 * Verify email with OTP
 */
export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return next(new AppError('Email tidak terdaftar', 404));
    }

    if (user.emailVerified) {
      return next(new AppError('Email sudah terverifikasi', 400));
    }

    // Check OTP validity
    const otpRecord = await prisma.otpCode.findFirst({
      where: {
        userId: user.id,
        code: otp,
        type: 'VERIFY_EMAIL',
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!otpRecord) {
      return next(new AppError('OTP tidak valid atau sudah kadaluarsa', 400));
    }

    // Mark OTP as used
    await prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: { used: true },
    });

    // Update user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verifiedAt: new Date(),
        verificationToken: null,
      },
    });

    // Generate token
    const token = generateToken(user.id, user.role);

    // Determine where to redirect based on role
    let redirectTo = '/dashboard';

    if (user.role === 'PROVIDER') {
      redirectTo = '/provider/dashboard';
    } else if (user.role === 'ADMIN') {
      redirectTo = '/admin/dashboard';
    }

    return res.status(200).json({
      success: true,
      message: 'Email berhasil diverifikasi',
      token,
      redirectTo,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Resend verification email
 */
export const resendVerification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return next(new AppError('Email tidak terdaftar', 404));
    }

    if (user.emailVerified) {
      return next(new AppError('Email sudah terverifikasi', 400));
    }

    // Invalidate any previous OTP
    await prisma.otpCode.updateMany({
      where: {
        userId: user.id,
        type: 'VERIFY_EMAIL',
        used: false,
      },
      data: {
        used: true,
      },
    });

    // Generate new OTP
    const otp = generateOTP();
    await storeOTP(user.id, otp, 'VERIFY_EMAIL', 30);

    // Send verification email
    await sendOtpEmail(email, otp, 30, 'VERIFY_EMAIL');

    return res.status(200).json({
      success: true,
      message: 'Email verifikasi telah dikirim ulang',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 */
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        customer: true,
        provider: true,
        admin: true,
      },
    });

    if (!user || user.provider !== Provider.EMAIL) {
      return next(new AppError('Email atau password salah', 401));
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password as string);

    if (!isPasswordValid) {
      return next(new AppError('Email atau password salah', 401));
    }

    // Check if user is active
    if (!user.isActive) {
      return next(new AppError('Akun Anda dinonaktifkan', 403));
    }

    // Check if email is verified
    if (!user.emailVerified) {
      // Generate OTP untuk verifikasi email
      const otp = generateOTP();
      await storeOTP(user.id, otp, 'VERIFY_EMAIL', 30);

      // Send verification email
      await sendOtpEmail(email, otp, 30, 'VERIFY_EMAIL');

      return res.status(403).json({
        success: false,
        message: 'Email belum diverifikasi. Silakan cek email Anda untuk kode verifikasi.',
        needVerification: true,
        redirectTo: `/verify-email?email=${encodeURIComponent(email)}`,
      });
    }

    // Get profile data
    let profileData = null;
    if (user.role === 'CUSTOMER' && user.customer) {
      profileData = {
        fullName: user.customer.fullName,
        avatarUrl: user.customer.avatarUrl,
      };
    } else if (user.role === 'PROVIDER' && user.provider) {
      profileData = {
        fullName: user.provider.fullName,
        businessName: user.provider.businessName,
        isVerified: user.provider.isVerified,
        avatarUrl: user.provider.avatarUrl,
      };
    } else if (user.role === 'ADMIN' && user.admin) {
      profileData = {
        fullName: user.admin.fullName,
        adminRole: user.admin.role,
      };
    }

    // 2FA Check
    if (user.twoFactorEnabled) {
      // Generate OTP untuk 2FA
      const otp = generateOTP();
      await storeOTP(user.id, otp, '2FA', 10); // 2FA OTP berlaku 10 menit

      // Send 2FA email
      await sendOtpEmail(email, otp, 10, '2FA');

      // Generate partial token
      const partialToken = generatePartialToken(user.id, user.role);

      return res.status(200).json({
        success: true,
        message: 'Kode OTP telah dikirim ke email Anda',
        requireOtp: true,
        partialToken,
        redirectTo: `/verify-otp?email=${encodeURIComponent(email)}`,
      });
    }

    // Generate token
    const token = generateToken(user.id, user.role);

    // Determine where to redirect based on role
    let redirectTo = '/dashboard';

    if (user.role === 'PROVIDER') {
      redirectTo = '/provider/dashboard';
    } else if (user.role === 'ADMIN') {
      redirectTo = '/admin/dashboard';
    }

    return res.status(200).json({
      success: true,
      message: 'Login berhasil',
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        profile: profileData,
      },
      token,
      redirectTo,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify 2FA OTP
 */
export const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp, partialToken } = req.body;

    if (!partialToken) {
      return next(new AppError('Token tidak valid', 400));
    }

    // Verify partial token
    let decoded: any;
    try {
      decoded = jwt.verify(partialToken, process.env.JWT_SECRET || 'secret');
    } catch (error) {
      return next(new AppError('Token tidak valid atau kadaluarsa', 401));
    }

    if (!decoded.partial) {
      return next(new AppError('Token tidak valid', 401));
    }

    // Find user
    const user = await prisma.user.findFirst({
      where: {
        id: decoded.id,
        email,
      },
      include: {
        customer: true,
        provider: true,
        admin: true,
      },
    });

    if (!user) {
      return next(new AppError('User tidak ditemukan', 404));
    }

    // Check OTP validity
    const otpRecord = await prisma.otpCode.findFirst({
      where: {
        userId: user.id,
        code: otp,
        type: '2FA',
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!otpRecord) {
      return next(new AppError('OTP tidak valid atau sudah kadaluarsa', 400));
    }

    // Mark OTP as used
    await prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: { used: true },
    });

    // Get profile data
    let profileData = null;
    if (user.role === 'CUSTOMER' && user.customer) {
      profileData = {
        fullName: user.customer.fullName,
        avatarUrl: user.customer.avatarUrl,
      };
    } else if (user.role === 'PROVIDER' && user.provider) {
      profileData = {
        fullName: user.provider.fullName,
        businessName: user.provider.businessName,
        isVerified: user.provider.isVerified,
        avatarUrl: user.provider.avatarUrl,
      };
    } else if (user.role === 'ADMIN' && user.admin) {
      profileData = {
        fullName: user.admin.fullName,
        adminRole: user.admin.role,
      };
    }

    // Generate full token
    const token = generateToken(user.id, user.role);

    // Determine where to redirect based on role
    let redirectTo = '/dashboard';

    if (user.role === 'PROVIDER') {
      redirectTo = '/provider/dashboard';
    } else if (user.role === 'ADMIN') {
      redirectTo = '/admin/dashboard';
    }

    return res.status(200).json({
      success: true,
      message: 'Verifikasi OTP berhasil',
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        profile: profileData,
      },
      token,
      redirectTo,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle 2FA
 */
export const toggleTwoFactor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return next(new AppError('User tidak ditemukan', 404));
    }

    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: !user.twoFactorEnabled },
    });

    return res.status(200).json({
      success: true,
      message: user.twoFactorEnabled
        ? 'Autentikasi dua faktor dinonaktifkan'
        : 'Autentikasi dua faktor diaktifkan',
      data: {
        twoFactorEnabled: !user.twoFactorEnabled,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Google OAuth Login/Register
 */
export const googleAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, profile } = req.body;

    if (!token || !profile || !profile.email) {
      return next(new AppError('Data Google tidak lengkap', 400));
    }

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email: profile.email },
      include: {
        customer: true,
        provider: true,
        admin: true,
      },
    });

    if (user) {
      // Existing user - update Google ID if needed
      if (user.provider !== Provider.GOOGLE) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            provider: Provider.GOOGLE,
            providerAccountId: profile.sub || profile.id,
            emailVerified: true,
          },
          include: {
            customer: true,
            provider: true,
            admin: true,
          },
        });
      }
    } else {
      // New user - create account
      user = await prisma.$transaction(async prismaClient => {
        // Generate random phone placeholder
        const phoneNumber = `g-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

        // Create user
        const newUser = await prismaClient.user.create({
          data: {
            email: profile.email,
            phoneNumber,
            role: Role.CUSTOMER,
            provider: Provider.GOOGLE,
            providerAccountId: profile.sub || profile.id,
            emailVerified: true,
          },
        });

        // Create customer profile
        await prismaClient.customer.create({
          data: {
            userId: newUser.id,
            fullName: profile.name || 'Google User',
            avatarUrl: profile.picture,
          },
        });

        return prismaClient.user.findUnique({
          where: { id: newUser.id },
          include: {
            customer: true,
            provider: true,
            admin: true,
          },
        });
      });
    }

    if (!user) {
      return next(new AppError('Gagal membuat atau menemukan akun', 500));
    }

    // Get profile data
    let profileData = null;
    if (user.role === 'CUSTOMER' && user.customer) {
      profileData = {
        fullName: user.customer.fullName,
        avatarUrl: user.customer.avatarUrl,
      };
    } else if (user.role === 'PROVIDER' && user.provider) {
      profileData = {
        fullName: user.provider.fullName,
        businessName: user.provider.businessName,
        isVerified: user.provider.isVerified,
        avatarUrl: user.provider.avatarUrl,
      };
    }

    // Generate JWT token
    const jwtToken = generateToken(user.id, user.role);

    // Determine where to redirect
    let redirectTo = '/dashboard';
    if (user.role === 'PROVIDER') {
      redirectTo = '/provider/dashboard';
    }

    return res.status(200).json({
      success: true,
      message: 'Login dengan Google berhasil',
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: profileData,
      },
      token: jwtToken,
      redirectTo,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh JWT token
 */
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;

    if (!token) {
      return next(new AppError('Token tidak ditemukan', 401));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
      id: string;
      role: string;
    };

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || !user.isActive) {
      return next(new AppError('User tidak ditemukan atau tidak aktif', 401));
    }

    // Generate new token
    const newToken = generateToken(user.id, user.role);

    return res.status(200).json({
      success: true,
      token: newToken,
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError('Token tidak valid', 401));
    }
    next(error);
  }
};

/**
 * Logout user
 */
export const logoutUser = (req: Request, res: Response) => {
  // Client-side should remove token
  return res.status(200).json({
    success: true,
    message: 'Logout berhasil',
  });
};

/**
 * Request password reset
 */
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return next(new AppError('Email tidak terdaftar', 404));
    }

    // Generate and store OTP
    const otp = generateOTP();
    await storeOTP(user.id, otp, 'PASSWORD_RESET', 15); // OTP berlaku 15 menit

    // Send reset email
    await sendOtpEmail(email, otp, 15, 'PASSWORD_RESET');

    // Update user with reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setMinutes(resetTokenExpiry.getMinutes() + 15); // Token berlaku 15 menit

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Email reset password telah dikirim',
      resetToken,
      redirectTo: `/reset-password?token=${resetToken}`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify reset password OTP
 */
export const verifyResetOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp, resetToken } = req.body;

    // Find user by email and reset token
    const user = await prisma.user.findFirst({
      where: {
        email,
        resetToken,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return next(new AppError('Token reset tidak valid atau kadaluarsa', 400));
    }

    // Check OTP validity
    const otpRecord = await prisma.otpCode.findFirst({
      where: {
        userId: user.id,
        code: otp,
        type: 'PASSWORD_RESET',
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!otpRecord) {
      return next(new AppError('OTP tidak valid atau sudah kadaluarsa', 400));
    }

    // Mark OTP as used
    await prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: { used: true },
    });

    return res.status(200).json({
      success: true,
      message: 'Verifikasi OTP berhasil',
      resetToken,
      canResetPassword: true,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reset password with token
 */
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { resetToken, password } = req.body;

    // Find user by reset token
    const user = await prisma.user.findFirst({
      where: {
        resetToken,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return next(new AppError('Token reset tidak valid atau kadaluarsa', 400));
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Password berhasil diubah',
      redirectTo: '/login',
    });
  } catch (error) {
    next(error);
  }
};
