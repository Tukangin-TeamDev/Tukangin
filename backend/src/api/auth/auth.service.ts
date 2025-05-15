import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { AuthProvider, CreateUserDto, UserResponseDto } from '../../types/user.types';
import { UserRole } from '@prisma/client';
import { AppError } from '../../middleware/error.middleware';
import { logger } from '../../utils/logger';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient();

// JWT config
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

/**
 * Mendaftarkan user baru
 */
export const registerUser = async (userData: CreateUserDto) => {
  try {
    logger.info(`Registering new user with email: ${userData.email}`);

    // Cek email sudah digunakan
    const existingUser = await prismaClient.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new AppError('Email sudah terdaftar', 409);
    }

    // Prepare data
    let userCreateData: any = {
      email: userData.email,
      name: userData.name,
      role: userData.role || UserRole.CUSTOMER,
      phone: userData.phone,
      authProvider: userData.authProvider || AuthProvider.LOCAL,
    };

    // Hash password jika authProvider adalah LOCAL
    if (userCreateData.authProvider === AuthProvider.LOCAL) {
      if (!userData.password) {
        throw new AppError('Password diperlukan untuk registrasi lokal', 400);
      }

      const salt = await bcrypt.genSalt(10);
      userCreateData.password = await bcrypt.hash(userData.password, salt);
    }

    // Simpan user ke database
    const user = await prismaClient.user.create({
      data: userCreateData,
    });

    // Jika role adalah PROVIDER, buat juga provider profile
    if (user.role === UserRole.PROVIDER) {
      await prismaClient.providerProfile.create({
        data: {
          userId: user.id,
          about: '',
          verified: false,
        },
      });
    }

    // Generate token JWT
    const token = generateAccessToken(user.id, user.email, user.role);
    const refreshToken = generateRefreshToken(user.id, user.email);

    // Hapus password sebelum mengembalikan response
    const { password, ...userWithoutPassword } = user;

    logger.info(`User registered: ${user.email}`);

    return {
      user: userWithoutPassword as UserResponseDto,
      token,
      refreshToken,
    };
  } catch (error) {
    logger.error('Registration error:', error);
    throw error;
  }
};

/**
 * Mendaftarkan user dengan Google
 */
export const registerWithGoogle = async (googleData: {
  email: string;
  name: string;
  googleId: string;
}) => {
  try {
    logger.info(`Registering/logging in user with Google, email: ${googleData.email}`);

    // Cek jika user dengan email ini sudah ada
    let user = await prismaClient.user.findUnique({
      where: { email: googleData.email },
    });

    if (user) {
      // User sudah ada, update googleId jika perlu
      if (!user.googleId) {
        user = await prismaClient.user.update({
          where: { id: user.id },
          data: {
            googleId: googleData.googleId,
            authProvider: AuthProvider.GOOGLE,
          },
        });
        logger.info(`Updated existing user with Google ID: ${googleData.email}`);
      }
    } else {
      // Buat user baru
      user = await prismaClient.user.create({
        data: {
          email: googleData.email,
          name: googleData.name,
          googleId: googleData.googleId,
          authProvider: AuthProvider.GOOGLE,
          role: UserRole.CUSTOMER, // Default role untuk Google user
        },
      });
      logger.info(`New user registered with Google: ${googleData.email}`);
    }

    // Generate token JWT
    const token = generateAccessToken(user.id, user.email, user.role);
    const refreshToken = generateRefreshToken(user.id, user.email);

    // Hapus password sebelum mengembalikan response
    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword as UserResponseDto,
      token,
      refreshToken,
    };
  } catch (error) {
    logger.error('Google registration error:', error);
    throw error;
  }
};

/**
 * Login user
 */
export const loginUser = async (email: string, password: string) => {
  try {
    // Cari user berdasarkan email
    const user = await prismaClient.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError('Email atau password salah', 401);
    }

    // Cek jika user menggunakan Google auth
    if (user.authProvider === AuthProvider.GOOGLE) {
      throw new AppError(
        'Akun ini menggunakan login dengan Google. Silakan login dengan Google.',
        400
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password as string);

    if (!isPasswordValid) {
      throw new AppError('Email atau password salah', 401);
    }

    // Generate token JWT
    const token = generateAccessToken(user.id, user.email, user.role);
    const refreshToken = generateRefreshToken(user.id, user.email);

    // Periksa apakah user perlu 2FA
    const needsTwoFactor = user.twoFactorEnabled;

    // Hapus password sebelum mengembalikan response
    const { password: _, ...userWithoutPassword } = user;

    logger.info(`User logged in: ${user.email}`);

    return {
      user: userWithoutPassword as UserResponseDto,
      token,
      refreshToken,
      needsTwoFactor,
    };
  } catch (error) {
    logger.error('Login error:', error);
    throw error;
  }
};

