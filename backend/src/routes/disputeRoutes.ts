import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import * as disputeController from '../controllers/disputeController';

const router = express.Router();

// Example protected route
router.use(authMiddleware);

// TODO: Add dispute routes

export default router;
