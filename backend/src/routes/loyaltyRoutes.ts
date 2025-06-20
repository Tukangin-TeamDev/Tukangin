import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import * as loyaltyController from '../controllers/loyaltyController';

const router = express.Router();

// Example protected route
router.use(authMiddleware);

// TODO: Add loyalty routes

export default router;
