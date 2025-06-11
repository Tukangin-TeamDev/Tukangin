import { z } from 'zod';

// Schema untuk membuat booking baru
export const createBookingSchema = z.object({
  body: z.object({
    providerId: z.string().uuid({
      message: 'Provider ID harus berupa UUID yang valid',
    }),
    services: z
      .array(
        z.object({
          serviceId: z.string().uuid({
            message: 'Service ID harus berupa UUID yang valid',
          }),
          quantity: z.number().int().positive().optional(),
          notes: z.string().optional(),
        })
      )
      .min(1, {
        message: 'Minimal harus memilih 1 layanan',
      }),
    scheduledDate: z.string().datetime().optional(),
    notes: z.string().optional(),
    locationAddress: z.string().min(5, {
      message: 'Alamat lokasi wajib diisi minimal 5 karakter',
    }),
    locationCoordinates: z.string().regex(/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/, {
      message: 'Format koordinat tidak valid, gunakan format "lat,lng"',
    }),
  }),
});

// Schema untuk update status booking
export const updateBookingStatusSchema = z.object({
  body: z.object({
    status: z.enum(
      [
        'PENDING',
        'ACCEPTED',
        'DECLINED',
        'CANCELLED',
        'EN_ROUTE',
        'ON_SITE',
        'IN_PROGRESS',
        'COMPLETED',
        'REVIEWED',
      ],
      {
        required_error: 'Status booking harus diisi',
        invalid_type_error: 'Status booking tidak valid',
      }
    ),
    location: z.string().optional(),
    notes: z.string().optional(),
  }),
});

// Schema untuk cancel booking
export const cancelBookingSchema = z.object({
  body: z.object({
    reason: z.string().min(3, {
      message: 'Alasan pembatalan harus diisi minimal 3 karakter',
    }),
  }),
});

// Schema untuk membuat requote (perubahan harga)
export const createRequoteSchema = z.object({
  body: z.object({
    newAmount: z.number().positive({
      message: 'Jumlah baru harus lebih besar dari 0',
    }),
    reason: z.string().min(5, {
      message: 'Alasan perubahan harga harus diisi minimal 5 karakter',
    }),
  }),
});

// Schema untuk merespon requote
export const respondRequoteSchema = z.object({
  body: z.object({
    accept: z.boolean({
      required_error: 'Keputusan terima/tolak requote harus diisi',
      invalid_type_error: 'Keputusan harus berupa boolean',
    }),
  }),
});
