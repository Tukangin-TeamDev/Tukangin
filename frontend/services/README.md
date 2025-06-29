# API Integration Guide

This directory contains the API service modules for integrating the frontend with the backend API.

## Structure

- `api.ts`: Main Axios client configuration with environment-specific settings
- Service modules:
  - `authService.ts`: Authentication-related API calls
  - `customerService.ts`: Customer-specific API calls
  - `providerService.ts`: Provider-specific API calls
  - `adminService.ts`: Admin-specific API calls
  - `index.ts`: Exports all services and types

## Environment Configuration

The API integration supports different environments:

### Development

```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### Production

```
NEXT_PUBLIC_API_URL=https://api.tukangin.com/api
```

## How to Use

1. Import the service you need:

```typescript
import { authService } from '@/services';
```

2. Call the API methods:

```typescript
// Example: Login
const response = await authService.login({
  email: 'user@example.com',
  password: 'password123',
});

if (response.success) {
  // Handle successful login
} else {
  // Handle error
}
```

## Authentication

The API client automatically handles authentication by:

1. Adding the JWT token to requests via an interceptor
2. Handling 401 Unauthorized errors (token expired)
3. Redirecting to login when needed

## Error Handling

The API client provides centralized error handling for common errors:

- 401 Unauthorized: Token expired or invalid
- 403 Forbidden: Insufficient permissions
- Network errors: Connection issues

## Adding New API Endpoints

To add new API endpoints:

1. Add the method to the appropriate service module
2. Define proper types for request and response
3. Use the `api` client for making requests
4. Handle errors consistently
