import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import * as paymentController from '../controllers/paymentController';

const router = express.Router();

// Example protected route
router.use(authMiddleware);

// TODO: Add payment routes

export default router;
