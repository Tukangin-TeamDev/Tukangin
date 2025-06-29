# Supabase Auth Integration Documentation

## Overview

This document explains the implementation of Supabase Auth with Google OAuth in the Tukangin application. This integration allows users to register and login using their Google accounts.

## Backend Implementation

### Dependencies

- `@supabase/supabase-js`: The Supabase JavaScript client
- `express`: Web framework for Node.js
- `cookie-parser`: Middleware for handling cookies

### Configuration

The Supabase client is initialized in two files:

1. `backend/src/config/supabase.ts`: Creates an admin client with service role key
2. `backend/src/config/supabaseClient.ts`: Creates a client with anon key for public operations

Required environment variables:

```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_KEY=your-supabase-service-key
BACKEND_URL=http://localhost:8080
FRONTEND_URL=http://localhost:3000
```

### Auth Controller (`authController.ts`)

The controller implements several key functions:

1. `googleAuth`: Initiates OAuth flow and redirects to Google login
2. `googleCallback`: Handles OAuth callback, exchanges code for session, and manages user data
3. `registerUser`: Traditional email/password registration
4. `loginUser`: Traditional email/password login
5. `refreshToken`: Refreshes authentication tokens
6. `logoutUser`: Signs out users from both Supabase and local app

### Auth Routes (`authRoutes.ts`)

Routes defined for authentication:

- **GET** `/api/auth/google`: Redirects to Google OAuth login
- **GET** `/api/auth/google/callback`: Handles redirect after Google authentication
- **POST** `/api/auth/register`: Email/password registration
- **POST** `/api/auth/login`: Email/password login
- **POST** `/api/auth/refresh-token`: Refreshes authentication tokens 
- **POST** `/api/auth/logout`: Logs user out
- **GET** `/api/auth/me`: Retrieves current authenticated user info

### Auth Middleware (`authMiddleware.ts`)

Authentication middleware that:
- Validates tokens from both headers and cookies
- Refreshes expired tokens when refresh tokens are available
- Populates `req.user` with user data
- Provides role-based access control via the `authorize` helper

### Database Integration

When a user authenticates with Google, the system:

1. Creates or updates a user record in the local database
2. Maps OAuth profile data to user profile in our database
3. Assigns a default role (CUSTOMER) to new OAuth users
4. Creates associated profile records as needed

## Frontend Implementation

### AuthService (`authService.ts`)

Service that interacts with the backend authentication API:

- `googleLogin()`: Redirects to backend Google OAuth endpoint
- `checkOAuthSession()`: Verifies if user is authenticated via cookies
- Other methods for traditional auth flows

### Auth Context (`AuthContext.tsx`)

Context provider that manages authentication state:

- `refreshUser()`: Updates user data from backend, used after OAuth redirects
- Methods for login, logout, registration, etc.
- Provides authentication state to entire application

### Callback Page (`app/auth/callback/page.tsx`)

Special page that handles OAuth redirects back to the frontend:

1. Checks for any error parameters
2. Calls `refreshUser()` to fetch user data after successful auth
3. Redirects to the appropriate dashboard based on user role

### Login Page (`app/login/page.tsx`)

Updated to include Google OAuth login button that initiates the flow.

## Authentication Flow

1. **Initiation**:
   - User clicks "Login with Google" button
   - Frontend calls `authService.googleLogin()`
   - Redirects to backend endpoint `/api/auth/google`

2. **Google OAuth**:
   - Backend uses Supabase to get Google auth URL
   - Redirects user to Google consent screen
   - User authenticates with Google
   - Google redirects to callback URL with auth code

3. **Session Creation**:
   - Backend receives code at `/api/auth/google/callback`
   - Exchanges code for Supabase session using `exchangeCodeForSession`
   - Creates/updates user in local database
   - Sets access and refresh tokens as cookies
   - Redirects to frontend callback page

4. **Frontend Session Resolution**:
   - Callback page calls `refreshUser()` to fetch authenticated user data
   - AuthContext updates with user information
   - User is redirected to appropriate dashboard

## Security Considerations

1. **Token Storage**:
   - Access tokens stored in HTTP-only cookies
   - Configured with proper security attributes (secure, sameSite)

2. **CORS Configuration**:
   - Backend configured to accept requests only from trusted origins

3. **Token Refresh**:
   - Automatic token refresh mechanism for seamless user experience
   - Invalid sessions require re-authentication

4. **User Data Protection**:
   - Minimal OAuth profile data stored
   - Sensitive operations require authentication

## Troubleshooting

Common issues and solutions:

1. **Redirect URI Mismatch**:
   - Ensure redirect URI in Google Cloud Console exactly matches callback URL

