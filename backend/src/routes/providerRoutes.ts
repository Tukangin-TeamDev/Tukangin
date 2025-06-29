import express from 'express';
import { authMiddleware, authorize } from '../middleware/authMiddleware';

const router = express.Router();

// Protect all routes
router.use(authMiddleware);

// Only provider and admin can access these routes
router.use(authorize(['PROVIDER', 'ADMIN']));

// Provider routes (placeholder)
router.get('/profile', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Provider profile',
  });
});

router.get('/services', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Provider services',
  });
});

export default router;
