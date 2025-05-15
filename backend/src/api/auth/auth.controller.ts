import { Request, Response, NextFunction } from 'express';
import { createAdminAuditLog } from '../../middleware/audit.middleware';
import { AppError } from '../../middleware/error.middleware';
import { ApiResponse } from '../../types/common.types';
import { UserResponseDto } from '../../types/user.types';
import * as authService from './auth.service';
import { ZodError } from 'zod';

/**
 * @desc    Register user baru
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData = req.body;

    // Register user baru
    const { user, token, refreshToken } = await authService.registerUser(userData);

    // Set refresh token sebagai httpOnly cookie
    const refreshTokenExpiry =
      parseInt(process.env.JWT_REFRESH_EXPIRES_IN || '7') * 24 * 60 * 60 * 1000; // dalam ms
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(Date.now() + refreshTokenExpiry),
      sameSite: 'strict',
      path: '/',
    });

    // Log aktivitas
    await createAdminAuditLog('USER_REGISTERED', { email: user.email }, user.id);

    // Response
    const response: ApiResponse<{ user: UserResponseDto; token: string }> = {
      success: true,
      data: {
        user,
        token,
      },
      message: 'Registrasi berhasil',
    };

    return res.status(201).json(response);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validasi data gagal',
        message: error.errors[0].message,
      });
    }

    return next(error);
  }
};

/**
 * @desc    Register or login with Google
 * @route   POST /api/auth/google
 * @access  Public
 */
export const googleAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { googleId, email, name } = req.body;

    if (!googleId || !email || !name) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Data Google tidak lengkap',
      };
      return res.status(400).json(response);
    }

    // Mencoba login terlebih dahulu
    try {
      const result = await authService.loginWithGoogle(googleId, email);

      const response: ApiResponse<typeof result> = {
        success: true,
        data: result,
        message: 'Login dengan Google berhasil',
      };

      return res.status(200).json(response);
    } catch (error) {
      // Jika login gagal (user belum ada), daftarkan user baru
      const result = await authService.registerWithGoogle({ googleId, email, name });

      const response: ApiResponse<typeof result> = {
        success: true,
        data: result,
        message: 'Registrasi dengan Google berhasil',
      };

      return res.status(201).json(response);
    }
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    Google OAuth Callback
 * @route   GET /api/auth/google/callback
 * @access  Public
 */
