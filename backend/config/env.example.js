/**
 * Sample environment configuration
 * Copy this file to .env in the root .exports = {
  // Server Configuration
  PORT: 8080,
  NODE_ENV: 'development',

  // Database Configuration
  DATABASE_URL: 'postgresql://username:password@localhost:5432/tukangin_db?schema=public',

  // JWT Configuration
  JWT_SECRET: 'your_jwt_secret_key_here',
  JWT_EXPIRES_IN: '7d',
  JWT_REFRESH_SECRET: 'your_refresh_token_secret_here',
  JWT_REFRESH_EXPIRES_IN: '30d',

  // Email Configuration
  SMTP_HOST: 'smtp.example.com',
  SMTP_PORT: 587,
  SMTP_USER: 'your_email@example.com',
  SMTP_PASS: 'your_email_password',
  EMAIL_FROM: 'noreply@tukangin.com',

  // Google OAuth
  GOOGLE_CLIENT_ID: 'your_google_client_id',
  GOOGLE_CLIENT_SECRET: 'your_google_client_secret',
  GOOGLE_CALLBACK_URL: 'http://localhost:8080/api/auth/google/callback',

  // Frontend URL (for redirects and CORS)
  FRONTEND_URL: 'http://localhost:3000',

  // File Storage
  STORAGE_TYPE: 'local', // or 'cloud'
  STORAGE_LOCAL_PATH: './uploads',
  CLOUD_STORAGE_BUCKET: 'your_bucket_name',
  CLOUD_STORAGE_KEY_FILE: 'path_to_key_file.json',

  // Payment Gateway
  PAYMENT_GATEWAY_API_KEY: 'your_payment_gateway_api_key',
  PAYMENT_GATEWAY_SECRET: 'your_payment_gateway_secret',

  // Other Settings
  ENCRYPTION_KEY: 'your_encryption_key_for_sensitive_data',
  LOG_LEVEL: 'debug', // debug, info, warn, error
}; 