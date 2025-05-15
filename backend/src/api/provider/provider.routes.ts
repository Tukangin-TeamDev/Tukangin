import express from 'express';
import * as providerController from './provider.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { checkRole } from '../../middleware/rbac.middleware';
import { validateRequest } from '../../middleware/validation.middleware';
import { UserRole } from '../../types/user.types';
import { updateProviderProfileSchema } from '../../utils/validators';

const router = express.Router();

// ================ PROVIDER ROUTES ================

/**
 * @route GET /api/providers
 * @desc Mendapatkan daftar semua provider dengan filter
 * @access Public
 */
router.get('/', providerController.getProviders);

/**
 * @route GET /api/providers/:id
 * @desc Mendapatkan detail provider berdasarkan ID
 * @access Public
 */
router.get('/:id', providerController.getProviderById);

/**
 * @route GET /api/providers/user/:userId
 * @desc Mendapatkan detail provider berdasarkan ID user
 * @access Public
 */
router.get('/user/:userId', providerController.getProviderByUserId);

/**
 * @route POST /api/providers
 * @desc Membuat atau memperbarui profil provider
 * @access Private (Provider)
 */
router.post(
  '/',
  authenticate,
  checkRole([UserRole.PROVIDER]),
  validateRequest(updateProviderProfileSchema),
  providerController.updateProviderProfile
);

/**
 * @route PUT /api/providers/:id/verify
 * @desc Verifikasi provider (khusus admin)
 * @access Private (Admin)
 */
router.put(
  '/:id/verify',
  authenticate,
  checkRole([UserRole.ADMIN]),
  providerController.verifyProvider
);

export default router;
