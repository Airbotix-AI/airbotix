import { create } from 'zustand';
import { AuthStore, AuthState } from '@/types/auth';
import { authAPI, getStoredUser, refreshToken } from '@/services/api';
import toast from 'react-hot-toast';

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  authState: 'idle',
  error: null,
  resendCooldown: 0,

  // Initialize auth state
  initialize: async () => {
    try {
      const storedUser = getStoredUser();

      // For development: if we have a stored user, trust it
      // This prevents issues with MSW initialization timing
      if (import.meta.env.DEV && storedUser) {
        set({
          user: storedUser,
          isAuthenticated: true,
          authState: 'success',
        });
        return;
      }

      // For production or no stored user: validate with server
      try {
        const user = await authAPI.getProfile();
        set({
          user,
          isAuthenticated: true,
          authState: 'success',
        });
      } catch {
        // If server call fails, clear auth state
        set({
          user: null,
          isAuthenticated: false,
          authState: 'idle',
        });
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      set({
        user: null,
        isAuthenticated: false,
        authState: 'idle',
      });
    }
  },

  // Request OTP
  requestOtp: async (email: string) => {
    set({ authState: 'sending', error: null });

    try {
      await authAPI.requestOtp(email);
      set({ authState: 'sent' });

      // Start cooldown
      get().startCooldown(60);

      toast.success('Verification code sent to your email');
    } catch (error) {
      const errorMessage = (error as Error).message;
      set({
        authState: 'error',
        error: errorMessage,
      });
      toast.error(`Failed to send code: ${errorMessage}`);
    }
  },

  // Verify OTP and login
  login: async (email: string, code: string) => {
    set({ authState: 'verifying', error: null });

    try {
      const response = await authAPI.verifyOtp(email, code);
      const { user } = response.data;

      set({
        user,
        isAuthenticated: true,
        authState: 'success',
        error: null,
      });

      // Store user data in localStorage for persistence
      localStorage.setItem('airbotix_user', JSON.stringify(user));

      toast.success('Login successful!');

      // Redirect to dashboard after successful login
      setTimeout(() => {
        window.location.pathname = '/dashboard';
      }, 1000);
    } catch (error) {
      const errorMessage = (error as Error).message;
      set({
        authState: 'error',
        error: errorMessage,
        isAuthenticated: false,
        user: null,
      });
      toast.error(`Login failed: ${errorMessage}`);
    }
  },

  // Logout
  logout: async () => {
    try {
      await authAPI.logout();
      set({
        user: null,
        isAuthenticated: false,
        authState: 'idle',
        error: null,
        resendCooldown: 0,
      });

      // Clear user data from localStorage
      localStorage.removeItem('airbotix_user');

      toast.success('Logged out successfully');

      // Redirect to home page
      window.location.pathname = '/';
    } catch (error) {
      console.error('Logout failed:', error);
      // Force logout locally even if API call fails
      set({
        user: null,
        isAuthenticated: false,
        authState: 'idle',
        error: null,
        resendCooldown: 0,
      });

      // Clear user data from localStorage
      localStorage.removeItem('airbotix_user');

      window.location.pathname = '/';
    }
  },

  // Refresh token
  refreshToken: async (): Promise<boolean> => {
    try {
      const success = await refreshToken();
      if (success) {
        // Optionally refresh user data
        try {
          const user = await authAPI.getProfile();
          set({ user });
        } catch (error) {
          console.warn('Failed to refresh user data:', error);
        }
      }
      return success;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  },

  // Set auth state
  setAuthState: (state: AuthState) => {
    set({ authState: state });
  },

  // Set error
  setError: (error: string | null) => {
    set({ error, authState: error ? 'error' : 'idle' });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Start countdown for resend cooldown
  startCooldown: (seconds: number) => {
    set({ resendCooldown: seconds });

    const interval = setInterval(() => {
      const currentCooldown = get().resendCooldown;
      if (currentCooldown <= 1) {
        clearInterval(interval);
        set({ resendCooldown: 0 });
      } else {
        set({ resendCooldown: currentCooldown - 1 });
      }
    }, 1000);
  },
}));