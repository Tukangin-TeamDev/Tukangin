import { Router } from 'express';
import * as BookingController from '../controllers/bookingController';
import * as PaymentController from '../controllers/paymentController';
import * as MessageController from '../controllers/messageController';
import * as ReviewController from '../controllers/reviewController';
import * as DisputeController from '../controllers/disputeController';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validationMiddleware';
import { upload } from '../middleware/multerMiddleware';
import * as BookingSchema from '../schemas/bookingSchema';
import * as PaymentSchema from '../schemas/paymentSchema';
import * as MessageSchema from '../schemas/messageSchema';
import * as ReviewSchema from '../schemas/reviewSchema';
import * as DisputeSchema from '../schemas/disputeSchema';

const router = Router();

/**
 * Booking Routes
 */
// Membuat booking baru
router.post(
  '/',
  authenticate,
  authorize(['CUSTOMER']),
  validateRequest(BookingSchema.createBookingSchema),
  BookingController.createBooking
);

// Mendapatkan detail booking
router.get(
  '/:bookingId',
  authenticate,
  BookingController.getBookingDetails
);

// Mendapatkan semua booking user
router.get(
  '/',
  authenticate,
  BookingController.getUserBookings
);

// Update status booking
router.patch(
  '/:bookingId/status',
  authenticate,
  validateRequest(BookingSchema.updateBookingStatusSchema),
  BookingController.updateBookingStatus
);

// Membatalkan booking
router.post(
  '/:bookingId/cancel',
  authenticate,
  validateRequest(BookingSchema.cancelBookingSchema),
  BookingController.cancelBooking
);

// Membuat requote (perubahan harga) on-site
router.post(
  '/:bookingId/requote',
  authenticate,
  authorize(['PROVIDER']),
  validateRequest(BookingSchema.createRequoteSchema),
  BookingController.createRequote
);

// Merespon requote
router.patch(
  '/requote/:requoteId',
  authenticate,
  authorize(['CUSTOMER']),
  validateRequest(BookingSchema.respondRequoteSchema),
  BookingController.respondRequote
);

/**
 * Payment Routes
 */
// Mendapatkan detail pembayaran
router.get(
  '/payment/:paymentId',
  authenticate,
  PaymentController.getPaymentDetails
);

// Memproses pembayaran ke escrow
router.post(
  '/payment/:paymentId/process',
  authenticate,
  authorize(['CUSTOMER']),
  validateRequest(PaymentSchema.processPaymentSchema),
  PaymentController.processPayment
);

// Melepaskan dana escrow ke provider
router.post(
  '/payment/:paymentId/release',
  authenticate,
  PaymentController.releaseEscrow
);

// Refund pembayaran (admin)
router.post(
  '/payment/:paymentId/refund',
  authenticate,
  authorize(['ADMIN']),
  validateRequest(PaymentSchema.refundPaymentSchema),
  PaymentController.refundPayment
);

// Mendapatkan wallet dan riwayat transaksi
router.get(
  '/wallet',
  authenticate,
  PaymentController.getWallet
);

// Melakukan withdrawal dari wallet
router.post(
  '/wallet/withdraw',
  authenticate,
  authorize(['PROVIDER']),
  validateRequest(PaymentSchema.withdrawWalletSchema),
  PaymentController.withdrawWallet
);

// Memproses withdrawal (admin)
router.patch(
  '/transaction/:transactionId/process',
  authenticate,
  authorize(['ADMIN']),
  validateRequest(PaymentSchema.processWithdrawalSchema),
  PaymentController.processWithdrawal
);

/**
 * Message Routes
 */
// Mengirim pesan
router.post(
  '/message',
  authenticate,
  upload.single('attachment'),
  validateRequest(MessageSchema.sendMessageSchema),
  MessageController.sendMessage
);

// Mendapatkan semua pesan untuk booking tertentu
router.get(
  '/:bookingId/messages',
  authenticate,
  MessageController.getMessagesByBooking
);

// Mendapatkan jumlah pesan yang belum dibaca
router.get(
  '/messages/unread',
  authenticate,
  MessageController.getUnreadMessageCount
);

// Menandai pesan sebagai telah dibaca
router.patch(
  '/message/:messageId/read',
  authenticate,
  MessageController.markMessageAsRead
);

// Menandai semua pesan sebagai telah dibaca
router.patch(
  '/:bookingId/messages/read',
  authenticate,
  MessageController.markAllMessagesAsRead
);

// Melaporkan pesan
router.post(
  '/message/:messageId/report',
  authenticate,
  validateRequest(MessageSchema.reportMessageSchema),
  MessageController.reportMessage
);

/**
 * Review Routes
 */
// Membuat review
router.post(
  '/review',
  authenticate,
  authorize(['CUSTOMER']),
  validateRequest(ReviewSchema.createReviewSchema),
  ReviewController.createReview
);

// Mendapatkan review berdasarkan booking ID
router.get(
  '/:bookingId/review',
  authenticate,
  ReviewController.getReviewByBooking
);

// Mendapatkan semua review provider
router.get(
  '/provider/:providerId/reviews',
  ReviewController.getProviderReviews
);

// Merespon review
router.post(
  '/review/:reviewId/respond',
  authenticate,
  authorize(['PROVIDER']),
  validateRequest(ReviewSchema.respondToReviewSchema),
  ReviewController.respondToReview
);

// Melaporkan review
router.post(
  '/review/:reviewId/report',
  authenticate,
  validateRequest(ReviewSchema.reportReviewSchema),
  ReviewController.reportReview
);

// Menghapus review (admin)
router.delete(
  '/review/:reviewId',
  authenticate,
  authorize(['ADMIN']),
  validateRequest(ReviewSchema.deleteReviewSchema),
  ReviewController.deleteReview
);

/**
 * Dispute Routes
 */
// Membuat dispute/tiket
router.post(
  '/dispute',
  authenticate,
  upload.array('attachments', 5),
  validateRequest(DisputeSchema.createDisputeSchema),
  DisputeController.createDispute
);

// Mendapatkan dispute berdasarkan booking ID
router.get(
  '/:bookingId/dispute',
  authenticate,
  DisputeController.getDisputeByBooking
);

// Mendapatkan semua dispute (admin)
router.get(
  '/disputes',
  authenticate,
  authorize(['ADMIN']),
  DisputeController.getAllDisputes
);

// Mendapatkan dispute berdasarkan user
router.get(
  '/disputes/user',
  authenticate,
  DisputeController.getUserDisputes
);

// Menyelesaikan dispute (admin)
router.patch(
  '/dispute/:disputeId/resolve',
  authenticate,
  authorize(['ADMIN']),
  validateRequest(DisputeSchema.resolveDisputeSchema),
  DisputeController.resolveDispute
);

// Menambahkan attachment ke dispute
router.post(
  '/dispute/:disputeId/attachment',
  authenticate,
  upload.single('file'),
  DisputeController.addDisputeAttachment
);

export default router; 