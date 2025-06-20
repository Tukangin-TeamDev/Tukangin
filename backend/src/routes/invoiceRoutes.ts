import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import * as invoiceController from '../controllers/invoiceController';

const router = express.Router();

// Example protected route
router.use(authMiddleware);

// TODO: Add invoice routes

export default router;
