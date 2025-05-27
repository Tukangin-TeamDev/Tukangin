export const authConfig = {
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiration: 15 * 60, // 15 minutes
  jwtRefreshExpiration: 7 * 24 * 60 * 60, // 7 days
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleCallbackUrl:
    process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
  emailVerificationExpiry: 24 * 60 * 60 * 1000, // 24 hours
  resetPasswordExpiry: 1 * 60 * 60 * 1000, // 1 hour
};
