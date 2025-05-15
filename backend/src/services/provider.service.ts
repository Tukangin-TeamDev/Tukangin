import prisma from '../config/prisma';
import { ProviderProfileDto } from '../types/user.types';
import {
  CreateServiceDto,
  UpdateServiceDto,
  ServiceResponseDto,
  ServiceFilterDto,
  ServiceType,
} from '../types/service.types';

// Definisikan interface untuk provider yang di-map untuk return
interface ProviderResponseDto {
  id: number;
  userId: number;
  name: string;
  email: string;
  phone: string | null;
  about: string | null;
  portfolio: string | null;
  rating: number;
  verified: boolean;
  servicesCount: number;
  ordersCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Definisikan interface untuk service yang di-map untuk return
interface ServiceListItemDto {
  id: number;
  providerId: number;
  providerName: string;
  providerRating: number;
  name: string;
  description: string;
  serviceType: ServiceType;
  fixedPrice: number | null;
  media: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mendapatkan profil provider berdasarkan ID user
 */
export const getProviderProfileByUserId = async (
  userId: number
): Promise<ProviderProfileDto | null> => {
  const providerProfile = await prisma.providerProfile.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
    },
  });

  if (!providerProfile) {
    return null;
  }

  return {
    userId: providerProfile.userId,
    about: providerProfile.about || undefined,
    portfolio: providerProfile.portfolio || undefined,
    verified: providerProfile.verified,
  };
};

/**
 * Mendapatkan profil provider berdasarkan ID provider
 */
export const getProviderProfileById = async (id: number): Promise<ProviderProfileDto | null> => {
  const providerProfile = await prisma.providerProfile.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
    },
  });

  if (!providerProfile) {
    return null;
  }

  return {
    userId: providerProfile.userId,
    about: providerProfile.about || undefined,
    portfolio: providerProfile.portfolio || undefined,
    verified: providerProfile.verified,
  };
};

/**
 * Buat atau perbarui profil provider
 */
export const upsertProviderProfile = async (
  userId: number,
  data: Partial<ProviderProfileDto>
): Promise<ProviderProfileDto> => {
  // Check jika user sudah memiliki profil provider (tidak perlu disimpan ke variabel)
  await prisma.providerProfile.findUnique({
    where: { userId },
  });

  // Buat atau perbarui profil provider
  const providerProfile = await prisma.providerProfile.upsert({
    where: { userId },
    create: {
      userId,
      about: data.about || '',
      portfolio: data.portfolio || '',
      verified: data.verified || false,
    },
    update: {
      about: data.about,
      portfolio: data.portfolio,
      verified: data.verified,
    },
  });

  return {
    userId: providerProfile.userId,
    about: providerProfile.about || undefined,
    portfolio: providerProfile.portfolio || undefined,
    verified: providerProfile.verified,
  };
};

/**
 * Mendapatkan daftar provider dengan paginasi dan filter
 */
