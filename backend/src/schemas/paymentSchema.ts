import { z } from 'zod';

// Schema untuk memproses pembayaran
export const processPaymentSchema = z.object({
  body: z.object({
    paymentMethod: z.string({
      required_error: 'Metode pembayaran harus diisi',
    }),
    paymentProofUrl: z
      .string()
      .url({
        message: 'URL bukti pembayaran tidak valid',
      })
      .optional(),
  }),
});

// Schema untuk refund pembayaran
export const refundPaymentSchema = z.object({
  body: z.object({
    refundReason: z.string().min(5, {
      message: 'Alasan refund harus diisi minimal 5 karakter',
    }),
    refundAmount: z.number().positive({
      message: 'Jumlah refund harus lebih besar dari 0',
    }),
  }),
});

// Schema untuk withdraw dari wallet
export const withdrawWalletSchema = z.object({
  body: z.object({
    amount: z.number().positive({
      message: 'Jumlah penarikan harus lebih besar dari 0',
    }),
    bankName: z.string({
      required_error: 'Nama bank harus diisi',
    }),
    accountName: z.string({
      required_error: 'Nama pemilik rekening harus diisi',
    }),
    accountNumber: z.string({
      required_error: 'Nomor rekening harus diisi',
    }),
  }),
});

// Schema untuk memproses withdrawal
export const processWithdrawalSchema = z.object({
  body: z.object({
    status: z.enum(['SUCCESS', 'FAILED'], {
      required_error: 'Status harus diisi',
      invalid_type_error: 'Status harus SUCCESS atau FAILED',
    }),
    notes: z.string().optional(),
  }),
});
