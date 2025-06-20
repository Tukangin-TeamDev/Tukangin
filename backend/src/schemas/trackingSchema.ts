import { z } from 'zod';

/**
 * Schema untuk memvalidasi update lokasi provider
 */
export const updateLocationSchema = z.object({
  params: z.object({
    bookingId: z.string().uuid('Format ID booking tidak valid'),
  }),
  body: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
});

/**
 * Schema untuk validasi request tracking
 */
export const getTrackingSchema = z.object({
  params: z.object({
    bookingId: z.string().uuid('Format ID booking tidak valid'),
  }),
});
