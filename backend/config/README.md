# Backend Configuration Guide

This directory contains configuration files for different environments.

## Structure

- `env.example.js`: Example configuration with all available options
- `env.development.js`: Development environment configuration
- `env.production.js`: Production environment configuration
- `index.js`: Configuration loader that selects the appropriate config based on NODE_ENV

## Environment Setup

### Development

1. Copy `env.example.js` to `.env` in the root directory
2. Update the values as needed for your development environment
3. Run the server with `NODE_ENV=development`

### Production

1. Set up environment variables in your production environment
2. Ensure all required variables are set (see `env.example.js` for reference)
3. Run the server with `NODE_ENV=production`

## Required Environment Variables

### Minimum Required for Development

```
DATABASE_URL=postgresql://username:password@localhost:5432/tukangin_db?schema=public
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=http://localhost:3000
```

### Additional Production Variables

```
PORT=8080
DATABASE_URL=your_production_db_url
JWT_SECRET=your_secure_jwt_secret
JWT_REFRESH_SECRET=your_secure_refresh_token_secret
FRONTEND_URL=https://tukangin.com
STORAGE_TYPE=cloud
CLOUD_STORAGE_BUCKET=your_bucket_name
CLOUD_STORAGE_KEY_FILE=path_to_key_file.json
```

## Configuration Precedence

1. Environment variables take precedence over default values
2. If a specific environment config fails to load, the system falls back to development config

## Adding New Configuration Options

To add new configuration options:

1. Add the option to `env.example.js` with documentation
2. Add the option to all environment-specific files with appropriate defaults
3. Use the option in your code by importing the config: `const config = require('../config');`
