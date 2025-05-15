import { Request, Response } from 'express';
import * as providerService from '../../services/provider.service';
import { createAdminAuditLog } from '../../middleware/audit.middleware';
// import { AppError } from '../../middleware/error.middleware'; // Tidak digunakan
import { ApiResponse } from '../../types/common.types';
import { ProviderProfileDto } from '../../types/user.types';
import { CreateServiceDto, ServiceResponseDto, ServiceType } from '../../types/service.types';

/**
 * @desc    Mendapatkan detail provider berdasarkan ID user
 * @route   GET /api/providers/user/:userId
 * @access  Public
 */
export const getProviderByUserId = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'ID user tidak valid',
      };
      return res.status(400).json(response);
    }

    const providerProfile = await providerService.getProviderProfileByUserId(userId);

    if (!providerProfile) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Profil provider tidak ditemukan',
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<ProviderProfileDto> = {
      success: true,
      data: providerProfile,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error getting provider by user ID:', error);

    const response: ApiResponse<null> = {
      success: false,
      error: 'Terjadi kesalahan saat mengambil data provider',
    };

    return res.status(500).json(response);
  }
};

/**
 * @desc    Mendapatkan detail provider berdasarkan ID provider
 * @route   GET /api/providers/:id
 * @access  Public
 */
export const getProviderById = async (req: Request, res: Response) => {
  try {
    const providerId = parseInt(req.params.id);

    if (isNaN(providerId)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'ID provider tidak valid',
      };
      return res.status(400).json(response);
    }

    const providerProfile = await providerService.getProviderProfileById(providerId);

    if (!providerProfile) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Provider tidak ditemukan',
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<ProviderProfileDto> = {
      success: true,
      data: providerProfile,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error getting provider by ID:', error);

    const response: ApiResponse<null> = {
      success: false,
      error: 'Terjadi kesalahan saat mengambil data provider',
    };

    return res.status(500).json(response);
  }
};

/**
 * @desc    Membuat atau memperbarui profil provider
 * @route   POST /api/providers
 * @access  Private (Provider)
 */
export const updateProviderProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Tidak terautentikasi',
      };
      return res.status(401).json(response);
    }

    const userId = req.user.id;
    const { about, portfolio } = req.body;

    const updatedProfile = await providerService.upsertProviderProfile(userId, {
      about,
      portfolio,
    });

    // Tambahkan log audit
    await createAdminAuditLog('PROVIDER_PROFILE_UPDATED', { userId }, userId);

    const response: ApiResponse<ProviderProfileDto> = {
      success: true,
      data: updatedProfile,
      message: 'Profil provider berhasil diperbarui',
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error updating provider profile:', error);

    const response: ApiResponse<null> = {
      success: false,
      error: 'Terjadi kesalahan saat memperbarui profil provider',
    };

    return res.status(500).json(response);
  }
};

/**
 * @desc    Mendapatkan daftar semua provider dengan paginasi dan filter
 * @route   GET /api/providers
 * @access  Public
 */
export const getProviders = async (req: Request, res: Response) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const verified = req.query.verified ? req.query.verified === 'true' : undefined;
    const search = req.query.search as string | undefined;

    const { providers, meta } = await providerService.getProviders(page, limit, verified, search);

    const response: ApiResponse<typeof providers> = {
      success: true,
      data: providers,
      meta,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error getting providers:', error);

    const response: ApiResponse<null> = {
      success: false,
      error: 'Terjadi kesalahan saat mengambil daftar provider',
    };

    return res.status(500).json(response);
  }
};

/**
 * @desc    Verifikasi provider (khusus admin)
 * @route   PUT /api/providers/:id/verify
 * @access  Private (Admin)
 */
export const verifyProvider = async (req: Request, res: Response) => {
  try {
    const providerId = parseInt(req.params.id);
    const { verified } = req.body;

    if (isNaN(providerId)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'ID provider tidak valid',
      };
      return res.status(400).json(response);
    }

    if (typeof verified !== 'boolean') {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Status verifikasi harus berupa boolean',
      };
      return res.status(400).json(response);
    }

    const updatedProfile = await providerService.verifyProvider(providerId, verified);

    // Tambahkan log audit
    if (req.user) {
      await createAdminAuditLog(
        verified ? 'PROVIDER_VERIFIED' : 'PROVIDER_UNVERIFIED',
        { providerId },
        req.user.id
      );
    }

    const response: ApiResponse<ProviderProfileDto> = {
      success: true,
      data: updatedProfile,
      message: verified ? 'Provider berhasil diverifikasi' : 'Verifikasi provider dibatalkan',
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error verifying provider:', error);

    const response: ApiResponse<null> = {
      success: false,
      error: 'Terjadi kesalahan saat memverifikasi provider',
    };

    return res.status(500).json(response);
  }
};

// ================ SERVICE CONTROLLERS ================

/**
 * @desc    Membuat layanan baru
 * @route   POST /api/services
 * @access  Private (Provider)
 */
