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

# Integrasi Supabase Auth dengan Provider (Google OAuth)

Dokumen ini menjelaskan cara mengintegrasikan Social Login (Google OAuth) menggunakan fitur provider dari Supabase Auth di aplikasi Tukangin.

## Setup di Supabase Dashboard

1. Buat project di [Supabase Dashboard](https://supabase.com/dashboard)
2. Masuk ke bagian **Authentication** > **Providers**
3. Aktifkan provider **Google** dengan mengklik toggle "Enabled"

### Setup Google Cloud OAuth

1. Buat project atau gunakan project yang sudah ada di [Google Cloud Console](https://console.cloud.google.com)
2. Aktifkan OAuth API di bagian **APIs & Services** > **OAuth consent screen**:
   - Pilih User Type (External atau Internal)
   - Isi informasi aplikasi (nama, email kontak, dll)
   - Tambahkan domain Supabase (`<PROJECT_ID>.supabase.co`) ke Authorized Domains
   - Tambahkan scope `.../auth/userinfo.email`, `.../auth/userinfo.profile`, dan `openid`
3. Di bagian **Credentials**:
   - Pilih "Create Credentials" > "OAuth Client ID"
   - Pilih "Web application" sebagai Application type
   - Tambahkan URL website Anda di "Authorized JavaScript origins"
   - Tambahkan URL callback dari Supabase di "Authorized redirect URIs"
     - URL callback dapat dilihat di Supabase Dashboard > Authentication > Providers > Google
   - Klik "Create" dan simpan Client ID dan Client Secret

### Konfigurasi di Supabase

Ada dua cara untuk mengkonfigurasi provider Google di Supabase:

#### Cara 1: Melalui Dashboard

1. Masuk ke **Authentication** > **Providers** > **Google**
2. Masukkan **Client ID** dan **Client Secret** dari Google Cloud Console
3. Klik "Save"

#### Cara 2: Melalui Management API

```bash
# Dapatkan access token dari https://supabase.com/dashboard/account/tokens
export SUPABASE_ACCESS_TOKEN="your-access-token"
export PROJECT_REF="your-project-ref"

# Update konfigurasi auth untuk mengaktifkan provider Google
curl -X PATCH "https://api.supabase.com/v1/projects/$PROJECT_REF/config/auth" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "external_google_enabled": true,
    "external_google_client_id": "your-google-client-id",
    "external_google_secret": "your-google-client-secret"
  }'
```

## Variabel Lingkungan

Tambahkan variabel lingkungan berikut di file `.env` backend:

```
SUPABASE_URL=https://<PROJECT_ID>.supabase.co
SUPABASE_ANON_KEY=<PUBLIC_ANON_KEY>
SUPABASE_SERVICE_KEY=<SECRET_SERVICE_KEY>
BACKEND_URL=http://localhost:8080
FRONTEND_URL=http://localhost:3000
```

## Implementasi Frontend (Client-side)

Integrasi Supabase Auth dengan Google menggunakan pendekatan client-side (langsung dari browser):

```typescript
// services/authService.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    throw error;
  }

  // Arahkan ke URL login Google
  if (data?.url) {
    window.location.href = data.url;
  }
};

// Fungsi untuk memeriksa dan mengatur sesi setelah callback
export const handleAuthCallback = async () => {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return data.session;
};
```

## Implementasi Callback di Next.js

```tsx
// app/auth/callback/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { handleAuthCallback } from '@/services/authService';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthCallbackPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setSession } = useAuth();

  useEffect(() => {
    const setupAuth = async () => {
      try {
        const session = await handleAuthCallback();
        if (session) {
          setSession(session);
          router.push('/dashboard');
        } else {
          setError('Tidak dapat memperoleh sesi');
          setTimeout(() => router.push('/login'), 2000);
        }
      } catch (err: any) {
        setError(err.message);
        setTimeout(() => router.push('/login'), 2000);
      }
    };

    setupAuth();
  }, [router, setSession]);

  if (error) {
    return <div className="text-center p-4">Error: {error}</div>;
  }

  return <div className="text-center p-4">Memuat...</div>;
}
```

## Implementasi Tombol Login di Frontend

```tsx
'use client';

import { signInWithGoogle } from '@/services/authService';

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  return (
    <div>
      <button onClick={handleGoogleLogin} className="flex items-center gap-2 rounded-lg border p-2">
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          {/* Google icon paths */}
        </svg>
        Login dengan Google
      </button>
    </div>
  );
}
```

## Keuntungan Pendekatan Ini

1. **Sederhana**: Menggunakan fitur bawaan Supabase tanpa perlu implementasi backend yang kompleks
2. **Otomatis**: Supabase menangani token, refresh session, dan keamanan
3. **Mudah dikonfigurasi**: Semua provider dapat diatur dari dashboard Supabase
4. **Client-side**: Komunikasi langsung antara client dan Supabase tanpa perlu menyimpan token di backend

## Langkah Integasi dengan Backend (Opsional)

Jika Anda perlu memvalidasi sesi di backend:

1. Kirim akses token ke server dalam header Authorization
2. Validasi token menggunakan `supabase.auth.getUser(token)`
3. Gunakan data user untuk keperluan otorisasi

```typescript
// Contoh middleware backend untuk validasi token
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token tidak ditemukan' });
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ message: 'Token tidak valid' });
    }

    req.user = data.user;
    next();
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};
```

## Troubleshooting

1. **Error CORS**: Pastikan origin website terdaftar di Supabase Auth Settings
2. **Invalid Redirect URI**: Verifikasi URL callback di konfigurasi Google Cloud dan Supabase sama persis
3. **Session tidak tersimpan**: Pastikan cookies berfungsi dengan benar di browser pengguna
