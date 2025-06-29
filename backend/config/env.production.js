/**
 * Production environment configuration
 */
module.exports = {
  // Server Configuration
  PORT: process.env.PORT || 8080,
  NODE_ENV: 'production',

  // Database Configuration
  DATABASE_URL: process.env.DATABASE_URL,

  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',

  // Frontend URL (for redirects and CORS)
  FRONTEND_URL: process.env.FRONTEND_URL || 'https://tukangin.com',

  // File Storage
  STORAGE_TYPE: process.env.STORAGE_TYPE || 'cloud',
  STORAGE_LOCAL_PATH: process.env.STORAGE_LOCAL_PATH || './uploads',
  CLOUD_STORAGE_BUCKET: process.env.CLOUD_STORAGE_BUCKET,
  CLOUD_STORAGE_KEY_FILE: process.env.CLOUD_STORAGE_KEY_FILE,

  // Other Settings
  LOG_LEVEL: process.env.LOG_LEVEL || 'warn',
};
