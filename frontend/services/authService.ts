import api from '@/lib/api';
import { createClient } from '@supabase/supabase-js';

// Inisialisasi Supabase client dengan penanganan error yang lebih baik
let supabase;

try {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      'Supabase credentials missing! Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local file.'
    );
    // Fallback untuk development
    if (typeof window !== 'undefined') {
      // Di browser, tampilkan pesan error
      alert('Supabase credentials missing! Check console for more details.');
    }
  }
  
  supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  // Buat dummy client untuk mencegah error runtime
  supabase = {
    auth: {
      signInWithOAuth: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
      signInWithPassword: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
      signUp: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
      getSession: () => Promise.resolve({ data: { session: null } }),
      getUser: () => Promise.resolve({ data: { user: null } }),
      signOut: () => Promise.resolve({}),
      resetPasswordForEmail: () => Promise.resolve({}),
      updateUser: () => Promise.resolve({}),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
  };
}

export { supabase };

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  role: 'CUSTOMER' | 'PROVIDER';
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  data?: {
    id: string;
    email: string;
    role: string;
    profile?: any;
  };
  message?: string;
}

export interface OtpVerificationData {
  email: string;
  otp: string;
  partialToken?: string;
}

/**
 * Authentication service for handling auth-related API requests
 */
const authService = {
  /**
   * Login user with email and password
   * @param credentials User login credentials
   */
  login: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { 
          success: false, 
          message: error.message 
        };
      }

      // Get user metadata from the session
      const { user } = data;
      const role = user?.user_metadata?.role || 'CUSTOMER';
      let redirectTo = '/dashboard';
      
      if (role === 'PROVIDER') {
        redirectTo = '/provider/dashboard';
      } else if (role === 'ADMIN') {
        redirectTo = '/admin/dashboard';
      }

      return {
        success: true,
        data: {
          id: user?.id || '',
          email: user?.email || '',
          role: role,
          profile: user?.user_metadata || {}
        },
        redirectTo,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Login gagal'
      };
    }
  },

  /**
   * Register new user
   * @param userData User registration data
   */
  register: async (userData: RegisterData) => {
    try {
      // Register user with Supabase Auth
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
        return {
          success: false,
          message: error.message
        };
      }

      return {
        success: true,
        data: {
          id: data.user?.id || '',
          email: data.user?.email || '',
          role: userData.role,
        }
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Registrasi gagal'
      };
    }
  },

  /**
   * Sign in with Google
   * Redirects to Google's OAuth login page
   */
  signInWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      }
    });
    
    if (error) {
      throw error;
    }
    
    // Supabase returns URL to redirect to
    if (data?.url) {
      window.location.href = data.url;
    }
  },
  
  /**
   * Handle auth callback after OAuth login
   * @returns Supabase session
   */
  handleAuthCallback: async () => {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      throw error;
    }
    
    return data.session;
  },

  /**
   * Get current authenticated user
   */
  getCurrentUser: async () => {
    const { data } = await supabase.auth.getUser();
    return data.user;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: async () => {
    const { data } = await supabase.auth.getSession();
    return !!data.session;
  },

  /**
   * Logout user
   */
  logout: async () => {
    await supabase.auth.signOut();
  },

  /**
   * Request password reset
   * @param email User email
   */
  forgotPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    return {
      success: !error,
      message: error ? error.message : 'Email untuk reset password telah dikirim'
    };
  },

  /**
   * Reset password with new password
   * @param password New password
   */
  resetPassword: async (password: string) => {
    const { error } = await supabase.auth.updateUser({
      password: password,
    });
    
    return {
      success: !error,
      message: error ? error.message : 'Password berhasil diubah'
    };
  },
  
  /**
   * Get user session data
   */
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      throw error;
    }
    
    return data.session;
  }
};

export default authService;
