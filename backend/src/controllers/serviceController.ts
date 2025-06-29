import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';
import { handleError } from '../utils/errorHandler';

const prisma = new PrismaClient();

/**
 * Mendapatkan daftar service yang dimiliki oleh provider yang sedang login
 */
export const getProviderServices = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    // Dapatkan provider yang sedang login
    const provider = await prisma.serviceProvider.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!provider) {
      return res.status(404).json({
        status: 'error',
        message: 'Provider tidak ditemukan',
      });
    }

    // Dapatkan semua service yang dimiliki provider
    const services = await prisma.service.findMany({
      where: {
        providerId: provider.id,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return res.status(200).json({
      status: 'success',
      data: services,
    });
  } catch (error) {
    logger.error(`Error in getProviderServices: ${error}`);
    return handleError(error, req, res, next);
  }
};

/**
 * Mendapatkan detail service berdasarkan ID
 */
export const getServiceById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { serviceId } = req.params;

    // Cari service berdasarkan ID
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        provider: {
          select: {
            id: true,
            fullName: true,
            businessName: true,
            avatarUrl: true,
            rating: true,
            totalReviews: true,
            isVerified: true,
          },
        },
      },
    });

    if (!service) {
      return res.status(404).json({
        status: 'error',
        message: 'Service tidak ditemukan',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: service,
    });
  } catch (error) {
    logger.error(`Error in getServiceById: ${error}`);
    return handleError(error, req, res, next);
  }
};

/**
 * Membuat service baru
 */
export const createService = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const { name, description, price, unit, categoryId } = req.body;

    // Dapatkan provider yang sedang login
    const provider = await prisma.serviceProvider.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!provider) {
      return res.status(404).json({
        status: 'error',
        message: 'Provider tidak ditemukan',
      });
    }

    // Cek apakah kategori yang dipilih ada
    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!categoryExists) {
      return res.status(404).json({
        status: 'error',
        message: 'Kategori tidak ditemukan',
      });
    }

    // Buat service baru
    const service = await prisma.service.create({
      data: {
        name,
        description,
        price,
        unit,
        providerId: provider.id,
        categoryId,
      },
    });

    return res.status(201).json({
      status: 'success',
      message: 'Service berhasil dibuat',
      data: service,
    });
  } catch (error) {
    logger.error(`Error in createService: ${error}`);
    return handleError(error, req, res, next);
  }
};

/**
 * Mengupdate service yang sudah ada
 */
export const updateService = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const { serviceId } = req.params;
    const { name, description, price, unit, categoryId, isActive } = req.body;

    // Dapatkan provider yang sedang login
    const provider = await prisma.serviceProvider.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!provider) {
      return res.status(404).json({
        status: 'error',
        message: 'Provider tidak ditemukan',
      });
    }

    // Cek apakah service yang akan diupdate ada dan milik provider yang sedang login
    const existingService = await prisma.service.findFirst({
      where: {
        id: serviceId,
        providerId: provider.id,
      },
    });

    if (!existingService) {
      return res.status(404).json({
        status: 'error',
        message: 'Service tidak ditemukan atau bukan milik Anda',
      });
    }

    // Jika categoryId diubah, cek apakah kategori baru ada
    if (categoryId && categoryId !== existingService.categoryId) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!categoryExists) {
        return res.status(404).json({
          status: 'error',
          message: 'Kategori tidak ditemukan',
        });
      }
    }

    // Update service
    const updatedService = await prisma.service.update({
      where: { id: serviceId },
      data: {
        name: name !== undefined ? name : undefined,
        description: description !== undefined ? description : undefined,
        price: price !== undefined ? price : undefined,
        unit: unit !== undefined ? unit : undefined,
        categoryId: categoryId !== undefined ? categoryId : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
      },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Service berhasil diupdate',
      data: updatedService,
    });
  } catch (error) {
    logger.error(`Error in updateService: ${error}`);
    return handleError(error, req, res, next);
  }
};

/**
 * Menghapus/menonaktifkan service
 */
export const deleteService = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const { serviceId } = req.params;

    // Dapatkan provider yang sedang login
    const provider = await prisma.serviceProvider.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!provider) {
      return res.status(404).json({
        status: 'error',
        message: 'Provider tidak ditemukan',
      });
    }

    // Cek apakah service yang akan dihapus ada dan milik provider yang sedang login
    const existingService = await prisma.service.findFirst({
      where: {
        id: serviceId,
        providerId: provider.id,
      },
    });

    if (!existingService) {
      return res.status(404).json({
        status: 'error',
        message: 'Service tidak ditemukan atau bukan milik Anda',
      });
    }

    // Cek apakah service sedang digunakan dalam booking
    const bookingUsingService = await prisma.bookingService.findFirst({
      where: {
        serviceId,
        booking: {
          status: {
            in: ['PENDING', 'ACCEPTED', 'EN_ROUTE', 'ON_SITE', 'IN_PROGRESS'],
          },
        },
      },
    });

    if (bookingUsingService) {
      // Nonaktifkan service daripada menghapus jika sedang digunakan
      const deactivatedService = await prisma.service.update({
        where: { id: serviceId },
        data: { isActive: false },
      });

      return res.status(200).json({
        status: 'success',
        message: 'Service sedang digunakan dalam booking aktif. Service telah dinonaktifkan',
        data: deactivatedService,
      });
    }

    // Hapus service jika tidak sedang digunakan
    await prisma.service.delete({
      where: { id: serviceId },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Service berhasil dihapus',
    });
  } catch (error) {
    logger.error(`Error in deleteService: ${error}`);
    return handleError(error, req, res, next);
  }
};

