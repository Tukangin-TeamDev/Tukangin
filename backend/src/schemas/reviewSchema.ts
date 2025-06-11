import { z } from 'zod';

// Schema untuk membuat review
export const createReviewSchema = z.object({
  body: z.object({
    bookingId: z.string().uuid({
      message: 'Booking ID harus berupa UUID yang valid',
    }),
    rating: z.number().int().min(1).max(5, {
      message: 'Rating harus berupa angka 1-5',
    }),
    comment: z.string().optional(),
  }),
});

// Schema untuk merespon review
export const respondToReviewSchema = z.object({
  body: z.object({
    response: z.string().min(3, {
      message: 'Tanggapan harus diisi minimal 3 karakter',
    }),
  }),
});

// Schema untuk melaporkan review
export const reportReviewSchema = z.object({
  body: z.object({
    reason: z.string().min(5, {
      message: 'Alasan laporan harus diisi minimal 5 karakter',
    }),
  }),
});

// Schema untuk menghapus review
export const deleteReviewSchema = z.object({
  body: z.object({
    reason: z.string().min(5, {
      message: 'Alasan penghapusan harus diisi minimal 5 karakter',
    }),
  }),
});
