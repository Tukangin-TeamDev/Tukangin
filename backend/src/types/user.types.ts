import { UserRole } from '@prisma/client';

export { UserRole };

/**
 * Enum untuk metode autentikasi
 */
export enum AuthProvider {
  LOCAL = 'LOCAL',
  GOOGLE = 'GOOGLE',
}

/**
 * Authentication error types
 */
export enum AuthError {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  REFRESH_TOKEN_INVALID = 'REFRESH_TOKEN_INVALID',
  TWO_FACTOR_REQUIRED = 'TWO_FACTOR_REQUIRED',
  TWO_FACTOR_INVALID = 'TWO_FACTOR_INVALID',
}

/**
 * Tipe data untuk registrasi user baru
 */
export type CreateUserDto = {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  phone?: string;
  authProvider?: AuthProvider | string;
};

/**
 * Tipe data untuk login
 */
export type LoginDto = {
  email: string;
  password: string;
};

/**
 * Tipe data untuk refresh token
 */
export type RefreshTokenDto = {
  refreshToken: string;
};

/**
 * Tipe data untuk verifikasi 2FA
 */
export type TwoFactorDto = {
  userId: number;
  code: string;
};

/**
 * Tipe data untuk response user
 */
export type UserResponseDto = {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Tipe data untuk filter pencarian user
 */
export type UserFilterDto = {
  role?: UserRole;
  search?: string;
  page?: number;
  limit?: number;
};

/**
 * Tipe untuk Provider Profile
 */
export type ProviderProfileDto = {
  userId: number;
  about?: string;
  portfolio?: string;
  verified: boolean;
};
