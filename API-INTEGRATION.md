# API Integration Guide for Tukangin Project

This guide explains how the frontend and backend integration is set up in the Tukangin project, including configuration for both development and production environments.

## Overview

The project uses Axios for API communication between the frontend (Next.js) and backend (Express). The integration is designed to be:

- **Environment-aware**: Different configurations for development and production
- **Type-safe**: TypeScript interfaces for requests and responses
- **Modular**: Organized by domain (auth, customer, provider, admin)
- **Secure**: Automatic token handling and error management

## Directory Structure

```
frontend/
├── lib/
│   └── api.ts              # Main Axios client configuration
├── services/
│   ├── index.ts            # Exports all services
│   ├── authService.ts      # Authentication API calls
│   ├── customerService.ts  # Customer-specific API calls
│   ├── providerService.ts  # Provider-specific API calls
│   └── adminService.ts     # Admin-specific API calls
│
backend/
├── config/
│   ├── index.js            # Configuration loader
│   ├── env.development.js  # Development environment config
│   └── env.production.js   # Production environment config
```

## Frontend Configuration

### Environment Variables

Create `.env.local` (for development) or set environment variables (for production):

```
# Development (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# Production (environment variables)
NEXT_PUBLIC_API_URL=https://api.tukangin.com/api
```

### API Client Setup (frontend/lib/api.ts)

The main Axios instance is configured to:

1. Use the correct base URL based on environment
2. Add authentication tokens automatically
3. Handle common error scenarios

```typescript
// Environment-specific configuration
const API_CONFIG = {
  development: {
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
    timeout: 10000,
  },
  production: {
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.tukangin.com/api',
    timeout: 15000,
  },
};

// Create Axios instance
const api = axios.create({
  baseURL: config.baseURL,
  timeout: config.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

## Backend Configuration

### Environment Variables

For development, create a `.env` file in the backend root directory:

```
# Server Configuration
PORT=8080
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/tukangin_db?schema=public

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

For production, set these environment variables on your server.

### CORS Configuration

The backend is configured to accept requests from the frontend:

```javascript
// In backend/src/middleware/corsMiddleware.ts
const corsOptions = {
  origin: config.FRONTEND_URL,
  credentials: true,
};

app.use(cors(corsOptions));
```

## Using the API Services

### Authentication

```typescript
import { authService } from '@/services';

// Login
const response = await authService.login({
  email: 'user@example.com',
  password: 'password123',
});

// Register
const response = await authService.register({
  email: 'newuser@example.com',
  password: 'password123',
  fullName: 'New User',
  phoneNumber: '1234567890',
  role: 'CUSTOMER',
});
```

### Customer Services

```typescript
import { customerService } from '@/services';

// Search for services
const results = await customerService.searchServices({
  query: 'plumbing',
  categoryId: 'category-id',
  minPrice: 100,
  maxPrice: 500,
});

// Create booking
const booking = await customerService.createBooking({
  providerId: 'provider-id',
  address: '123 Main St',
  latitude: 123.456,
  longitude: 78.91,
  services: [{ serviceId: 'service-id', quantity: 1 }],
});
```

### Provider Services

```typescript
import { providerService } from '@/services';

// Get provider's services
const services = await providerService.getServices();

// Update booking status
const result = await providerService.updateBookingStatus('booking-id', 'COMPLETED');
```

### Admin Services

```typescript
import { adminService } from '@/services';

// Get dashboard stats
const stats = await adminService.getDashboardStats();

// Get users list
const users = await adminService.getUsers('PROVIDER');
```

## Error Handling

The API client automatically handles common error scenarios:

```typescript
try {
  const response = await customerService.getCategories();
  // Handle success
} catch (error) {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Server responded with an error status
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request made but no response received
      console.error('Network Error: No response received');
    }
  } else {
    // Something else went wrong
    console.error('Error:', error);
  }
}
```

## Deployment Considerations

### Development

1. Start the backend server: `npm run dev` (in the backend directory)
2. Start the frontend: `npm run dev` (in the frontend directory)
3. Ensure `.env.local` in frontend and `.env` in backend are properly configured

### Production

1. Set environment variables on your hosting platform for both frontend and backend
2. Ensure CORS is properly configured to allow requests from your production frontend URL
3. Consider using a reverse proxy (like Nginx) to serve both frontend and API under the same domain

## Security Best Practices

1. Always use HTTPS in production
2. Store tokens securely (HTTP-only cookies for sensitive tokens)
3. Implement proper validation on both client and server
4. Set appropriate CORS policies
5. Use environment variables for sensitive configuration
6. Never expose API keys or secrets in frontend code
