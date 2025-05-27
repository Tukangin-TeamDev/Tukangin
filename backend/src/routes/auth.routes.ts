import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { verifyToken, rateLimiter } from '../middlewares/auth.middleware';
import passport from 'passport';
import { Strategy as GoogleStrategy, StrategyOptions, Profile, VerifyCallback } from 'passport-google-oauth20';
import { authConfig } from '../config/auth.config';
import { Role } from '../types';
import { controllerAdapter } from '../utils/controller.adapter';

const router = Router();
const authController = new AuthController();

// Konfigurasi Google OAuth
const googleOptions: StrategyOptions = {
  clientID: authConfig.googleClientId || '',
  clientSecret: authConfig.googleClientSecret || '',
  callbackURL: authConfig.googleCallbackUrl
};

passport.use(new GoogleStrategy(
  googleOptions,
  (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
    authController.handleGoogleCallback(accessToken, refreshToken, profile, done);
  }
));

// Rate limiting untuk endpoint login
const loginLimiter = rateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes

// Routes publik
router.post('/register', controllerAdapter(authController.register.bind(authController)));
router.post('/login', loginLimiter, controllerAdapter(authController.login.bind(authController)));
router.get('/verify-email/:token', controllerAdapter(authController.verifyEmail.bind(authController)));
router.post('/forgot-password', controllerAdapter(authController.forgotPassword.bind(authController)));
router.post('/reset-password/:token', controllerAdapter(authController.resetPassword.bind(authController)));
router.post('/verify-2fa', controllerAdapter(authController.verify2FA.bind(authController)));

// Google OAuth routes
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  controllerAdapter(authController.googleCallback.bind(authController))
);

// Routes terproteksi
router.post('/setup-2fa', verifyToken, controllerAdapter(authController.setup2FA.bind(authController)));

export default router; 