export const createService = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Tidak terautentikasi',
      };
      return res.status(401).json(response);
    }

    const serviceData: CreateServiceDto = req.body;

    // Buat layanan baru
    const service = await providerService.createService(serviceData);

    // Tambahkan log audit
    await createAdminAuditLog('SERVICE_CREATED', { serviceId: service.id }, req.user.id);

    const response: ApiResponse<ServiceResponseDto> = {
      success: true,
      data: service,
      message: 'Layanan berhasil dibuat',
    };

    return res.status(201).json(response);
  } catch (error) {
    console.error('Error creating service:', error);

    // Handling specific errors
    if (error instanceof Error) {
      if (error.message === 'Provider tidak ditemukan') {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      } else if (error.message === 'Harga harus diisi untuk layanan dengan tipe fixed') {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }
    }

    const response: ApiResponse<null> = {
      success: false,
      error: 'Terjadi kesalahan saat membuat layanan',
    };

    return res.status(500).json(response);
  }
};

/**
 * @desc    Mendapatkan detail layanan berdasarkan ID
 * @route   GET /api/services/:id
 * @access  Public
 */
export const getServiceById = async (req: Request, res: Response) => {
  try {
    const serviceId = parseInt(req.params.id);

    if (isNaN(serviceId)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'ID layanan tidak valid',
      };
      return res.status(400).json(response);
    }

    const service = await providerService.getServiceById(serviceId);

    if (!service) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Layanan tidak ditemukan',
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<ServiceResponseDto> = {
      success: true,
      data: service,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error getting service by ID:', error);

    const response: ApiResponse<null> = {
      success: false,
      error: 'Terjadi kesalahan saat mengambil data layanan',
    };

    return res.status(500).json(response);
  }
};

/**
 * @desc    Memperbarui layanan
 * @route   PUT /api/services/:id
 * @access  Private (Provider yang memiliki layanan)
 */
export const updateService = async (req: Request, res: Response) => {
  try {
    const serviceId = parseInt(req.params.id);

    if (isNaN(serviceId)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'ID layanan tidak valid',
      };
      return res.status(400).json(response);
    }

    // Update layanan
    const updatedService = await providerService.updateService(serviceId, req.body);

    // Tambahkan log audit
    if (req.user) {
      await createAdminAuditLog('SERVICE_UPDATED', { serviceId }, req.user.id);
    }

    const response: ApiResponse<ServiceResponseDto> = {
      success: true,
      data: updatedService,
      message: 'Layanan berhasil diperbarui',
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error updating service:', error);

    // Handling specific errors
    if (error instanceof Error) {
      if (error.message === 'Layanan tidak ditemukan') {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      } else if (error.message === 'Harga harus diisi untuk layanan dengan tipe fixed') {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }
    }

    const response: ApiResponse<null> = {
      success: false,
      error: 'Terjadi kesalahan saat memperbarui layanan',
    };

    return res.status(500).json(response);
  }
};

/**
 * @desc    Menghapus layanan
 * @route   DELETE /api/services/:id
 * @access  Private (Provider yang memiliki layanan)
 */
export const deleteService = async (req: Request, res: Response) => {
  try {
    const serviceId = parseInt(req.params.id);

    if (isNaN(serviceId)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'ID layanan tidak valid',
      };
      return res.status(400).json(response);
    }

    // Hapus layanan
    await providerService.deleteService(serviceId);

    // Tambahkan log audit
    if (req.user) {
      await createAdminAuditLog('SERVICE_DELETED', { serviceId }, req.user.id);
    }

    const response: ApiResponse<null> = {
      success: true,
      message: 'Layanan berhasil dihapus',
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error deleting service:', error);

    // Handling specific errors
    if (error instanceof Error) {
      if (error.message === 'Layanan tidak ditemukan') {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      } else if (error.message === 'Layanan tidak dapat dihapus karena memiliki order terkait') {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }
    }

    const response: ApiResponse<null> = {
      success: false,
      error: 'Terjadi kesalahan saat menghapus layanan',
    };

    return res.status(500).json(response);
  }
};

/**
 * @desc    Mendapatkan daftar layanan dengan filter
 * @route   GET /api/services
 * @access  Public
 */
export const getServices = async (req: Request, res: Response) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const serviceType = req.query.type as ServiceType | undefined;
    const providerId = req.query.providerId ? parseInt(req.query.providerId as string) : undefined;
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined;
    const search = req.query.search as string | undefined;

    const filter = {
      serviceType,
      providerId,
      minPrice,
      maxPrice,
      search,
      page,
      limit,
    };

    const { services, meta } = await providerService.getServices(filter);

    const response: ApiResponse<typeof services> = {
      success: true,
      data: services,
      meta,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error getting services:', error);

    const response: ApiResponse<null> = {
      success: false,
      error: 'Terjadi kesalahan saat mengambil daftar layanan',
    };

    return res.status(500).json(response);
  }
};
