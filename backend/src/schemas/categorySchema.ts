import { z } from 'zod';

// Schema untuk validasi saat membuat kategori baru
export const createCategorySchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Nama kategori wajib diisi',
      })
      .min(3, 'Nama kategori minimal 3 karakter'),
    description: z.string().optional(),
    parentId: z.string().nullable().optional(),
  }),
});

// Schema untuk validasi saat mengubah kategori yang sudah ada
export const updateCategorySchema = z.object({
  params: z.object({
    categoryId: z.string({
      required_error: 'Category ID wajib diisi',
    }),
  }),
  body: z.object({
    name: z.string().min(3, 'Nama kategori minimal 3 karakter').optional(),
    description: z.string().optional(),
    parentId: z.string().nullable().optional(),
  }),
});
