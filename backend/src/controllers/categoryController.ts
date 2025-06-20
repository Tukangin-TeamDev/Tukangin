import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';
import { handleError } from '../utils/errorHandler';

const prisma = new PrismaClient();

/**
 * Mendapatkan semua kategori
 */
export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Parameter query untuk filter
    const { parentId } = req.query;

    // Filter kategori berdasarkan parentId jika ada
    const where = parentId ? { parentId: parentId as string } : { parentId: null }; // Jika tidak ada parentId, ambil kategori utama (tanpa parent)

    const categories = await prisma.category.findMany({
      where,
      include: {
        _count: {
          select: {
            subCategories: true,
            services: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return res.status(200).json({
      status: 'success',
      data: categories,
    });
  } catch (error) {
    logger.error(`Error in getAllCategories: ${error}`);
    return handleError(error, req, res, next);
  }
};

/**
 * Mendapatkan detail kategori berdasarkan ID
 */
export const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryId } = req.params;

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            subCategories: true,
            services: true,
          },
        },
      },
    });

    if (!category) {
      return res.status(404).json({
        status: 'error',
        message: 'Kategori tidak ditemukan',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: category,
    });
  } catch (error) {
    logger.error(`Error in getCategoryById: ${error}`);
    return handleError(error, req, res, next);
  }
};

/**
 * Mendapatkan sub-kategori dari kategori tertentu
 */
export const getSubcategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryId } = req.params;

    // Cek apakah kategori parent ada
    const parentExists = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!parentExists) {
      return res.status(404).json({
        status: 'error',
        message: 'Kategori parent tidak ditemukan',
      });
    }

    // Ambil semua sub-kategori
    const subCategories = await prisma.category.findMany({
      where: { parentId: categoryId },
      orderBy: {
        name: 'asc',
      },
    });

    return res.status(200).json({
      status: 'success',
      data: subCategories,
    });
  } catch (error) {
    logger.error(`Error in getSubcategories: ${error}`);
    return handleError(error, req, res, next);
  }
};

/**
 * Membuat kategori baru (admin only)
 */
export const createCategory = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { name, description, parentId } = req.body;

    // Cek apakah ada kategori dengan nama yang sama
    const existingCategory = await prisma.category.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    });

    if (existingCategory) {
      return res.status(400).json({
        status: 'error',
        message: 'Kategori dengan nama yang sama sudah ada',
      });
    }

    // Jika ada parentId, cek apakah parent kategori ada
    if (parentId) {
      const parentExists = await prisma.category.findUnique({
        where: { id: parentId },
      });

      if (!parentExists) {
        return res.status(404).json({
          status: 'error',
          message: 'Kategori parent tidak ditemukan',
        });
      }
    }

    // Set imageUrl jika ada file upload
    let imageUrl = null;
    if (req.file) {
      // Simpan URL gambar yang di-upload (asumsi ada service upload yang mengembalikan URL)
      imageUrl = `${process.env.BASE_URL}/uploads/categories/${req.file.filename}`;
    }

    // Buat kategori baru
    const category = await prisma.category.create({
      data: {
        name,
        description,
        parentId: parentId || null,
        imageUrl,
      },
    });

    return res.status(201).json({
      status: 'success',
      message: 'Kategori berhasil dibuat',
      data: category,
    });
  } catch (error) {
    logger.error(`Error in createCategory: ${error}`);
    return handleError(error, req, res, next);
  }
};

/**
 * Mengupdate kategori (admin only)
 */
export const updateCategory = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { categoryId } = req.params;
    const { name, description, parentId } = req.body;

    // Cek apakah kategori yang akan diupdate ada
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!existingCategory) {
      return res.status(404).json({
        status: 'error',
        message: 'Kategori tidak ditemukan',
      });
    }

    // Cek apakah nama kategori sudah dipakai oleh kategori lain
    if (name && name !== existingCategory.name) {
      const nameExists = await prisma.category.findFirst({
        where: {
          name: { equals: name, mode: 'insensitive' },
          id: { not: categoryId },
        },
      });

      if (nameExists) {
        return res.status(400).json({
          status: 'error',
          message: 'Nama kategori sudah dipakai oleh kategori lain',
        });
      }
    }

    // Pastikan tidak menjadikan diri sendiri sebagai parent
    if (parentId && parentId === categoryId) {
      return res.status(400).json({
        status: 'error',
        message: 'Kategori tidak bisa menjadi parent dari dirinya sendiri',
      });
    }

    // Jika ada parentId, cek apakah parent kategori ada
    if (parentId && parentId !== existingCategory.parentId) {
      const parentExists = await prisma.category.findUnique({
        where: { id: parentId },
      });

      if (!parentExists) {
        return res.status(404).json({
          status: 'error',
          message: 'Kategori parent tidak ditemukan',
        });
      }

      // Cek apakah akan menyebabkan circular reference
      // Misalnya: A -> B -> C -> A
      if (await isCircularReference(categoryId, parentId)) {
        return res.status(400).json({
          status: 'error',
          message: 'Tidak bisa menjadikan sub-kategori sebagai parent (circular reference)',
        });
      }
    }

    // Set imageUrl jika ada file upload baru
    let imageUrl = undefined;
    if (req.file) {
      imageUrl = `${process.env.BASE_URL}/uploads/categories/${req.file.filename}`;

      // Hapus file lama jika ada
      // (implementasi fungsi hapus file dilakukan di service terpisah)
    }

    // Update kategori
    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name: name !== undefined ? name : undefined,
        description: description !== undefined ? description : undefined,
        parentId: parentId !== undefined ? parentId || null : undefined,
        imageUrl: imageUrl !== undefined ? imageUrl : undefined,
      },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Kategori berhasil diupdate',
      data: updatedCategory,
    });
  } catch (error) {
    logger.error(`Error in updateCategory: ${error}`);
    return handleError(error, req, res, next);
  }
};

/**
 * Menghapus kategori (admin only)
 */
export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryId } = req.params;

    // Cek apakah kategori yang akan dihapus ada
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: {
            subCategories: true,
            services: true,
          },
        },
      },
    });

    if (!existingCategory) {
      return res.status(404).json({
        status: 'error',
        message: 'Kategori tidak ditemukan',
      });
    }

    // Cek apakah kategori memiliki sub-kategori
    if (existingCategory._count.subCategories > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Kategori memiliki sub-kategori. Hapus sub-kategori terlebih dahulu',
      });
    }

    // Cek apakah kategori digunakan oleh service
    if (existingCategory._count.services > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Kategori sedang digunakan oleh service. Ubah kategori service terlebih dahulu',
      });
    }

    // Hapus kategori
    await prisma.category.delete({
      where: { id: categoryId },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Kategori berhasil dihapus',
    });
  } catch (error) {
    logger.error(`Error in deleteCategory: ${error}`);
    return handleError(error, req, res, next);
  }
};

/**
 * Helper function untuk cek circular reference dalam hierarchy kategori
 */
async function isCircularReference(categoryId: string, parentId: string): Promise<boolean> {
  let currentParentId = parentId;

  // Follow the parent chain
  while (currentParentId) {
    // If we find the original category id in the chain, we have a circular reference
    if (currentParentId === categoryId) {
      return true;
    }

    // Get the next parent in the chain
    const parent = await prisma.category.findUnique({
      where: { id: currentParentId },
      select: { parentId: true },
    });

    // Break the loop if we reach the top level or the parent doesn't exist
    if (!parent || !parent.parentId) {
      break;
    }

    currentParentId = parent.parentId;
  }

  return false;
}