export const googleCallback = async (req: Request, res: Response) => {
  try {
    // Google OAuth callback akan menerima data user dari passport middleware
    const googleUser = req.user as any;

    if (!googleUser || !googleUser.id || !googleUser.emails || !googleUser.displayName) {
      throw new AppError('Autentikasi Google gagal', 401);
    }

    const googleId = googleUser.id;
    const email = googleUser.emails[0].value;
    const name = googleUser.displayName;

    try {
      // Mencoba login terlebih dahulu
      const result = await authService.loginWithGoogle(googleId, email);

      // Set refresh token sebagai httpOnly cookie
      const refreshTokenExpiry =
        parseInt(process.env.JWT_REFRESH_EXPIRES_IN || '7') * 24 * 60 * 60 * 1000;
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(Date.now() + refreshTokenExpiry),
        sameSite: 'strict',
        path: '/',
      });

      // Log aktivitas
      await createAdminAuditLog('USER_LOGIN_GOOGLE', { email }, result.user.id);

      // Redirect ke halaman sukses di frontend dengan token
      return res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${result.token}`);
    } catch (error) {
      // Jika login gagal, coba registrasi user baru
      const result = await authService.registerWithGoogle({ googleId, email, name });

      // Set refresh token sebagai httpOnly cookie
      const refreshTokenExpiry =
        parseInt(process.env.JWT_REFRESH_EXPIRES_IN || '7') * 24 * 60 * 60 * 1000;
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(Date.now() + refreshTokenExpiry),
        sameSite: 'strict',
        path: '/',
      });

      // Log aktivitas
      await createAdminAuditLog('USER_REGISTERED_GOOGLE', { email }, result.user.id);

      // Redirect ke halaman sukses di frontend dengan token
      return res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${result.token}`);
    }
  } catch (error) {
    // Redirect ke halaman error di frontend
    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/error?message=${encodeURIComponent('Autentikasi Google gagal')}`
    );
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Login user
    const { user, token, refreshToken, needsTwoFactor } = await authService.loginUser(
      email,
      password
    );

    // Set refresh token sebagai httpOnly cookie
    const refreshTokenExpiry =
      parseInt(process.env.JWT_REFRESH_EXPIRES_IN || '7') * 24 * 60 * 60 * 1000; // dalam ms
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(Date.now() + refreshTokenExpiry),
      sameSite: 'strict',
      path: '/',
    });

    // Log aktivitas
    await createAdminAuditLog('USER_LOGIN', { email }, user.id);

    // Response
    const response: ApiResponse<{ user: UserResponseDto; token: string; needsTwoFactor: boolean }> =
      {
        success: true,
        data: {
          user,
          token,
          needsTwoFactor,
        },
        message: needsTwoFactor ? 'Silakan verifikasi 2FA' : 'Login berhasil',
      };

    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        error: error.message,
      });
    }

    return next(error);
  }
};

/**
 * @desc    Refresh token
 * @route   POST /api/auth/refresh
 * @access  Public (with refresh token)
 */
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get refresh token from cookie
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      throw new AppError('Refresh token diperlukan', 401);
    }

    // Refresh token
    const {
      user,
      token,
      refreshToken: newRefreshToken,
    } = await authService.refreshAccessToken(refreshToken);

    // Set refresh token baru sebagai httpOnly cookie
    const refreshTokenExpiry =
      parseInt(process.env.JWT_REFRESH_EXPIRES_IN || '7') * 24 * 60 * 60 * 1000;
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(Date.now() + refreshTokenExpiry),
      sameSite: 'strict',
      path: '/',
    });

    // Response
    const response: ApiResponse<{ user: UserResponseDto; token: string }> = {
      success: true,
      data: {
        user,
        token,
      },
      message: 'Token diperbarui',
    };

    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        error: error.message,
      });
    }

    return next(error);
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Clear refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    // Log aktivitas jika user terautentikasi
    if (req.user) {
      await createAdminAuditLog('USER_LOGOUT', {}, req.user.id);
    }

    // Response
    const response: ApiResponse<null> = {
      success: true,
      message: 'Logout berhasil',
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Enable 2FA for user
 * @route   POST /api/auth/2fa/enable
 * @access  Private
 */
export const enable2FA = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Tidak terautentikasi', 401);
    }

    // Generate OTP secret dan QR code
    const { otpSecret, qrCodeUrl } = await authService.generateOTPSecret(req.user.email);
    // Simpan OTP secret ke database (tidak diaktifkan sampai verifikasi)
    await authService.saveOTPSecret(req.user.id, otpSecret);

    // Log aktivitas
    await createAdminAuditLog('2FA_SETUP_INITIATED', {}, req.user.id);
    // Response
    const response: ApiResponse<{ qrCodeUrl: string }> = {
      success: true,
      data: {
        qrCodeUrl,
      },
      message:
        'Silakan pindai QR code dengan aplikasi autentikator, lalu verifikasi dengan kode yang muncul',
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify 2FA code
 * @route   POST /api/auth/2fa/verify
 * @access  Private
 */
export const verify2FA = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Tidak terautentikasi', 401);
    }

    const { code } = req.body;

    if (!code) {
      throw new AppError('Kode 2FA diperlukan', 400);
    }

    // Verifikasi kode OTP
    const isValid = await authService.verifyOTP(req.user.id, code);

    if (!isValid) {
      throw new AppError('Kode 2FA tidak valid', 400);
    }

    // Aktifkan 2FA untuk user
    await authService.enable2FAForUser(req.user.id);

    // Log aktivitas
    await createAdminAuditLog('2FA_ENABLED', {}, req.user.id);

    // Response
    const response: ApiResponse<null> = {
      success: true,
      message: '2FA berhasil diaktifkan',
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Disable 2FA for user
 * @route   POST /api/auth/2fa/disable
 * @access  Private
 */
export const disable2FA = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Tidak terautentikasi', 401);
    }

    // Verify the user's password for security
    const { password } = req.body;

    if (!password) {
      throw new AppError('Password diperlukan', 400);
    }

    // Verify password
    const isPasswordValid = await authService.verifyPassword(req.user.id, password);

    if (!isPasswordValid) {
      throw new AppError('Password tidak valid', 400);
    }

    // Disable 2FA
    await authService.disable2FAForUser(req.user.id);

    // Log aktivitas
    await createAdminAuditLog('2FA_DISABLED', {}, req.user.id);

    // Response
    const response: ApiResponse<null> = {
      success: true,
      message: '2FA berhasil dinonaktifkan',
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Setup 2FA untuk user
 * @route   POST /api/auth/2fa/setup
 * @access  Private
 */
export const setupTwoFactor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Tidak terautentikasi',
      };

      return res.status(401).json(response);
    }

    const userId = req.user.id;
    const email = req.user.email;

    // Generate OTP secret dan QR code
    const { otpSecret, qrCodeUrl } = await authService.generateOTPSecret(email);

    // Simpan OTP secret ke database
    await authService.saveOTPSecret(userId, otpSecret);

    const response: ApiResponse<{ qrCodeUrl: string; otpSecret: string }> = {
      success: true,
      data: { qrCodeUrl, otpSecret },
      message: 'OTP secret berhasil dibuat, silakan verifikasi',
    };

    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    Verifikasi dan aktifkan 2FA
 * @route   POST /api/auth/2fa/verify
 * @access  Private
 */
export const verifyTwoFactor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Tidak terautentikasi',
      };

      return res.status(401).json(response);
    }

    const userId = req.user.id;
    const { token } = req.body;

    if (!token) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Token diperlukan',
      };

      return res.status(400).json(response);
    }

    // Verifikasi OTP
    const isValid = await authService.verifyOTP(userId, token);

    if (!isValid) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Token tidak valid',
      };

      return res.status(400).json(response);
    }

    // Aktifkan 2FA untuk user
    await authService.enable2FAForUser(userId);

    const response: ApiResponse<null> = {
      success: true,
      message: 'Verifikasi dua faktor berhasil diaktifkan',
    };

    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    Nonaktifkan 2FA
 * @route   POST /api/auth/2fa/disable
 * @access  Private
 */
export const disableTwoFactor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Tidak terautentikasi',
      };

      return res.status(401).json(response);
    }

    const userId = req.user.id;
    const { password } = req.body;

    if (!password) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Password diperlukan untuk menonaktifkan 2FA',
      };

      return res.status(400).json(response);
    }

    // Verifikasi password
    const isPasswordValid = await authService.verifyPassword(userId, password);

    if (!isPasswordValid) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Password tidak valid',
      };

      return res.status(400).json(response);
    }

    // Nonaktifkan 2FA
    await authService.disable2FAForUser(userId);

    const response: ApiResponse<null> = {
      success: true,
      message: 'Verifikasi dua faktor berhasil dinonaktifkan',
    };

    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};
