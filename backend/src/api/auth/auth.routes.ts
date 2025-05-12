import { Router } from 'express';
import passport from '../../config/passport.config';
import * as authController from './auth.controller';
import { validateRequest } from '../../middleware/validation.middleware';
import { loginSchema, registerSchema, googleAuthSchema } from './auth.validator';
import { auditLog } from '../../middleware/audit.middleware';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

/**
 * @route POST /api/auth/register
 * @desc Registrasi user baru
 * @access Public
 */
router.post(
  '/register',
  validateRequest(registerSchema),
  authController.register
);

/**
 * @route POST /api/auth/login
 * @desc Login user dan mendapatkan JWT token
 * @access Public
 */
router.post(
  '/login',
  validateRequest(loginSchema),
  auditLog('LOGIN_ATTEMPT', (req) => ({ email: req.body.email })),
  authController.login
);

/**
 * @route POST /api/auth/google
 * @desc Login atau register dengan Google (direct API dengan data dari client)
 * @access Public
 */
router.post(
  '/google',
  validateRequest(googleAuthSchema),
  auditLog('GOOGLE_AUTH_ATTEMPT', (req) => ({ email: req.body.email })),
  authController.googleAuth
);

/**
 * @route GET /api/auth/google/start
 * @desc Memulai proses OAuth Google
 * @access Public
 */
router.get(
  '/google/start',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

/**
 * @route GET /api/auth/google/callback
 * @desc Callback untuk OAuth Google
 * @access Public
 */
router.get(
  '/google/callback',
  passport.authenticate('google', { 
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/auth/error` 
  }),
  authController.googleCallback
);

/**
 * @route POST /api/auth/refresh
 * @desc Refresh JWT token
 * @access Public (dengan refresh token)
 */
router.post('/refresh', authController.refreshToken);

/**
 * @route POST /api/auth/logout
 * @desc Logout user
 * @access Private
 */
router.post(
  '/logout',
  authenticate,
  auditLog('LOGOUT'),
  authController.logout
);

/**
 * @route POST /api/auth/2fa/enable
 * @desc Mengaktifkan 2FA untuk akun user
 * @access Private
 */
router.post(
  '/2fa/enable',
  authenticate,
  auditLog('ENABLE_2FA'),
  authController.enable2FA
);

/**
 * @route POST /api/auth/2fa/verify
 * @desc Verifikasi kode 2FA
 * @access Private
 */
router.post(
  '/2fa/verify',
  authenticate,
  auditLog('VERIFY_2FA'),
  authController.verify2FA
);

/**
 * @route POST /api/auth/2fa/disable
 * @desc Menonaktifkan 2FA untuk akun user
 * @access Private
 */
router.post(
  '/2fa/disable',
  authenticate,
  auditLog('DISABLE_2FA'),
  authController.disable2FA
);

export default router; 