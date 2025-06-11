import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppError } from '../errorHandler';

// Skema validasi untuk registrasi pengguna
const registerSchema = z.object({
  email: z.string().email('Email tidak valid').trim().toLowerCase(),

  password: z
    .string()
    .min(8, 'Password minimal 8 karakter')
    .regex(/[A-Z]/, 'Password harus mengandung minimal satu huruf besar')
    .regex(/[a-z]/, 'Password harus mengandung minimal satu huruf kecil')
    .regex(/[0-9]/, 'Password harus mengandung minimal satu angka'),

  phoneNumber: z
    .string()
    .regex(
      /^(\+62|62|0)8[1-9][0-9]{6,10}$/,
      'Nomor telepon harus dalam format Indonesia (contoh: 08123456789)'
    ),

  fullName: z.string().min(3, 'Nama lengkap minimal 3 karakter'),

  role: z.enum(['CUSTOMER', 'PROVIDER', 'ADMIN'], {
    errorMap: () => ({ message: 'Role harus CUSTOMER, PROVIDER, atau ADMIN' }),
  }),

  // Optional fields untuk Provider
  businessName: z.string().optional(),
  address: z.string().min(5, 'Alamat minimal 5 karakter').optional(),
  bio: z.string().optional(),
});

// Skema validasi untuk login
const loginSchema = z.object({
  email: z.string().email('Email tidak valid').trim().toLowerCase(),

  password: z.string().min(1, 'Password wajib diisi'),
});

// Skema validasi untuk OTP
const otpVerificationSchema = z.object({
  email: z.string().email('Email tidak valid').trim().toLowerCase(),

  otp: z
    .string()
    .length(6, 'Kode OTP harus 6 digit')
    .regex(/^\d+$/, 'Kode OTP hanya boleh berisi angka'),
});

// Skema validasi untuk reset password
const forgotPasswordSchema = z.object({
  email: z.string().email('Email tidak valid').trim().toLowerCase(),
});

// Skema validasi untuk reset password
const resetPasswordSchema = z
  .object({
    token: z.string(),
    password: z
      .string()
      .min(8, 'Password minimal 8 karakter')
      .regex(/[A-Z]/, 'Password harus mengandung minimal satu huruf besar')
      .regex(/[a-z]/, 'Password harus mengandung minimal satu huruf kecil')
      .regex(/[0-9]/, 'Password harus mengandung minimal satu angka'),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Password dan konfirmasi password tidak cocok',
    path: ['confirmPassword'],
  });

// Middleware generic untuk validasi Zod
export const validate = (schema: z.ZodType<any, any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Get first error message
        const firstError = error.errors[0];
        return next(new AppError(firstError.message, 400));
      }
      next(new AppError('Validasi gagal', 400));
    }
  };
};

// Middleware untuk validasi registrasi
export const validateRegister = validate(registerSchema);

// Middleware untuk validasi login
export const validateLogin = validate(loginSchema);

// Middleware untuk validasi OTP
export const validateOtp = validate(otpVerificationSchema);

// Middleware untuk validasi forgot password
export const validateForgotPassword = validate(forgotPasswordSchema);

// Middleware untuk validasi reset password
export const validateResetPassword = validate(resetPasswordSchema);
