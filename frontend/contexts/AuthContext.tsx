"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  role: string;
  profile?: {
    fullName: string;
    avatarUrl?: string;
    businessName?: string;
    isVerified?: boolean;
    adminRole?: string;
  };
  phoneNumber?: string;
  twoFactorEnabled?: boolean;
  emailVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (userData: any) => Promise<any>;
  logout: () => Promise<void>;
  verifyOtp: (email: string, otp: string, token: string) => Promise<any>;
  verifyEmail: (email: string, otp: string) => Promise<any>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const router = useRouter();

  // Fetch user from backend on mount
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        // Fetch user after login
        const meRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          credentials: 'include',
        });
        if (meRes.ok) {
          const meData = await meRes.json();
          setUser(meData.user);
          setIsAuthenticated(true);
        }
      }
      setLoading(false);
      return result;
    } catch (err) {
      setLoading(false);
      setError('Login gagal. Silakan coba lagi.');
      return { success: false, message: 'Login gagal. Silakan coba lagi.' };
    }
  };

  const register = async (userData: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(userData),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        // Fetch user after register
        const meRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          credentials: 'include',
        });
        if (meRes.ok) {
          const meData = await meRes.json();
          setUser(meData.user);
          setIsAuthenticated(true);
        }
      }
      setLoading(false);
      return result;
    } catch (err) {
      setLoading(false);
      setError('Registrasi gagal. Silakan coba lagi.');
      return { success: false, message: 'Registrasi gagal. Silakan coba lagi.' };
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      router.push('/login');
    }
  };

  const verifyOtp = async (email: string, otp: string, token: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, otp, token }),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        // Fetch user after OTP
        const meRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          credentials: 'include',
        });
        if (meRes.ok) {
          const meData = await meRes.json();
          setUser(meData.user);
          setIsAuthenticated(true);
        }
      }
      setLoading(false);
      return result;
    } catch (err) {
      setLoading(false);
      setError('Verifikasi OTP gagal. Silakan coba lagi.');
      return { success: false, message: 'Verifikasi OTP gagal. Silakan coba lagi.' };
    }
  };

  const verifyEmail = async (email: string, otp: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, otp }),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        // Fetch user after email verification
        const meRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          credentials: 'include',
        });
        if (meRes.ok) {
          const meData = await meRes.json();
          setUser(meData.user);
          setIsAuthenticated(true);
        }
      }
      setLoading(false);
      return result;
    } catch (err) {
      setLoading(false);
      setError('Verifikasi email gagal. Silakan coba lagi.');
      return { success: false, message: 'Verifikasi email gagal. Silakan coba lagi.' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated,
        login,
        register,
        logout,
        verifyOtp,
        verifyEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
