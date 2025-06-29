import { Router } from 'express';
import * as ServiceController from '../controllers/serviceController';
import { authMiddleware as authenticate, authorize } from '../middleware/authMiddleware';
import * as ServiceSchema from '../schemas/serviceSchema';

// Function untuk validasi request menggunakan schema zod
const validateRequest = (schema: any) => {
  return (req: any, res: any, next: any) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      next(error);
    }
  };
};

const router = Router();

/**
 * Service Routes - untuk Provider (teknisi/tukang)
 */
// Mendapatkan semua service yang dimiliki provider
router.get('/provider', authenticate, authorize(['PROVIDER']), ServiceController.getProviderServices);

// Mendapatkan service provider berdasarkan id service
router.get('/:serviceId', ServiceController.getServiceById);

// Menambah service baru
router.post(
  '/',
  authenticate,
  authorize(['PROVIDER']),
  validateRequest(ServiceSchema.createServiceSchema),
  ServiceController.createService
);

// Mengubah service yang sudah ada
router.patch(
  '/:serviceId',
  authenticate,
  authorize(['PROVIDER']),
  validateRequest(ServiceSchema.updateServiceSchema),
  ServiceController.updateService
);

// Menghapus/menonaktifkan service
router.delete('/:serviceId', authenticate, authorize(['PROVIDER']), ServiceController.deleteService);

// Mengaktifkan service
router.patch(
  '/:serviceId/activate',
  authenticate,
  authorize(['PROVIDER']),
  ServiceController.activateService
);

// Mencari service berdasarkan kategori dan/atau lokasi
router.get('/search', ServiceController.searchServices);

// Mendapatkan service dengan rating tertinggi
router.get('/top-rated', ServiceController.getTopRatedServices);

export default router;
