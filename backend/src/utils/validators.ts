import { z } from 'zod';
import { UserRole, AuthProvider } from '../types/user.types';
import { ServiceType } from '../types/service.types';
import { OrderStatus } from '../types/order.types';

/**
 * Validator untuk request pembuatan user
 */
export const createUserSchema = z.object({
  email: z.string().email({ message: 'Email tidak valid' }),
  password: z.string().min(8, { message: 'Password minimal 8 karakter' }),
  name: z.string().min(2, { message: 'Nama minimal 2 karakter' }),
  role: z.nativeEnum(UserRole),
  phone: z.string().optional(),
  authProvider: z.nativeEnum(AuthProvider).optional().default(AuthProvider.LOCAL),
});

/**
 * Validator untuk request login
 */
export const loginSchema = z.object({
  email: z.string().email({ message: 'Email tidak valid' }),
  password: z.string().min(1, { message: 'Password harus diisi' }),
});

/**
 * Validator untuk request pembuatan layanan
 */
export const createServiceSchema = z
  .object({
    providerId: z.number(),
    name: z.string().min(3, { message: 'Nama layanan minimal 3 karakter' }),
    description: z.string().min(10, { message: 'Deskripsi minimal 10 karakter' }),
    serviceType: z.nativeEnum(ServiceType),
    fixedPrice: z.number().optional().nullable(),
    media: z.string().optional().nullable(),
  })
  .refine(
    data => {
      // Jika tipe layanan FIXED, harga harus diisi
      if (data.serviceType === ServiceType.FIXED && !data.fixedPrice) {
        return false;
      }
      return true;
    },
    {
      message: 'Harga harus diisi untuk layanan dengan tipe fixed',
      path: ['fixedPrice'],
    }
  );

/**
 * Validator untuk request pembuatan order
 */
export const createOrderSchema = z.object({
  serviceId: z.number().int().positive({ message: 'ID layanan harus berupa angka positif' }),
  customerId: z.number().int().positive({ message: 'ID customer harus berupa angka positif' }),
  description: z.string().optional(),
  scheduledAt: z
    .string()
    .optional()
    .refine(val => !val || !isNaN(Date.parse(val)), { message: 'Format tanggal tidak valid' }),
  negotiationNote: z.string().optional(),
});

/**
 * Validator untuk request update order
 */
export const updateOrderSchema = z.object({
  status: z.nativeEnum(OrderStatus).optional(),
  scheduledAt: z
    .string()
    .optional()
    .refine(val => !val || !isNaN(Date.parse(val)), { message: 'Format tanggal tidak valid' }),
  description: z.string().optional(),
  negotiationNote: z.string().optional(),
  escrowAmount: z
    .number()
    .nonnegative({ message: 'Jumlah escrow harus berupa angka non-negatif' })
    .optional(),
});

/**
 * Validator untuk request pembayaran
 */
export const paymentSchema = z.object({
  orderId: z.number(),
  amount: z.number().positive({ message: 'Jumlah pembayaran harus positif' }),
  status: z.string(),
  transactionId: z.string().optional(),
});

/**
 * Validator untuk request review
 */
export const reviewSchema = z.object({
  orderId: z.number(),
  customerId: z.number(),
  providerId: z.number(),
  rating: z.number().min(1).max(5, { message: 'Rating harus antara 1-5' }),
  comment: z.string().optional(),
});

/**
 * Validator untuk update profil user
 */
export const updateUserSchema = z.object({
  name: z.string().min(2, { message: 'Nama minimal 2 karakter' }).optional(),
  phone: z.string().optional(),
  email: z.string().email({ message: 'Email tidak valid' }).optional(),
  // Password tidak wajib, tapi jika ada, harus minimal 8 karakter
  password: z.string().min(8, { message: 'Password minimal 8 karakter' }).optional(),
});

/**
 * Validator untuk update provider profile
 */
export const updateProviderProfileSchema = z.object({
  about: z.string().optional(),
  portfolio: z.string().optional(),
  // Verified hanya bisa diupdate oleh admin, jadi tidak disertakan di sini
});

/**
 * Validator untuk update service
 */
export const updateServiceSchema = z
  .object({
    name: z.string().min(3, { message: 'Nama layanan minimal 3 karakter' }).optional(),
    description: z.string().min(10, { message: 'Deskripsi minimal 10 karakter' }).optional(),
    serviceType: z.nativeEnum(ServiceType).optional(),
    fixedPrice: z.number().optional().nullable(),
    media: z.string().optional().nullable(),
  })
  .refine(
    data => {
      // Jika tipe layanan FIXED, harga harus diisi
      if (data.serviceType === ServiceType.FIXED && data.fixedPrice === undefined) {
        return false;
      }
      return true;
    },
    {
      message: 'Harga harus diisi untuk layanan dengan tipe fixed',
      path: ['fixedPrice'],
    }
  );

/**
 * Validasi untuk pembuatan dispute
 */
export const createDisputeSchema = z.object({
  description: z.string().min(10, { message: 'Deskripsi dispute minimal 10 karakter' }),
});
