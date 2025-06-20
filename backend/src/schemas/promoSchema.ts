import { z } from 'zod';

// Schema untuk validasi saat membuat promo baru
export const createPromoSchema = z.object({
  body: z.object({
    code: z
      .string({
        required_error: 'Kode promo wajib diisi',
      })
      .min(3, 'Kode promo minimal 3 karakter'),
    name: z.string({
      required_error: 'Nama promo wajib diisi',
    }),
    description: z.string().optional(),
    discountType: z.enum(['PERCENTAGE', 'FIXED_AMOUNT'], {
      required_error: 'Tipe diskon wajib diisi (PERCENTAGE/FIXED_AMOUNT)',
    }),
    discountValue: z
      .number({
        required_error: 'Nilai diskon wajib diisi',
      })
      .min(0, 'Nilai diskon tidak boleh negatif'),
    maxDiscount: z.number().optional(),
    minOrderAmount: z.number().optional(),
    startDate: z.string({
      required_error: 'Tanggal mulai wajib diisi',
    }),
    endDate: z.string({
      required_error: 'Tanggal berakhir wajib diisi',
    }),
    isActive: z.boolean().default(true),
    usageLimit: z.number().optional(),
    applicableTo: z.object({
      allServices: z.boolean().default(false),
      categoryIds: z.array(z.string()).optional(),
      serviceIds: z.array(z.string()).optional(),
      providerIds: z.array(z.string()).optional(),
    }),
  }),
});

// Schema untuk validasi saat mengubah promo yang sudah ada
export const updatePromoSchema = z.object({
  params: z.object({
    promoId: z.string({
      required_error: 'Promo ID wajib diisi',
    }),
  }),
  body: z.object({
    code: z.string().min(3, 'Kode promo minimal 3 karakter').optional(),
    name: z.string().optional(),
    description: z.string().optional(),
    discountType: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']).optional(),
    discountValue: z.number().min(0, 'Nilai diskon tidak boleh negatif').optional(),
    maxDiscount: z.number().optional(),
    minOrderAmount: z.number().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    isActive: z.boolean().optional(),
    usageLimit: z.number().optional(),
    applicableTo: z
      .object({
        allServices: z.boolean().optional(),
        categoryIds: z.array(z.string()).optional(),
        serviceIds: z.array(z.string()).optional(),
        providerIds: z.array(z.string()).optional(),
      })
      .optional(),
  }),
});

// Schema untuk validasi kode promo
export const validatePromoSchema = z.object({
  body: z.object({
    promoCode: z.string({
      required_error: 'Kode promo wajib diisi',
    }),
    serviceId: z.string().optional(),
    categoryId: z.string().optional(),
    providerId: z.string().optional(),
    amount: z.number({
      required_error: 'Jumlah order wajib diisi',
    }),
  }),
});

// Schema untuk validasi penukaran loyalty points
export const redeemLoyaltySchema = z.object({
  body: z.object({
    pointsToRedeem: z
      .number({
        required_error: 'Jumlah poin yang akan ditukar wajib diisi',
      })
      .min(1, 'Minimal poin yang ditukar adalah 1'),
    voucherType: z.enum(['FIXED_AMOUNT', 'PERCENTAGE'], {
      required_error: 'Tipe voucher wajib diisi (FIXED_AMOUNT/PERCENTAGE)',
    }),
  }),
});
