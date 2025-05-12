import express from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { checkRole } from '../../middleware/rbac.middleware';

const router = express.Router();

// Protect all admin routes with authentication and admin role check
router.use(authenticate);
router.use(checkRole(['ADMIN']));

// TODO: Implement admin routes

export default router;
