import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import bookingRoutes from './bookingRoutes';

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

export default router;
