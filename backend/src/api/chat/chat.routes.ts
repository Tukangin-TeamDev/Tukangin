import express from 'express';
import { authenticate } from '../../middleware/auth.middleware';

const router = express.Router();

// TODO: Implement chat routes
router.use(authenticate);

export default router;
