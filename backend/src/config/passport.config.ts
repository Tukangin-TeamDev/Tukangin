import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { logger } from '../utils/logger';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL as string;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CALLBACK_URL) {
  logger.warn(
    'Google OAuth credentials tidak lengkap. Fitur login dengan Google tidak akan berfungsi.'
  );
}

// Konfigurasi Passport dengan Google OAuth 2.0
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    },
    (_, __, profile, done) => {
      // Profile dari Google berisi informasi pengguna
      // kita bisa menggunakan done(null, profile) karena data ini akan diproses di callback handler
      // Disini kita perlu menambahkan type any untuk compatibility dengan Express.User
      return done(null, profile as any);
    }
  )
);

// Serialize user untuk session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user dari session
passport.deserializeUser((obj: any, done) => {
  done(null, obj);
});

export default passport;
