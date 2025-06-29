import express from 'express';
import {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  verifyOtp,
  toggleTwoFactor,
  googleAuth,
  googleCallback,
  verifyResetOtp,
  getCurrentUser,
} from '../controllers/authController';
import {
  validateRegister,
  validateLogin,
  validateOtp,
  validateForgotPassword,
  validateResetPassword,
} from '../middleware/validators/authValidator';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router.post('/refresh-token', refreshToken);
router.post('/logout', logoutUser);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/reset-password', validateResetPassword, resetPassword);

// Email verification
router.post('/verify-email', validateOtp, verifyEmail);
router.post('/resend-verification', validateForgotPassword, resendVerification);

// 2FA
router.post('/verify-otp', validateOtp, verifyOtp);
router.post('/verify-reset-otp', verifyResetOtp);

// OAuth routes - Google Auth
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

// Protected routes
router.use(authMiddleware);
router.post('/toggle-two-factor', toggleTwoFactor);

// Get current user
router.get('/me', getCurrentUser);

export default router;
