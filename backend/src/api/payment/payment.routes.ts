import { Router } from 'express';
import * as paymentController from './payment.controller';
import { validateRequest } from '../../middleware/validation.middleware';
import { authenticate } from '../../middleware/auth.middleware';
import { checkRole } from '../../middleware/rbac.middleware';
import { UserRole } from '@prisma/client';
import { auditLog } from '../../middleware/audit.middleware';
import {
  initiatePaymentSchema,
  processPaymentSchema,
  releaseEscrowSchema,
  refundPaymentSchema,
  getPaymentByIdSchema,
  getPaymentByOrderIdSchema,
} from './payment.validator';

const router = Router();

/**
 * @route POST /api/payment/initiate
 * @desc Inisiasi pembayaran untuk order
 * @access Private (Customer)
 */
router.post(
  '/initiate',
  authenticate,
  checkRole([UserRole.CUSTOMER, UserRole.ADMIN]),
  validateRequest(initiatePaymentSchema),
  auditLog('PAYMENT_INITIATE', req => ({ orderId: req.body.orderId })),
  paymentController.initiatePayment
);

/**
 * @route POST /api/payment/process
 * @desc Proses pembayaran setelah konfirmasi dari gateway pembayaran
 * @access Private (Admin, Payment Gateway Webhook)
 */
router.post(
  '/process',
  // Ini bisa menjadi endpoint webhook dari payment gateway, jadi tidak selalu perlu authenticate
  // atau bisa menggunakan token khusus untuk payment gateway
  validateRequest(processPaymentSchema),
  auditLog('PAYMENT_PROCESS', req => ({ paymentId: req.body.paymentId })),
  paymentController.processPayment
);

/**
 * @route POST /api/payment/release-escrow/:orderId
 * @desc Proses rilis dana escrow setelah order selesai
 * @access Private (Admin)
 */
router.post(
  '/release-escrow/:orderId',
  authenticate,
  checkRole([UserRole.ADMIN]),
  validateRequest(releaseEscrowSchema),
  auditLog('ESCROW_RELEASE', req => ({ orderId: req.params.orderId })),
  paymentController.releaseEscrow
);

/**
 * @route POST /api/payment/refund/:orderId
 * @desc Refund pembayaran jika terjadi pembatalan
 * @access Private (Admin)
 */
router.post(
  '/refund/:orderId',
  authenticate,
  checkRole([UserRole.ADMIN]),
  validateRequest(refundPaymentSchema),
  auditLog('PAYMENT_REFUND', req => ({ orderId: req.params.orderId })),
  paymentController.refundPayment
);

/**
 * @route GET /api/payment/:id
 * @desc Mendapatkan detail pembayaran berdasarkan ID
 * @access Private
 */
router.get(
  '/:id',
  authenticate,
  validateRequest(getPaymentByIdSchema),
  paymentController.getPaymentById
);

/**
 * @route GET /api/payment/order/:orderId
 * @desc Mendapatkan pembayaran berdasarkan Order ID
 * @access Private
 */
router.get(
  '/order/:orderId',
  authenticate,
  validateRequest(getPaymentByOrderIdSchema),
  paymentController.getPaymentByOrderId
);

export default router;