/**
 * Mengaktifkan service
 */
export const activateService = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const { serviceId } = req.params;

    // Dapatkan provider yang sedang login
    const provider = await prisma.serviceProvider.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!provider) {
      return res.status(404).json({
        status: 'error',
        message: 'Provider tidak ditemukan',
      });
    }

    // Cek apakah service yang akan diaktifkan ada dan milik provider yang sedang login
    const existingService = await prisma.service.findFirst({
      where: {
        id: serviceId,
        providerId: provider.id,
      },
    });

    if (!existingService) {
      return res.status(404).json({
        status: 'error',
        message: 'Service tidak ditemukan atau bukan milik Anda',
      });
    }

    // Aktifkan service
    const activatedService = await prisma.service.update({
      where: { id: serviceId },
      data: { isActive: true },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Service berhasil diaktifkan',
      data: activatedService,
    });
  } catch (error) {
    logger.error(`Error in activateService: ${error}`);
    return handleError(error, req, res, next);
  }
};

/**
 * Mencari service berdasarkan kategori dan/atau lokasi
 */
export const searchServices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      categoryId,
      latitude,
      longitude,
      radius = 10, // Default radius 10km
      minPrice,
      maxPrice,
      rating,
      searchTerm,
      page = 1,
      limit = 10,
    } = req.query;

    // Konversi parameter query ke tipe yang sesuai
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    // Buat filter pencarian
    let whereClause: any = { isActive: true };

    // Filter berdasarkan kategori
    if (categoryId) {
      whereClause.categoryId = categoryId as string;
    }

    // Filter berdasarkan range harga
    if (minPrice !== undefined || maxPrice !== undefined) {
      whereClause.price = {};
      if (minPrice !== undefined) {
        whereClause.price.gte = Number(minPrice);
      }
      if (maxPrice !== undefined) {
        whereClause.price.lte = Number(maxPrice);
      }
    }

    // Filter berdasarkan rating provider
    if (rating) {
      whereClause.provider = {
        rating: { gte: Number(rating) },
      };
    }

    // Filter pencarian berdasarkan nama atau deskripsi
    if (searchTerm) {
      whereClause.OR = [
        { name: { contains: searchTerm as string, mode: 'insensitive' } },
        { description: { contains: searchTerm as string, mode: 'insensitive' } },
      ];
    }

    // Ambil service sesuai filter
    const services = await prisma.service.findMany({
      where: whereClause,
      include: {
        provider: {
          select: {
            id: true,
            fullName: true,
            businessName: true,
            avatarUrl: true,
            rating: true,
            totalReviews: true,
            isVerified: true,
            latitude: true,
            longitude: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      skip,
      take,
      orderBy: {
        provider: {
          rating: 'desc',
        },
      },
    });

    // Jika ada filter lokasi, filter service berdasarkan jarak
    let filteredServices = services;
    if (latitude && longitude) {
      // Filter provider yang ada dalam radius tertentu
      // Implementasi rumus Haversine untuk menghitung jarak antar dua titik latitude/longitude
      filteredServices = services.filter((service: any) => {
        if (!service.provider.latitude || !service.provider.longitude) {
          return false;
        }

        // Konversi ke radian
        const lat1 = (Number(latitude) * Math.PI) / 180;
        const lon1 = (Number(longitude) * Math.PI) / 180;
        const lat2 = (service.provider.latitude * Math.PI) / 180;
        const lon2 = (service.provider.longitude * Math.PI) / 180;

        // Rumus Haversine
        const dlon = lon2 - lon1;
        const dlat = lat2 - lat1;
        const a =
          Math.sin(dlat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;
        const c = 2 * Math.asin(Math.sqrt(a));
        const r = 6371; // Radius Bumi dalam km
        const distance = c * r;

        // Cek apakah dalam radius yang ditentukan
        return distance <= Number(radius);
      });
    }

    // Hitung total item yang sesuai filter (untuk pagination)
    const totalItems = filteredServices.length;
    const totalPages = Math.ceil(totalItems / Number(limit));

    return res.status(200).json({
      status: 'success',
      data: filteredServices,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalItems,
        totalPages,
      },
    });
  } catch (error) {
    logger.error(`Error in searchServices: ${error}`);
    return handleError(error, req, res, next);
  }
};

/**
 * Mendapatkan service dengan rating tertinggi
 */
export const getTopRatedServices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit = 10 } = req.query;

    // Ambil provider dengan rating tertinggi
    const topProviders = await prisma.serviceProvider.findMany({
      where: {
        isVerified: true,
        isAvailable: true,
        services: {
          some: {
            isActive: true,
          },
        },
      },
      orderBy: {
        rating: 'desc',
      },
      take: Number(limit),
    });

    // Ambil satu service dari masing-masing provider
    const topServices = await Promise.all(
      topProviders.map(async (provider: any) => {
        const service = await prisma.service.findFirst({
          where: {
            providerId: provider.id,
            isActive: true,
          },
          include: {
            provider: {
              select: {
                id: true,
                fullName: true,
                businessName: true,
                avatarUrl: true,
                rating: true,
                totalReviews: true,
                isVerified: true,
              },
            },
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });
        return service;
      })
    );

    // Filter null values (jika ada provider tanpa service aktif)
    const filteredServices = topServices.filter(Boolean);

    return res.status(200).json({
      status: 'success',
      data: filteredServices,
    });
  } catch (error) {
    logger.error(`Error in getTopRatedServices: ${error}`);
    return handleError(error, req, res, next);
  }
};
