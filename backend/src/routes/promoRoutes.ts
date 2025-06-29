import { Router } from 'express';
import * as PromoController from '../controllers/promoController';
import * as LoyaltyController from '../controllers/loyaltyController';
import { authMiddleware as authenticate, authorize } from '../middleware/authMiddleware';
import * as PromoSchema from '../schemas/promoSchema';
import { Role } from '@prisma/client';

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
 * Promo Routes
 */
// Mendapatkan semua promo yang aktif
router.get('/', PromoController.getActivePromos);

// Mendapatkan promo berdasarkan id
router.get('/:promoId', authenticate, PromoController.getPromoById);

// Membuat promo baru (admin only)
router.post(
  '/',
  authenticate,
  authorize([Role.ADMIN]),
  validateRequest(PromoSchema.createPromoSchema),
  PromoController.createPromo
);

// Mengupdate promo (admin only)
router.patch(
  '/:promoId',
  authenticate,
  authorize([Role.ADMIN]),
  validateRequest(PromoSchema.updatePromoSchema),
  PromoController.updatePromo
);

// Menghapus promo (admin only)
router.delete('/:promoId', authenticate, authorize([Role.ADMIN]), PromoController.deletePromo);

// Mengaktifkan promo (admin only)
router.patch(
  '/:promoId/activate',
  authenticate,
  authorize([Role.ADMIN]),
  PromoController.activatePromo
);

// Menonaktifkan promo (admin only)
router.patch(
  '/:promoId/deactivate',
  authenticate,
  authorize([Role.ADMIN]),
  PromoController.deactivatePromo
);

// Memvalidasi kode promo
router.post(
  '/validate',
  authenticate,
  validateRequest(PromoSchema.validatePromoSchema),
  PromoController.validatePromoCode
);

/**
 * Loyalty Points Routes
 */
// Mendapatkan loyalty point customer
router.get(
  '/loyalty/points',
  authenticate,
  authorize([Role.CUSTOMER]),
  LoyaltyController.getCustomerLoyaltyPoints
);

// Menukarkan loyalty points untuk voucher
router.post(
  '/loyalty/redeem',
  authenticate,
  authorize([Role.CUSTOMER]),
  validateRequest(PromoSchema.redeemLoyaltySchema),
  LoyaltyController.redeemLoyaltyPoints
);

// Mendapatkan history redeem loyalty points
router.get(
  '/loyalty/history',
  authenticate,
  authorize([Role.CUSTOMER]),
  LoyaltyController.getLoyaltyHistory
);

export default router;
