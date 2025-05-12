import { z } from 'zod';

/**
 * Validasi request inisiasi pembayaran
 */
export const initiatePaymentSchema = z.object({
  body: z.object({
    orderId: z.number({
      required_error: 'Order ID diperlukan',
      invalid_type_error: 'Order ID harus berupa angka',
    }).int().positive({
      message: 'Order ID harus positif',
    }),
    amount: z.number({
      required_error: 'Jumlah pembayaran diperlukan',
      invalid_type_error: 'Jumlah pembayaran harus berupa angka',
    }).positive({
      message: 'Jumlah pembayaran harus positif',
    }),
  }),
});

/**
 * Validasi request pemrosesan pembayaran
 */
export const processPaymentSchema = z.object({
  body: z.object({
    paymentId: z.number({
      required_error: 'Payment ID diperlukan',
      invalid_type_error: 'Payment ID harus berupa angka',
    }).int().positive({
      message: 'Payment ID harus positif',
    }),
    transactionId: z.string({
      required_error: 'Transaction ID diperlukan',
      invalid_type_error: 'Transaction ID harus berupa string',
    }).min(1, {
      message: 'Transaction ID tidak boleh kosong',
    }),
  }),
});

/**
 * Validasi request rilis escrow
 */
export const releaseEscrowSchema = z.object({
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
 * Validasi request refund pembayaran
 */
export const refundPaymentSchema = z.object({
  params: z.object({
    orderId: z.string({
      required_error: 'Order ID diperlukan',
      invalid_type_error: 'Order ID harus berupa string (akan dikonversi)',
    }).min(1, {
      message: 'Order ID tidak boleh kosong',
    }),
  }),
  body: z.object({
    reason: z.string({
      required_error: 'Alasan refund diperlukan',
      invalid_type_error: 'Alasan refund harus berupa string',
    }).min(10, {
      message: 'Alasan refund harus minimal 10 karakter',
    }).max(500, {
      message: 'Alasan refund tidak boleh lebih dari 500 karakter',
    }),
  }),
});

/**
 * Validasi request get payment by ID
 */
export const getPaymentByIdSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'Payment ID diperlukan',
      invalid_type_error: 'Payment ID harus berupa string (akan dikonversi)',
    }).min(1, {
      message: 'Payment ID tidak boleh kosong',
    }),
  }),
});

/**
 * Validasi request get payment by Order ID
 */
export const getPaymentByOrderIdSchema = z.object({
  params: z.object({
    orderId: z.string({
      required_error: 'Order ID diperlukan',
      invalid_type_error: 'Order ID harus berupa string (akan dikonversi)',
    }).min(1, {
      message: 'Order ID tidak boleh kosong',
    }),
  }),
}); 