import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import * as trackingController from '../controllers/trackingController';

const router = express.Router();

// Example protected route
router.use(authMiddleware);

// TODO: Add tracking routes

export default router;
