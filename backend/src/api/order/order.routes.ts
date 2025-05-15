import express from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { checkRole } from '../../middleware/rbac.middleware';
import { validateRequest } from '../../middleware/validation.middleware';
import { ApiResponse } from '../../types/common.types';
import { createOrderSchema, createDisputeSchema } from '../../utils/validators';
import { UserRole } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import * as orderController from '../order/order.controller';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * Middleware untuk memeriksa kepemilikan order
 * Hanya customer yang membuat order, provider yang menerima order, atau admin yang bisa mengakses
 */
const checkOrderOwnership = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const orderId = parseInt(req.params.id);
    const user = req.user;

    if (!user || isNaN(orderId)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Akses ditolak atau ID order tidak valid',
      };
      return res.status(403).json(response);
    }

    // Admin selalu memiliki akses
    if (user.role === UserRole.ADMIN) {
      return next();
    }

    // Cek order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Order tidak ditemukan',
      };
      return res.status(404).json(response);
    }

    // Periksa apakah user adalah customer atau provider dari order ini
    if (order.customerId === user.id) {
      // User adalah customer dari order ini
      return next();
    }

    // Periksa apakah user adalah provider dari order ini
    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId: user.id },
    });

    if (providerProfile && order.providerId === providerProfile.id) {
      // User adalah provider dari order ini
      return next();
    }

    // Jika tidak memiliki akses
    const response: ApiResponse<null> = {
      success: false,
      error: 'Anda tidak memiliki akses ke order ini',
    };
    return res.status(403).json(response);
  } catch (error) {
    console.error('Error checking order ownership:', error);

    const response: ApiResponse<null> = {
      success: false,
      error: 'Terjadi kesalahan saat memeriksa kepemilikan order',
    };
    return res.status(500).json(response);
  }
};

/**
 * @route GET /api/orders
 * @desc Mendapatkan daftar order dengan filter
 * @access Private (dengan filter berdasarkan peran)
 */
router.get('/', authenticate, orderController.getOrders);

/**
 * @route GET /api/orders/:id
 * @desc Mendapatkan detail order berdasarkan ID
 * @access Private (hanya customer, provider terkait, atau admin)
 */
router.get('/:id', authenticate, checkOrderOwnership, orderController.getOrderById);

/**
 * @route POST /api/orders
 * @desc Membuat order baru (fixed atau konsultatif)
 * @access Private (customer)
 */
router.post(
  '/',
  authenticate,
  checkRole([UserRole.CUSTOMER]),
  validateRequest(createOrderSchema),
  orderController.createOrder
);

/**
 * @route PUT /api/orders/:id/confirm
 * @desc Konfirmasi order selesai (trigger release escrow)
 * @access Private (hanya customer yang membuat order)
 */
router.put(
  '/:id/confirm',
  authenticate,
  checkRole([UserRole.CUSTOMER]),
  orderController.confirmOrder
);

/**
 * @route POST /api/orders/:id/dispute
 * @desc Buat dispute untuk order
 * @access Private (customer yang membuat order)
 */
router.post(
  '/:id/dispute',
  authenticate,
  checkRole([UserRole.CUSTOMER]),
  validateRequest(createDisputeSchema),
  orderController.createDispute
);

export default router;
