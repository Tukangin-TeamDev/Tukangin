import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import bookingRoutes from './bookingRoutes';
import serviceRoutes from './serviceRoutes';
import categoryRoutes from './categoryRoutes';
import promoRoutes from './promoRoutes';
import providerRoutes from './providerRoutes';
import disputeRoutes from './disputeRoutes';
import invoiceRoutes from './invoiceRoutes';
import loyaltyRoutes from './loyaltyRoutes';
import messageRoutes from './messageRoutes';
import paymentRoutes from './paymentRoutes';
import reviewRoutes from './reviewRoutes';
import trackingRoutes from './trackingRoutes';

const router = Router();

// API health check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is healthy and running',
  });
});

// Set up API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/bookings', bookingRoutes);
router.use('/services', serviceRoutes);
router.use('/categories', categoryRoutes);
router.use('/promos', promoRoutes);
router.use('/providers', providerRoutes);
router.use('/disputes', disputeRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/loyalties', loyaltyRoutes);
router.use('/messages', messageRoutes);
router.use('/payments', paymentRoutes);
router.use('/reviews', reviewRoutes);
router.use('/tracking', trackingRoutes);

export default router;
