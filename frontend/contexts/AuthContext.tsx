'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/services/authService';

interface UserProfile {
  id: string;
  email: string;
  role: string;
  fullName?: string;
  avatarUrl?: string;
  phoneNumber?: string;
  metadata?: any;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (userData: any) => Promise<any>;
  logout: () => Promise<void>;
  updateUserState: (session: Session) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const router = useRouter();

  // Helper function to process user data from Supabase
  const processUserData = (authUser: User | null): UserProfile | null => {
    if (!authUser) return null;

    // Extract role from user metadata or default to CUSTOMER
    const role = authUser.user_metadata?.role || 'CUSTOMER';
    const fullName = authUser.user_metadata?.full_name || '';
    const avatarUrl = authUser.user_metadata?.avatar_url;
    const phoneNumber = authUser.user_metadata?.phone_number;

    return {
      id: authUser.id,
      email: authUser.email || '',
      role: role,
      fullName,
      avatarUrl,
      phoneNumber,
      metadata: authUser.user_metadata
    };
  };

  // Initialize user session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      try {
        // Get session from Supabase
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          const userData = processUserData(data.session.user);
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const userData = processUserData(session.user);
        setUser(userData);
        setIsAuthenticated(true);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    initializeAuth();

    // Cleanup subscription
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Update user state with session data
  const updateUserState = (session: Session) => {
    const userData = processUserData(session.user);
    setUser(userData);
    setIsAuthenticated(!!userData);
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setError(error.message);
        return { success: false, message: error.message };
      }

      if (data.user) {
        const userData = processUserData(data.user);
        setUser(userData);
        setIsAuthenticated(true);
        
        // Determine redirect URL based on role
        const role = userData?.role || 'CUSTOMER';
        let redirectTo = '/dashboard';
        if (role === 'PROVIDER') {
          redirectTo = '/provider/dashboard';
        } else if (role === 'ADMIN') {
          redirectTo = '/admin/dashboard';
        }
        
        return { success: true, redirectTo };
      }
      
      return { success: false, message: 'Login gagal' };
    } catch (error: any) {
      setError(error.message || 'Login gagal');
      return { success: false, message: error.message || 'Login gagal' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.fullName,
            phone_number: userData.phoneNumber,
            role: userData.role,
          }
        }
      });

      if (error) {
        setError(error.message);
        return { success: false, message: error.message };
      }

      // For sign-up, Supabase usually sends a confirmation email
      // We don't immediately authenticate the user
      return { 
        success: true, 
        message: 'Registrasi berhasil. Silakan cek email Anda untuk konfirmasi.',
        needVerification: true
      };
    } catch (error: any) {
      setError(error.message || 'Registrasi gagal');
      return { success: false, message: error.message || 'Registrasi gagal' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
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
        updateUserState
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
