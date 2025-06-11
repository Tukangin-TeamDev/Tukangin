import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import {
  getUser,
  getToken,
  setToken,
  setUser,
  removeToken,
  isValidToken,
  login as loginApi,
  register as registerApi,
  logout as logoutApi,
  verifyOtp as verifyOtpApi,
  verifyEmail as verifyEmailApi,
} from '@/lib/auth';

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
  login: (
    email: string,
    password: string
  ) => Promise<{
    success: boolean;
    requireOtp?: boolean;
    needVerification?: boolean;
    partialToken?: string;
    redirectTo?: string;
    message?: string;
  }>;
  register: (userData: any) => Promise<{
    success: boolean;
    needVerification?: boolean;
    redirectTo?: string;
    message?: string;
  }>;
  logout: () => void;
  verifyOtp: (
    email: string,
    otp: string,
    token: string
  ) => Promise<{
    success: boolean;
    redirectTo?: string;
    message?: string;
  }>;
  verifyEmail: (
    email: string,
    otp: string
  ) => Promise<{
    success: boolean;
    redirectTo?: string;
    message?: string;
  }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const initAuth = () => {
      try {
        const token = getToken();

        if (token && isValidToken(token)) {
          const user = getUser();

          if (user) {
            setUserState(user);
            setIsAuthenticated(true);
          } else {
            // Token valid tapi data user tidak ada, hapus token
            removeToken();
            setIsAuthenticated(false);
          }
        } else {
          // Token tidak valid, hapus token
          if (token) removeToken();
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        removeToken();
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await loginApi(email, password);

      if (
        response.success &&
        response.token &&
        !response.requireOtp &&
        !response.needVerification
      ) {
        setUserState(response.data || null);
        setIsAuthenticated(true);
      }

      setLoading(false);
      return {
        success: response.success,
        requireOtp: response.requireOtp,
        needVerification: response.needVerification,
        partialToken: response.partialToken,
        redirectTo: response.redirectTo,
        message: response.message,
      };
    } catch (error) {
      setLoading(false);
      setError('Login gagal. Silakan coba lagi.');
      return { success: false, message: 'Login gagal. Silakan coba lagi.' };
    }
  };

  const register = async (userData: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await registerApi(userData);

      if (response.success && response.token && !response.needVerification) {
        setUserState(response.data || null);
        setIsAuthenticated(true);
      }

      setLoading(false);
      return {
        success: response.success,
        needVerification: response.needVerification,
        redirectTo: response.redirectTo,
        message: response.message,
      };
    } catch (error) {
      setLoading(false);
      setError('Registrasi gagal. Silakan coba lagi.');
      return { success: false, message: 'Registrasi gagal. Silakan coba lagi.' };
    }
  };

  const logout = () => {
    logoutApi();
    setUserState(null);
    setIsAuthenticated(false);
    router.push('/login');
  };

  const verifyOtp = async (email: string, otp: string, partialToken: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await verifyOtpApi(email, otp, partialToken);

      if (response.success && response.token) {
        setUserState(response.data || null);
        setIsAuthenticated(true);
      }

      setLoading(false);
      return {
        success: response.success,
        redirectTo: response.redirectTo,
        message: response.message,
      };
    } catch (error) {
      setLoading(false);
      setError('Verifikasi OTP gagal. Silakan coba lagi.');
      return { success: false, message: 'Verifikasi OTP gagal. Silakan coba lagi.' };
    }
  };

  const verifyEmail = async (email: string, otp: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await verifyEmailApi(email, otp);

      if (response.success && response.token) {
        // Update status emailVerified pada user state
        if (user) {
          const updatedUser = { ...user, emailVerified: true };
          setUser(updatedUser);
          setUserState(updatedUser);
        }
        setIsAuthenticated(true);
      }

      setLoading(false);
      return {
        success: response.success,
        redirectTo: response.redirectTo,
        message: response.message,
      };
    } catch (error) {
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
