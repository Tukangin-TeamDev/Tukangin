/**
 * Sample environment configuration
 * Copy this file to .env in the root
 */
module.exports = {
  // Server Configuration
  PORT: 8080,
  NODE_ENV: 'development',

  // Database Configuration
  DATABASE_URL: 'postgresql://postgres:password@localhost:5432/tukangin_dev',

  // JWT Configuration
  JWT_SECRET: 'your-jwt-secret',
  JWT_EXPIRES_IN: '7d',
  JWT_REFRESH_SECRET: 'your_refresh_token_secret_here',
  JWT_REFRESH_EXPIRES_IN: '30d',

  // Email Configuration
  SMTP_HOST: 'smtp.example.com',
  SMTP_PORT: 587,
  SMTP_USER: 'your-smtp-username',
  SMTP_PASS: 'your-smtp-password',
  EMAIL_FROM: 'no-reply@tukangin.com',

  // Google OAuth
  GOOGLE_CLIENT_ID: 'your_google_client_id',
  GOOGLE_CLIENT_SECRET: 'your_google_client_secret',
  GOOGLE_CALLBACK_URL: 'http://localhost:8080/api/auth/google/callback',

  // Frontend URL (for redirects and CORS)
  FRONTEND_URL: 'http://localhost:3000',

  // File Storage
  STORAGE_TYPE: 'local', // or 'cloud'
  STORAGE_LOCAL_PATH: './uploads',
  STORAGE_BUCKET: 'your-bucket-name',
  STORAGE_REGION: 'ap-southeast-1',
  STORAGE_ACCESS_KEY: 'your-access-key',
  STORAGE_SECRET_KEY: 'your-secret-key',

  // Payment Gateway
  PAYMENT_API_KEY: 'your-payment-api-key',
  PAYMENT_SECRET_KEY: 'your-payment-secret-key',

  // Other Settings
  ENCRYPTION_KEY: 'your_encryption_key_for_sensitive_data',
  LOG_LEVEL: 'debug', // debug, info, warn, error

  // Supabase configuration
  SUPABASE_URL: 'https://your-project-id.supabase.co',
  SUPABASE_ANON_KEY: 'your-anon-key',
  SUPABASE_SERVICE_KEY: 'your-service-key',

  // Google Maps API
  GOOGLE_MAPS_API_KEY: 'your-google-maps-api-key',
}; 