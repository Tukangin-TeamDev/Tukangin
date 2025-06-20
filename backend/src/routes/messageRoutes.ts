import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import * as messageController from '../controllers/messageController';

const router = express.Router();

// Example protected route
router.use(authMiddleware);

// TODO: Add message routes

export default router;
