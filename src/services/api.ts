import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, API_ENDPOINTS, STORAGE_KEYS, AUTH_METHODS } from '@/constants/auth';
import { AuthResponse, ApiError, User } from '@/types/auth';
import toast from 'react-hot-toast';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // Important for cookie-based auth
  headers: {
    'Content-Type': 'application/json',
  },
});

// Storage utilities
const storage = {
  get: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Silent fail for storage issues
    }
  },
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch {
      // Silent fail
    }
  },
  clear: (): void => {
    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
    } catch {
      // Silent fail
    }
  },
};

// Get current auth method
const getAuthMethod = (): string => {
  return storage.get(STORAGE_KEYS.AUTH_METHOD) || AUTH_METHODS.COOKIE;
};

// Set auth method preference
const setAuthMethod = (method: string): void => {
  storage.set(STORAGE_KEYS.AUTH_METHOD, method);
};

// Request interceptor - attach tokens for Bearer auth
api.interceptors.request.use(
  (config) => {
    const authMethod = getAuthMethod();

    if (authMethod === AUTH_METHODS.BEARER) {
      const accessToken = storage.get(STORAGE_KEYS.ACCESS_TOKEN);
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    } else {
      // For cookie auth, add header to indicate preference
      config.headers['X-Auth-Method'] = 'cookie';
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    // Check if error is 401 and we haven't already retried
    if (
      error.response?.status === 401 &&
      originalRequest &&
      originalRequest && !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshed = await refreshToken();
        if (refreshed && originalRequest.headers) {
          // Retry original request with new token
          const authMethod = getAuthMethod();
          if (authMethod === AUTH_METHODS.BEARER) {
            const newToken = storage.get(STORAGE_KEYS.ACCESS_TOKEN);
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
          }
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        handleAuthFailure();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Handle authentication failure
const handleAuthFailure = (): void => {
  storage.clear();

  // Only redirect if not already on login/verify pages
  const currentPath = window.location.pathname;
  if (!['/login', '/verify', '/'].includes(currentPath)) {
    window.location.pathname = '/login';
    toast.error('Session expired. Please sign in again.');
  }
};

// API Methods
export const authAPI = {
  // Request OTP
  async requestOtp(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const authMethod = getAuthMethod();
      const headers: Record<string, string> = {};

      if (authMethod === AUTH_METHODS.COOKIE) {
        headers['X-Auth-Method'] = 'cookie';
      }

      const response: AxiosResponse<{ success: boolean; message: string }> =
        await api.post(API_ENDPOINTS.REQUEST_OTP, { email }, { headers });

      return response.data;
    } catch (error) {
      throw mapApiError(error as AxiosError<ApiError>);
    }
  },

  // Verify OTP and login
  async verifyOtp(email: string, code: string): Promise<AuthResponse> {
    try {
      const authMethod = getAuthMethod();
      const headers: Record<string, string> = {};

      if (authMethod === AUTH_METHODS.COOKIE) {
        headers['X-Auth-Method'] = 'cookie';
      }

      const response: AxiosResponse<AuthResponse> = await api.post(
        API_ENDPOINTS.VERIFY_OTP,
        { email, code },
        { headers }
      );

      const { data } = response;

      // Store user data
      if (data.data.user) {
        storage.set(STORAGE_KEYS.USER, JSON.stringify(data.data.user));
      }

      // Store tokens if using Bearer auth
      if (authMethod === AUTH_METHODS.BEARER && data.data.tokens) {
        storage.set(STORAGE_KEYS.ACCESS_TOKEN, data.data.tokens.accessToken);
        storage.set(STORAGE_KEYS.REFRESH_TOKEN, data.data.tokens.refreshToken);
      }

      return data;
    } catch (error) {
      throw mapApiError(error as AxiosError<ApiError>);
    }
  },

  // Get current user profile
  async getProfile(): Promise<User> {
    try {
      const response: AxiosResponse<{ success: boolean; data: { user: User } }> =
        await api.get(API_ENDPOINTS.ME);

      const user = response.data.data.user;
      storage.set(STORAGE_KEYS.USER, JSON.stringify(user));

      return user;
    } catch (error) {
      throw mapApiError(error as AxiosError<ApiError>);
    }
  },

  // Logout
  async logout(): Promise<void> {
    try {
      const authMethod = getAuthMethod();
      const requestData: { refreshToken?: string } = {};

      // Include refresh token for Bearer auth
      if (authMethod === AUTH_METHODS.BEARER) {
        const refreshToken = storage.get(STORAGE_KEYS.REFRESH_TOKEN);
        if (refreshToken) {
          requestData.refreshToken = refreshToken;
        }
      }

      await api.post(API_ENDPOINTS.LOGOUT, requestData);
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      // Always clear local storage
      storage.clear();
    }
  },
};

// Refresh token function
export const refreshToken = async (): Promise<boolean> => {
  try {
    const authMethod = getAuthMethod();
    const requestData: { refreshToken?: string } = {};

    if (authMethod === AUTH_METHODS.BEARER) {
      const refreshToken = storage.get(STORAGE_KEYS.REFRESH_TOKEN);
      if (!refreshToken) {
        return false;
      }
      requestData.refreshToken = refreshToken;
    }

    const response: AxiosResponse<{
      success: boolean;
      data: { tokens?: { accessToken: string; refreshToken: string } };
    }> = await api.post(API_ENDPOINTS.REFRESH_TOKEN, requestData);

    // Store new tokens for Bearer auth
    if (authMethod === AUTH_METHODS.BEARER && response.data.data.tokens) {
      const { accessToken, refreshToken: newRefreshToken } = response.data.data.tokens;
      storage.set(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      storage.set(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
    }

    return true;
  } catch (error) {
    console.warn('Token refresh failed:', error);
    return false;
  }
};

// Map API errors to user-friendly messages
const mapApiError = (error: AxiosError<ApiError>): Error => {
  if (!error.response) {
    return new Error('NETWORK_ERROR');
  }

  const { data } = error.response;
  if (data?.error?.code) {
    return new Error(data.error.code);
  }

  // Map HTTP status codes to error codes
  switch (error.response.status) {
    case 400:
      return new Error('EMAIL_INVALID');
    case 401:
      return new Error('UNAUTHORIZED');
    case 429:
      return new Error('TOO_MANY_REQUESTS');
    case 500:
    default:
      return new Error('UNKNOWN_ERROR');
  }
};

// Utility functions
export const getStoredUser = (): User | null => {
  try {
    const userStr = storage.get(STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  const authMethod = getAuthMethod();

  if (authMethod === AUTH_METHODS.BEARER) {
    const accessToken = storage.get(STORAGE_KEYS.ACCESS_TOKEN);
    return !!accessToken;
  } else {
    // For cookie auth, check if user data exists in localStorage
    // If no user data, assume we need to check with server
    const storedUser = getStoredUser();
    return !!storedUser;
  }
};

export { storage, setAuthMethod, getAuthMethod };