import { Router } from 'express';
import * as reviewController from './review.controller';
import { validateRequest } from '../../middleware/validation.middleware';
import { authenticate } from '../../middleware/auth.middleware';
import { checkRole } from '../../middleware/rbac.middleware';
import { UserRole } from '@prisma/client';
import { auditLog } from '../../middleware/audit.middleware';
import {
  createReviewSchema,
  getReviewByIdSchema,
  getReviewByOrderIdSchema,
  getReviewsByProviderIdSchema,
  deleteReviewSchema,
} from './review.validator';

const router = Router();

/**
 * @route POST /api/reviews
 * @desc Membuat ulasan baru
 * @access Private (Customer)
 */
router.post(
  '/',
  authenticate,
  checkRole([UserRole.CUSTOMER]),
  validateRequest(createReviewSchema),
  auditLog('REVIEW_CREATE', (req) => ({ orderId: req.body.orderId })),
  reviewController.createReview
);

/**
 * @route GET /api/reviews/:id
 * @desc Mendapatkan ulasan berdasarkan ID
 * @access Public
 */
router.get(
  '/:id',
  validateRequest(getReviewByIdSchema),
  reviewController.getReviewById
);

/**
 * @route GET /api/reviews/order/:orderId
 * @desc Mendapatkan ulasan berdasarkan Order ID
 * @access Public
 */
router.get(
  '/order/:orderId',
  validateRequest(getReviewByOrderIdSchema),
  reviewController.getReviewByOrderId
);

/**
 * @route GET /api/reviews/provider/:providerId
 * @desc Mendapatkan semua ulasan untuk provider
 * @access Public
 */
router.get(
  '/provider/:providerId',
  validateRequest(getReviewsByProviderIdSchema),
  reviewController.getReviewsByProviderId
);

/**
 * @route DELETE /api/reviews/:id
 * @desc Menghapus ulasan (admin only)
 * @access Private (Admin)
 */
router.delete(
  '/:id',
  authenticate,
  checkRole([UserRole.ADMIN]),
  validateRequest(deleteReviewSchema),
  auditLog('REVIEW_DELETE', (req) => ({ reviewId: req.params.id })),
  reviewController.deleteReview
);

export default router;
