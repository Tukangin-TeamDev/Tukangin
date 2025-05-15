import { z } from 'zod';
import { UserRole, AuthProvider } from '../../types/user.types';

/**
 * Schema validasi untuk registrasi user
 */
export const registerSchema = z.object({
  email: z.string().email({ message: 'Email tidak valid' }),
  password: z
    .string()
    .min(8, { message: 'Password minimal 8 karakter' })
    .regex(/[A-Z]/, { message: 'Password harus memiliki minimal 1 huruf kapital' })
    .regex(/[0-9]/, { message: 'Password harus memiliki minimal 1 angka' }),
  name: z.string().min(3, { message: 'Nama minimal 3 karakter' }),
  role: z.nativeEnum(UserRole).default(UserRole.CUSTOMER),
  phone: z.string().optional(),
  authProvider: z.nativeEnum(AuthProvider).default(AuthProvider.LOCAL),
});

/**
 * Schema validasi untuk login
 */
export const loginSchema = z.object({
  email: z.string().email({ message: 'Email tidak valid' }),
  password: z.string().min(1, { message: 'Password harus diisi' }),
});

/**
 * Schema validasi untuk Google Auth
 */
export const googleAuthSchema = z.object({
  googleId: z.string().min(1, { message: 'Google ID harus diisi' }),
  email: z.string().email({ message: 'Email tidak valid' }),
  name: z.string().min(1, { message: 'Nama harus diisi' }),
});

/**
 * Schema validasi untuk refresh token
 */
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, { message: 'Refresh token harus diisi' }),
});

/**
 * Schema validasi untuk 2FA
 */
export const twoFASchema = z.object({
  code: z
    .string()
    .length(6, { message: 'Kode harus memiliki panjang 6 karakter' })
    .regex(/^\d+$/, { message: 'Kode harus berupa angka' }),
});

/**
 * Schema validasi untuk change password
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, { message: 'Password saat ini harus diisi' }),
    newPassword: z
      .string()
      .min(8, { message: 'Password baru minimal 8 karakter' })
      .regex(/[A-Z]/, { message: 'Password baru harus memiliki minimal 1 huruf kapital' })
      .regex(/[0-9]/, { message: 'Password baru harus memiliki minimal 1 angka' }),
    confirmPassword: z.string().min(1, { message: 'Konfirmasi password harus diisi' }),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Password baru dan konfirmasi password tidak sama',
    path: ['confirmPassword'],
  });
