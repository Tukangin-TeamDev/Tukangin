import express from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import providerRoutes from './providerRoutes';
import customerRoutes from './customerRoutes';
import adminRoutes from './adminRoutes';
import bookingRoutes from './bookingRoutes';
import serviceRoutes from './serviceRoutes';
import categoryRoutes from './categoryRoutes';
import paymentRoutes from './paymentRoutes';
import notificationRoutes from './notificationRoutes';
import reviewRoutes from './reviewRoutes';
import disputeRoutes from './disputeRoutes';
import chatRoutes from './chatRoutes';

const router = express.Router();

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Mount all routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/providers', providerRoutes);
router.use('/customers', customerRoutes);
router.use('/admin', adminRoutes);
router.use('/bookings', bookingRoutes);
router.use('/services', serviceRoutes);
router.use('/categories', categoryRoutes);
router.use('/payments', paymentRoutes);
router.use('/notifications', notificationRoutes);
router.use('/reviews', reviewRoutes);
router.use('/disputes', disputeRoutes);
router.use('/chat', chatRoutes);

export default router; 