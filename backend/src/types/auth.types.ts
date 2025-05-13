import { User as PrismaUser } from '@prisma/client';

/**
 * Tipe data untuk user yang digunakan dalam aplikasi
 * Mencakup properti utama yang sering digunakan
 */
export type AuthUser = {
  id: number;
  email: string;
  role: string;
  name?: string;
};

/**
 * Tipe untuk response user tanpa data sensitif
 */
export type UserResponse = Omit<PrismaUser, 'password' | 'otpSecret' | 'refreshToken'>;

/**
 * Tipe data untuk fungsi audit log
 */
export type AuditLogAction = 
  | 'USER_LOGIN' 
  | 'USER_LOGOUT' 
  | 'USER_REGISTER' 
  | 'PASSWORD_RESET' 
  | 'PROFILE_UPDATE' 
  | 'TWO_FACTOR_SETUP' 
  | 'TWO_FACTOR_VERIFY';

export interface AuditLogData {
  [key: string]: any;
}
