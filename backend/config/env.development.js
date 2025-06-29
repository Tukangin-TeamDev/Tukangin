/**
 * Development environment configuration
 */
module.exports = {
  // Server Configuration
  PORT: process.env.PORT || 8080,
  NODE_ENV: 'development',

  // Database Configuration
  DATABASE_URL:
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgres@localhost:5432/tukangin_dev?schema=public',

  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'dev_jwt_secret_key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'dev_refresh_token_secret',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',

  // Frontend URL (for redirects and CORS)
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

  // File Storage
  STORAGE_TYPE: process.env.STORAGE_TYPE || 'local',
  STORAGE_LOCAL_PATH: process.env.STORAGE_LOCAL_PATH || './uploads',

  // Other Settings
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
};
