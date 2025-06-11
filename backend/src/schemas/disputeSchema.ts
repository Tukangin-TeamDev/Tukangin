import { z } from 'zod';

// Schema untuk membuat dispute/tiket
export const createDisputeSchema = z.object({
  body: z.object({
    bookingId: z.string().uuid({
      message: 'Booking ID harus berupa UUID yang valid'
    }),
    title: z.string().min(3, {
      message: 'Judul dispute harus diisi minimal 3 karakter'
    }),
    description: z.string().min(10, {
      message: 'Deskripsi dispute harus diisi minimal 10 karakter'
    })
  })
});

// Schema untuk menyelesaikan dispute
export const resolveDisputeSchema = z.object({
  body: z.object({
    resolution: z.string().min(5, {
      message: 'Resolusi harus diisi minimal 5 karakter'
    }),
    status: z.enum(['RESOLVED_REFUND', 'RESOLVED_RELEASE', 'RESOLVED_PARTIAL', 'REJECTED'], {
      required_error: 'Status harus diisi',
      invalid_type_error: 'Status tidak valid'
    }),
    refundAmount: z.number().positive({
      message: 'Jumlah refund harus lebih besar dari 0'
    }).optional()
  }).refine(data => {
    // Jika status RESOLVED_PARTIAL, refundAmount harus diisi
    if (data.status === 'RESOLVED_PARTIAL' && !data.refundAmount) {
      return false;
    }
    return true;
  }, {
    message: 'Jumlah refund harus diisi untuk partial refund',
    path: ['refundAmount']
  })
}); 