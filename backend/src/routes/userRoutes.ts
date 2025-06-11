import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Protected routes
router.use(authMiddleware);

// Sample route for demonstration
router.get('/me', (req, res) => {
  // Auth middleware adds user to req object
  res.status(200).json({
    success: true,
    data: req.user
  });
});

export default router; 