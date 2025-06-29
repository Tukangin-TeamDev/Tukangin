import axios from 'axios';

/**
 * Base API configuration for different environments
 */
const API_CONFIG: {
  [key: string]: {
    baseURL: string;
    timeout: number;
  };
} = {
  development: {
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
    timeout: 10000,
  },
  production: {
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.tukangin.com/api',
    timeout: 15000,
  },
};

// Determine current environment
const environment = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const config = API_CONFIG[environment];

/**
 * Create Axios instance with environment-specific configuration
 */
const api = axios.create({
  baseURL: config.baseURL,
  timeout: config.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor for adding auth token
 */
api.interceptors.request.use(
  config => {
    // Get token from localStorage if in browser environment
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => Promise.reject(error)
);

/**
 * Response interceptor for handling common errors
 */
api.interceptors.response.use(
  response => response,
  error => {
    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if in browser
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        // Optional: redirect to login
        // window.location.href = '/login';
      }
    }

    // Handle 403 Forbidden errors (insufficient permissions)
    if (error.response && error.response.status === 403) {
      console.error('Permission denied:', error.response.data.message);
    }

    // Handle network errors
    if (error.message === 'Network Error') {
      console.error('Network error: Please check your internet connection');
    }

    return Promise.reject(error);
  }
);

export default api;
