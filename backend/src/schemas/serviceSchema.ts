import { z } from 'zod';

// Schema untuk validasi saat membuat service baru
export const createServiceSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Nama service wajib diisi',
    }).min(3, 'Nama service minimal 3 karakter'),
    description: z.string({
      required_error: 'Deskripsi service wajib diisi',
    }).min(10, 'Deskripsi service minimal 10 karakter'),
    price: z.number({
      required_error: 'Harga service wajib diisi',
    }).min(0, 'Harga tidak boleh negatif'),
    unit: z.string({
      required_error: 'Unit service wajib diisi (per jam/per kunjungan)',
    }),
    categoryId: z.string({
      required_error: 'Kategori service wajib diisi',
    }),
  }),
});

// Schema untuk validasi saat mengubah service yang sudah ada
export const updateServiceSchema = z.object({
  params: z.object({
    serviceId: z.string({
      required_error: 'Service ID wajib diisi',
    }),
  }),
  body: z.object({
    name: z.string().min(3, 'Nama service minimal 3 karakter').optional(),
    description: z.string().min(10, 'Deskripsi service minimal 10 karakter').optional(),
    price: z.number().min(0, 'Harga tidak boleh negatif').optional(),
    unit: z.string().optional(),
    categoryId: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

// Schema untuk validasi pencarian service
export const searchServiceSchema = z.object({
  query: z.object({
    categoryId: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    radius: z.number().optional(),
    minPrice: z.number().optional(),
    maxPrice: z.number().optional(),
    rating: z.number().optional(),
    searchTerm: z.string().optional(),
    page: z.number().default(1),
    limit: z.number().default(10),
  }),
}); 