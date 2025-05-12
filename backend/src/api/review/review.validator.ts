import { z } from 'zod';

/**
 * Validasi request pembuat ulasan
 */
export const createReviewSchema = z.object({
  body: z.object({
    orderId: z.number({
      required_error: 'Order ID diperlukan',
      invalid_type_error: 'Order ID harus berupa angka',
    }).int().positive({
      message: 'Order ID harus positif',
    }),
    providerId: z.number({
      required_error: 'Provider ID diperlukan',
      invalid_type_error: 'Provider ID harus berupa angka',
    }).int().positive({
      message: 'Provider ID harus positif',
    }),
    rating: z.number({
      required_error: 'Rating diperlukan',
      invalid_type_error: 'Rating harus berupa angka',
    }).int().min(1, {
      message: 'Rating minimal 1',
    }).max(5, {
      message: 'Rating maksimal 5',
    }),
    comment: z.string({
      invalid_type_error: 'Komentar harus berupa teks',
    }).max(500, {
      message: 'Komentar tidak boleh lebih dari 500 karakter',
    }).optional(),
  }),
});

/**
 * Validasi request mendapatkan ulasan berdasarkan ID
 */
export const getReviewByIdSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'Review ID diperlukan',
      invalid_type_error: 'Review ID harus berupa string (akan dikonversi)',
    }).min(1, {
      message: 'Review ID tidak boleh kosong',
    }),
  }),
});

/**
 * Validasi request mendapatkan ulasan berdasarkan Order ID
 */
export const getReviewByOrderIdSchema = z.object({
  params: z.object({
    orderId: z.string({
      required_error: 'Order ID diperlukan',
      invalid_type_error: 'Order ID harus berupa string (akan dikonversi)',
    }).min(1, {
      message: 'Order ID tidak boleh kosong',
    }),
  }),
});

/**
 * Validasi request mendapatkan ulasan berdasarkan Provider ID
 */
export const getReviewsByProviderIdSchema = z.object({
  params: z.object({
    providerId: z.string({
      required_error: 'Provider ID diperlukan',
      invalid_type_error: 'Provider ID harus berupa string (akan dikonversi)',
    }).min(1, {
      message: 'Provider ID tidak boleh kosong',
    }),
  }),
});

/**
 * Validasi request hapus ulasan
 */
export const deleteReviewSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'Review ID diperlukan',
      invalid_type_error: 'Review ID harus berupa string (akan dikonversi)',
    }).min(1, {
      message: 'Review ID tidak boleh kosong',
    }),
  }),
}); 