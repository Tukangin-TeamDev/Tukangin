import api from '@/lib/api';

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
   * Login user
   * @param credentials User login credentials
   * @returns Authentication response with token and user data
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    } catch (error) {
      if (api.isAxiosError(error) && error.response) {
        return error.response.data as AuthResponse;
      }
      throw error;
    }
  },

  /**
   * Register new user
   * @param userData User registration data
   * @returns Authentication response with token and user data
   */
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/register', userData);
      return response.data;
    } catch (error) {
      if (api.isAxiosError(error) && error.response) {
        return error.response.data as AuthResponse;
      }
      throw error;
    }
  },

  /**
   * Verify OTP code
   * @param verificationData OTP verification data
   * @returns Authentication response with token and user data
   */
  verifyOtp: async (verificationData: OtpVerificationData): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/verify-otp', verificationData);
      return response.data;
    } catch (error) {
      if (api.isAxiosError(error) && error.response) {
        return error.response.data as AuthResponse;
      }
      throw error;
    }
  },

  /**
   * Get current authenticated user
   * @returns User data
   */
  getCurrentUser: async (): Promise<any> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
    // Clear local storage token
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },

  /**
   * Request password reset
   * @param email User email
   * @returns Response with reset token or message
   */
  forgotPassword: async (email: string): Promise<any> => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  /**
   * Reset password with token
   * @param token Reset token
   * @param password New password
   * @returns Success response
   */
  resetPassword: async (token: string, password: string): Promise<any> => {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  },
};

export default authService;