export const getProviders = async (
  page: number = 1,
  limit: number = 10,
  verified?: boolean,
  search?: string
): Promise<{
  providers: ProviderResponseDto[];
  meta: { page: number; limit: number; totalItems: number; totalPages: number };
}> => {
  const skip = (page - 1) * limit;

  const where: any = {};

  if (verified !== undefined) {
    where.verified = verified;
  }

  if (search) {
    where.OR = [
      { user: { name: { contains: search, mode: 'insensitive' } } },
      { user: { email: { contains: search, mode: 'insensitive' } } },
      { about: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [providers, total] = await Promise.all([
    prisma.providerProfile.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        services: {
          select: {
            id: true,
            name: true,
            serviceType: true,
          },
        },
        _count: {
          select: {
            services: true,
            providerOrders: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.providerProfile.count({ where }),
  ]);

  return {
    providers: providers.map((provider: any) => ({
      id: provider.id,
      userId: provider.userId,
      name: provider.user.name,
      email: provider.user.email,
      phone: provider.user.phone,
      about: provider.about,
      portfolio: provider.portfolio,
      rating: provider.rating,
      verified: provider.verified,
      servicesCount: provider._count.services,
      ordersCount: provider._count.providerOrders,
      createdAt: provider.createdAt,
      updatedAt: provider.updatedAt,
    })),
    meta: {
      page,
      limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Verifikasi provider (hanya admin)
 */
export const verifyProvider = async (
  providerId: number,
  isVerified: boolean
): Promise<ProviderProfileDto> => {
  const providerProfile = await prisma.providerProfile.update({
    where: { id: providerId },
    data: { verified: isVerified },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
    },
  });

  return {
    userId: providerProfile.userId,
    about: providerProfile.about || undefined,
    portfolio: providerProfile.portfolio || undefined,
    verified: providerProfile.verified,
  };
};

// ================ SERVICE OPERATIONS ================

/**
 * Membuat layanan baru
 */
export const createService = async (data: CreateServiceDto): Promise<ServiceResponseDto> => {
  // Cek apakah provider dengan ID tersebut ada
  const providerProfile = await prisma.providerProfile.findUnique({
    where: { id: data.providerId },
  });

  if (!providerProfile) {
    throw new Error('Provider tidak ditemukan');
  }

  // Validasi harga untuk layanan fixed-price
  if (data.serviceType === ServiceType.FIXED && !data.fixedPrice) {
    throw new Error('Harga harus diisi untuk layanan dengan tipe fixed');
  }

  // Buat layanan baru
  const service = await prisma.service.create({
    data: {
      providerId: data.providerId,
      name: data.name,
      description: data.description,
      serviceType: data.serviceType,
      fixedPrice: data.fixedPrice,
      media: data.media,
    },
  });

  return {
    id: service.id,
    providerId: service.providerId,
    name: service.name,
    description: service.description,
    serviceType: service.serviceType as ServiceType,
    fixedPrice: service.fixedPrice || undefined,
    media: service.media || undefined,
    createdAt: service.createdAt,
    updatedAt: service.updatedAt,
  };
};

/**
 * Mendapatkan layanan berdasarkan ID
 */
export const getServiceById = async (id: number): Promise<ServiceResponseDto | null> => {
  const service = await prisma.service.findUnique({
    where: { id },
    include: {
      providerProfile: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      },
    },
  });

  if (!service) {
    return null;
  }

  return {
    id: service.id,
    providerId: service.providerId,
    providerName: service.providerProfile.user.name,
    name: service.name,
    description: service.description,
    serviceType: service.serviceType as ServiceType,
    fixedPrice: service.fixedPrice || undefined,
    media: service.media || undefined,
    createdAt: service.createdAt,
    updatedAt: service.updatedAt,
  };
};

/**
 * Memperbarui layanan
 */
export const updateService = async (
  id: number,
  data: UpdateServiceDto
): Promise<ServiceResponseDto> => {
  // Cek apakah layanan dengan ID tersebut ada
  const existingService = await prisma.service.findUnique({
    where: { id },
  });

  if (!existingService) {
    throw new Error('Layanan tidak ditemukan');
  }

  // Validasi harga untuk layanan fixed-price
  if (data.serviceType === ServiceType.FIXED && !data.fixedPrice) {
    throw new Error('Harga harus diisi untuk layanan dengan tipe fixed');
  }

  // Update layanan
  const service = await prisma.service.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      serviceType: data.serviceType,
      fixedPrice: data.fixedPrice,
      media: data.media,
    },
  });

  return {
    id: service.id,
    providerId: service.providerId,
    name: service.name,
    description: service.description,
    serviceType: service.serviceType as ServiceType,
    fixedPrice: service.fixedPrice || undefined,
    media: service.media || undefined,
    createdAt: service.createdAt,
    updatedAt: service.updatedAt,
  };
};

/**
 * Menghapus layanan
 */
export const deleteService = async (id: number): Promise<void> => {
  // Cek apakah layanan dengan ID tersebut ada
  const existingService = await prisma.service.findUnique({
    where: { id },
    include: {
      orders: true,
    },
  });

  if (!existingService) {
    throw new Error('Layanan tidak ditemukan');
  }

  // Cek apakah layanan memiliki order
  if (existingService.orders.length > 0) {
    throw new Error('Layanan tidak dapat dihapus karena memiliki order terkait');
  }

  // Hapus layanan
  await prisma.service.delete({
    where: { id },
  });
};

/**
 * Mendapatkan daftar layanan dengan filter dan paginasi
 */
export const getServices = async (
  filter: ServiceFilterDto
): Promise<{
  services: ServiceListItemDto[];
  meta: { page: number; limit: number; totalItems: number; totalPages: number };
}> => {
  const { serviceType, search, providerId, page = 1, limit = 10 } = filter;

  const skip = (page - 1) * limit;

  const where: any = {};

  if (serviceType) {
    where.serviceType = serviceType;
  }

  if (providerId) {
    where.providerId = providerId;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [services, total] = await Promise.all([
    prisma.service.findMany({
      where,
      include: {
        providerProfile: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      skip,
      take: limit,
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.service.count({ where }),
  ]);

  return {
    services: services.map(service => ({
      id: service.id,
      providerId: service.providerId,
      providerName: service.providerProfile.user.name,
      providerRating: service.providerProfile.rating,
      name: service.name,
      description: service.description,
      serviceType: service.serviceType as ServiceType,
      fixedPrice: service.fixedPrice,
      media: service.media,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    })),
    meta: {
      page,
      limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
