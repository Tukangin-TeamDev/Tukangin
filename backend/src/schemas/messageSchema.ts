import { z } from 'zod';

// Schema untuk mengirim pesan
export const sendMessageSchema = z.object({
  body: z.object({
    bookingId: z.string().uuid({
      message: 'Booking ID harus berupa UUID yang valid',
    }),
    content: z.string().min(1, {
      message: 'Isi pesan tidak boleh kosong',
    }),
    receiverId: z.string().uuid({
      message: 'Receiver ID harus berupa UUID yang valid',
    }),
  }),
});

// Schema untuk melaporkan pesan
export const reportMessageSchema = z.object({
  body: z.object({
    reason: z.string().min(5, {
      message: 'Alasan laporan harus diisi minimal 5 karakter',
    }),
  }),
});
