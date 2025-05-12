import { Router } from 'express';
import * as providerController from '../provider/provider.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { checkRole } from '../../middleware/rbac.middleware';
import { UserRole } from '../../types/user.types';
import { validateRequest } from '../../middleware/validation.middleware';
import { createServiceSchema, updateServiceSchema } from '../../utils/validators';
import prisma from '../../config/prisma';
import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../../types/common.types';

const router = Router();

/**
 * Middleware untuk memeriksa kepemilikan layanan
 * Hanya pemilik layanan (provider) atau admin yang bisa mengakses/memodifikasi layanan
 */
const checkServiceOwnership = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Pastikan user sudah login
    if (!req.user) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Tidak terautentikasi',
      };
      return res.status(401).json(response);
    }

    // Admin dapat mengakses semua layanan
    if (req.user.role === UserRole.ADMIN) {
      return next();
    }

    const serviceId = parseInt(req.params.id);
    
    if (isNaN(serviceId)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'ID layanan tidak valid',
      };
      return res.status(400).json(response);
    }

    // Cari layanan dan provider profile
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        providerProfile: true
      }
    });

    if (!service) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Layanan tidak ditemukan',
      };
      return res.status(404).json(response);
    }

    // Cari provider profile berdasarkan user ID
    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId: req.user.id }
    });

    if (!providerProfile) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Anda bukan provider',
      };
      return res.status(403).json(response);
    }

    // Periksa apakah provider adalah pemilik layanan
    if (service.providerId !== providerProfile.id) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Anda tidak memiliki akses ke layanan ini',
      };
      return res.status(403).json(response);
    }

    next();
  } catch (error) {
    console.error('Error checking service ownership:', error);
    
    const response: ApiResponse<null> = {
      success: false,
      error: 'Terjadi kesalahan saat memeriksa kepemilikan layanan',
    };
    
    return res.status(500).json(response);
  }
};

/**
 * @route GET /api/services
 * @desc Mendapatkan daftar semua layanan (fixed & konsultatif) dengan filter
 * @access Public
 */
router.get('/', providerController.getServices);

/**
 * @route GET /api/services/:id
 * @desc Mendapatkan detail layanan berdasarkan ID
 * @access Public
 */
router.get('/:id', providerController.getServiceById);

/**
 * @route POST /api/services
 * @desc Provider menambahkan layanan baru
 * @access Private (Provider)
 */
router.post(
  '/',
  authenticate,
  checkRole([UserRole.PROVIDER]),
  validateRequest(createServiceSchema),
  providerController.createService
);

/**
 * @route PUT /api/services/:id
 * @desc Memperbarui layanan
 * @access Private (Provider yang memiliki layanan)
 */
router.put(
  '/:id',
  authenticate,
  checkRole([UserRole.PROVIDER, UserRole.ADMIN]),
  checkServiceOwnership,
  validateRequest(updateServiceSchema),
  providerController.updateService
);

/**
 * @route DELETE /api/services/:id
 * @desc Menghapus layanan 
 * @access Private (Provider yang memiliki layanan atau Admin)
 */
router.delete(
  '/:id',
  authenticate,
  checkRole([UserRole.PROVIDER, UserRole.ADMIN]),
  checkServiceOwnership,
  providerController.deleteService
);

export default router; 