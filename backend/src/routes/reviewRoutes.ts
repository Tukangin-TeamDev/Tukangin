import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import * as reviewController from '../controllers/reviewController';

const router = express.Router();

// Example protected route
router.use(authMiddleware);

// TODO: Add review routes

export default router;