/**
 * Login dengan Google
 */
export const loginWithGoogle = async (googleId: string, email: string) => {
  try {
    // Cari user berdasarkan googleId atau email
    const user = await prismaClient.user.findFirst({
      where: {
        OR: [{ googleId }, { email, authProvider: AuthProvider.GOOGLE }],
      },
    });

    if (!user) {
      throw new AppError('Akun Google tidak ditemukan. Silakan register terlebih dahulu.', 401);
    }

    // Generate token JWT
    const token = generateAccessToken(user.id, user.email, user.role);
    const refreshToken = generateRefreshToken(user.id, user.email);

    // Hapus password sebelum mengembalikan response
    const { password, ...userWithoutPassword } = user;

    logger.info(`User logged in with Google: ${user.email}`);

    return {
      user: userWithoutPassword as UserResponseDto,
      token,
      refreshToken,
    };
  } catch (error) {
    logger.error('Google login error:', error);
    throw error;
  }
};

/**
 * Refresh access token
 */
export const refreshAccessToken = async (refreshToken: string) => {
  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { id: number; email: string };

    // Cari user berdasarkan id
    const user = await prismaClient.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new AppError('User tidak ditemukan', 401);
    }

    // Generate token JWT baru
    const newToken = generateAccessToken(user.id, user.email, user.role);
    const newRefreshToken = generateRefreshToken(user.id, user.email);

    // Hapus password sebelum mengembalikan response
    const { password, ...userWithoutPassword } = user;

    logger.info(`Token refreshed for user: ${user.email}`);

    return {
      user: userWithoutPassword as UserResponseDto,
      token: newToken,
      refreshToken: newRefreshToken,
    };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError('Refresh token kedaluwarsa, silakan login ulang', 401);
    }

    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError('Refresh token tidak valid', 401);
    }

    logger.error('Refresh token error:', error);
    throw error;
  }
};

/**
 * Generate access token
 */
export const generateAccessToken = (
  userId: number,
  email: string,
  role: UserRole | string
): string => {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  };
  return jwt.sign({ id: userId, email, role }, JWT_SECRET, options);
};

/**
 * Generate refresh token
 */
export const generateRefreshToken = (userId: number, email: string): string => {
  const options: SignOptions = {
    expiresIn: JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  };
  return jwt.sign({ id: userId, email }, JWT_REFRESH_SECRET, options);
};

/**
 * Generate OTP secret dan QR code
 */
export const generateOTPSecret = async (email: string) => {
  // Generate OTP secret
  const otpSecret = authenticator.generateSecret();

  // Generate QR code
  const serviceName = process.env.APP_NAME || 'TUKANGIN';
  const otpauth = authenticator.keyuri(email, serviceName, otpSecret);
  const qrCodeUrl = await toDataURL(otpauth);

  return { otpSecret, qrCodeUrl };
};

/**
 * Simpan OTP secret ke database
 */
export const saveOTPSecret = async (userId: number, otpSecret: string) => {
  await prismaClient.user.update({
    where: { id: userId },
    data: {
      otpSecret,
      // twoFactorEnabled tetap false sampai verifikasi
    },
  });

  logger.info(`OTP secret saved for user ID: ${userId}`);
};

/**
 * Verifikasi OTP
 */
export const verifyOTP = async (userId: number, token: string) => {
  // Ambil OTP secret dari database
  const user = await prismaClient.user.findUnique({
    where: { id: userId },
    select: { otpSecret: true },
  });

  if (!user || !user.otpSecret) {
    throw new AppError('OTP secret tidak ditemukan', 400);
  }

  // Verify token
  return authenticator.verify({
    token,
    secret: user.otpSecret,
  });
};

/**
 * Aktifkan 2FA untuk user
 */
export const enable2FAForUser = async (userId: number) => {
  await prismaClient.user.update({
    where: { id: userId },
    data: { twoFactorEnabled: true },
  });

  logger.info(`2FA enabled for user ID: ${userId}`);
};

/**
 * Nonaktifkan 2FA untuk user
 */
export const disable2FAForUser = async (userId: number) => {
  await prismaClient.user.update({
    where: { id: userId },
    data: {
      twoFactorEnabled: false,
      otpSecret: null,
    },
  });

  logger.info(`2FA disabled for user ID: ${userId}`);
};

/**
 * Verifikasi password user
 */
export const verifyPassword = async (userId: number, password: string) => {
  // Ambil user dari database
  const user = await prismaClient.user.findUnique({
    where: { id: userId },
    select: { password: true },
  });

  if (!user || !user.password) {
    throw new AppError('User tidak ditemukan', 404);
  }

  // Verify password
  return bcrypt.compare(password, user.password);
};