2. **CORS Issues**:
   - Check CORS configuration in Express middleware
   - Verify origin configuration

3. **Cookie Problems**:
   - Check `SameSite`, `Secure`, and `HttpOnly` settings
   - Different settings needed for development vs. production

4. **Token Validation**:
   - Check environment variables for correct API keys
   - Verify Supabase project configuration

# Supabase Auth Integration - Client Side

## Overview

Dokumentasi ini menjelaskan implementasi Supabase Auth dengan provider Google OAuth menggunakan pendekatan client-side. Dengan pendekatan ini, komunikasi autentikasi dilakukan langsung antara client (browser) dan layanan Supabase Auth, tanpa perlu implementasi backend yang kompleks.

## Keuntungan Pendekatan Client-Side

1. **Sederhana**: Tidak memerlukan endpoint backend khusus untuk autentikasi
2. **Otomatis**: Supabase menangani token, refresh session, dan keamanan
3. **Mudah dikonfigurasi**: Semua provider dapat diatur dari dashboard Supabase
4. **Fleksibel**: Mendukung berbagai provider otentikasi (Google, Facebook, GitHub, dll)

## Konfigurasi Supabase

### Setup Provider di Supabase Dashboard

1. Buat project di [Supabase Dashboard](https://supabase.com/dashboard)
2. Masuk ke bagian **Authentication** > **Providers**
3. Aktifkan provider **Google** dengan mengklik toggle "Enabled"
4. Masukkan **Client ID** dan **Client Secret** dari Google Cloud Console

### Setup Google Cloud OAuth

1. Buat project atau gunakan project yang sudah ada di [Google Cloud Console](https://console.cloud.google.com)
2. Aktifkan OAuth API di bagian **APIs & Services** > **OAuth consent screen**
3. Tambahkan domain Supabase (`<PROJECT_ID>.supabase.co`) ke Authorized Domains
4. Di bagian **Credentials**:
   - Buat OAuth Client ID untuk aplikasi web
   - Tambahkan URL website Anda di "Authorized JavaScript origins"
   - Tambahkan URL callback dari Supabase di "Authorized redirect URIs"

## Implementasi Frontend

### Konfigurasi Client

```typescript
// services/authService.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Login dengan Google

```typescript
// Fungsi untuk login dengan Google
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    }
  });
  
  if (error) {
    throw error;
  }
  
  if (data?.url) {
    window.location.href = data.url;
  }
}
```

### Callback Handler

```typescript
// Fungsi untuk menangani callback setelah login OAuth
export const handleAuthCallback = async () => {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    throw error;
  }
  
  return data.session;
}
```

### Halaman Callback

```tsx
// app/auth/callback/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { handleAuthCallback } from '@/services/authService';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { updateUserState } = useAuth();
  
  useEffect(() => {
    const setupAuth = async () => {
      try {
        const session = await handleAuthCallback();
        if (session) {
          updateUserState(session);
          router.push('/dashboard');
        }
      } catch (err) {
        router.push('/login');
      }
    };
    
    setupAuth();
  }, []);
  
  return <div>Memproses autentikasi...</div>;
}
```

## Auth Context untuk Manajemen State

```tsx
// contexts/AuthContext.tsx
'use client';

import { createContext, useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/services/authService';

export const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Initialize on mount
  useEffect(() => {
    const initAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUser(data.session.user);
        setIsAuthenticated(true);
      }
    };
    
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session.user);
        setIsAuthenticated(true);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
      }
    });
    
    initAuth();
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);
  
  // Update user state from session
  const updateUserState = (session: Session) => {
    setUser(session.user);
    setIsAuthenticated(true);
  };
  
  // Other auth methods...
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      updateUserState,
      // other methods... 
    }}>
      {children}
    </AuthContext.Provider>
  );
}
```

## Integrasi dengan Backend (Opsional)

Jika perlu mengintegrasikan autentikasi dengan backend:

1. Kirim akses token ke backend dalam header Authorization
2. Validasi token dengan Supabase admin client

```typescript
// backend/src/middleware/authMiddleware.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

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

## Alur Autentikasi

1. Pengguna mengklik tombol "Login dengan Google"
2. `signInWithGoogle()` dipanggil, mendapat URL dari Supabase
3. Browser dialihkan ke halaman login Google
4. Setelah autentikasi, Google mengarahkan kembali ke URL callback Supabase
5. Supabase mengatur sesi dan mengarahkan ke halaman callback aplikasi
6. Halaman callback memverifikasi sesi dan memperbarui state autentikasi
7. Pengguna dialihkan ke dashboard 