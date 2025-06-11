import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface AuthToken {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

interface UserData {
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

interface LoginResponse {
  success: boolean;
  message: string;
  data?: UserData;
  token?: string;
  partialToken?: string;
  requireOtp?: boolean;
  needVerification?: boolean;
  redirectTo?: string;
}

interface VerifyOtpResponse {
  success: boolean;
  message: string;
  token?: string;
  data?: UserData;
  redirectTo?: string;
}

// Fungsi helper untuk memeriksa apakah token valid
export const isValidToken = (token: string): boolean => {
  if (!token) return false;

  try {
    const decoded = jwtDecode<AuthToken>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

// Fungsi untuk mengambil token dari localStorage
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return null;
};

// Fungsi untuk menyimpan token di localStorage
export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', token);
  }
};

// Fungsi untuk menghapus token dari localStorage
export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  }
};

// Fungsi untuk menyimpan data user di localStorage
export const setUser = (user: UserData): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

// Fungsi untuk mengambil data user dari localStorage
export const getUser = (): UserData | null => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  return null;
};

// Fungsi untuk memeriksa apakah user sudah login
export const isAuthenticated = (): boolean => {
  const token = getToken();
  return !!token && isValidToken(token);
};

// Fungsi untuk memeriksa peran user
export const hasRole = (role: string | string[]): boolean => {
  const user = getUser();
  if (!user) return false;

  if (Array.isArray(role)) {
    return role.includes(user.role);
  }
  return user.role === role;
};

// Fungsi untuk melakukan login
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });

    if (response.data.success && response.data.token) {
      setToken(response.data.token);
      if (response.data.data) {
        setUser(response.data.data);
      }
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    throw error;
  }
};

// Fungsi untuk verifikasi OTP
export const verifyOtp = async (
  email: string,
  otp: string,
  partialToken: string
): Promise<VerifyOtpResponse> => {
  try {
    const response = await axios.post(`${API_URL}/auth/verify-otp`, {
      email,
      otp,
      partialToken,
    });

    if (response.data.success && response.data.token) {
      setToken(response.data.token);
      if (response.data.data) {
        setUser(response.data.data);
      }
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    throw error;
  }
};

// Fungsi untuk registrasi
export const register = async (userData: {
  email: string;
  password: string;
  phoneNumber: string;
  fullName: string;
  role: string;
  [key: string]: any;
}): Promise<LoginResponse> => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);

    if (response.data.success && response.data.token) {
      setToken(response.data.token);
      if (response.data.data) {
        setUser(response.data.data);
      }
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    throw error;
  }
};

// Fungsi untuk verifikasi email
export const verifyEmail = async (email: string, otp: string): Promise<VerifyOtpResponse> => {
  try {
    const response = await axios.post(`${API_URL}/auth/verify-email`, { email, otp });

    if (response.data.success && response.data.token) {
      setToken(response.data.token);
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    throw error;
  }
};

// Fungsi untuk mengirim ulang email verifikasi
export const resendVerification = async (
  email: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axios.post(`${API_URL}/auth/resend-verification`, { email });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    throw error;
  }
};

// Fungsi untuk logout
export const logout = (): void => {
  removeToken();
  // Bisa menambahkan panggilan API untuk invalidasi token di server jika perlu
};

// Fungsi untuk reset password
export const forgotPassword = async (
  email: string
): Promise<{
  success: boolean;
  message: string;
  resetToken?: string;
  redirectTo?: string;
}> => {
  try {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    throw error;
  }
};

// Fungsi untuk verifikasi OTP reset password
export const verifyResetOtp = async (
  email: string,
  otp: string,
  resetToken: string
): Promise<{
  success: boolean;
  message: string;
  resetToken?: string;
  canResetPassword?: boolean;
}> => {
  try {
    const response = await axios.post(`${API_URL}/auth/verify-reset-otp`, {
      email,
      otp,
      resetToken,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    throw error;
  }
};

// Fungsi untuk reset password dengan token
export const resetPassword = async (
  resetToken: string,
  password: string,
  confirmPassword: string
): Promise<{
  success: boolean;
  message: string;
  redirectTo?: string;
}> => {
  try {
    const response = await axios.post(`${API_URL}/auth/reset-password`, {
      resetToken,
      password,
      confirmPassword,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    throw error;
  }
};

// Fungsi untuk mengaktifkan/menonaktifkan 2FA
export const toggleTwoFactor = async (): Promise<{
  success: boolean;
  message: string;
  data: {
    twoFactorEnabled: boolean;
  };
}> => {
  try {
    const token = getToken();
    const response = await axios.post(
      `${API_URL}/auth/toggle-two-factor`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Update data user di localStorage
    const user = getUser();
    if (user && response.data.success) {
      setUser({
        ...user,
        twoFactorEnabled: response.data.data.twoFactorEnabled,
      });
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    throw error;
  }
};

// Fungsi untuk login dengan Google
export const googleLogin = async (token: string, profile: any): Promise<LoginResponse> => {
  try {
    const response = await axios.post(`${API_URL}/auth/google`, { token, profile });

    if (response.data.success && response.data.token) {
      setToken(response.data.token);
      if (response.data.data) {
        setUser(response.data.data);
      }
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    throw error;
  }
};
