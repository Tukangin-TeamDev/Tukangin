import { Router } from 'express';
import * as userController from './user.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { checkRole, checkOwnership } from '../../middleware/rbac.middleware';
import { UserRole } from '../../types/user.types';
import { validateRequest } from '../../middleware/validation.middleware';
import { createUserSchema, updateUserSchema } from '../../utils/validators';

const router = Router();

/**
 * @route GET /api/users
 * @desc Mendapatkan daftar semua user (hanya admin)
 * @access Private (Admin)
 */
router.get('/', authenticate, checkRole([UserRole.ADMIN]), userController.getUsers);

/**
 * @route GET /api/users/:id
 * @desc Mendapatkan detail user berdasarkan ID
 * @access Private (Admin atau pemilik akun)
 */
router.get(
  '/:id',
  authenticate,
  checkOwnership(req => parseInt(req.params.id)),
  userController.getUserById
);

/**
 * @route POST /api/users
 * @desc Membuat user baru (hanya admin)
 * @access Private (Admin)
 */
router.post(
  '/',
  authenticate,
  checkRole([UserRole.ADMIN]),
  validateRequest(createUserSchema),
  userController.createUser
);

/**
 * @route PUT /api/users/:id
 * @desc Memperbarui data user
 * @access Private (Admin atau pemilik akun)
 */
router.put(
  '/:id',
  authenticate,
  checkOwnership(req => parseInt(req.params.id)),
  validateRequest(updateUserSchema),
  userController.updateUser
);

/**
 * @route DELETE /api/users/:id
 * @desc Menghapus user (hanya admin)
 * @access Private (Admin)
 */
router.delete('/:id', authenticate, checkRole([UserRole.ADMIN]), userController.deleteUser);

export default router;
