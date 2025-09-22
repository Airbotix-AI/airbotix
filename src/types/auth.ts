export interface User {
  id: string;
  email: string;
  lastLoginAt?: string;
}

export interface LoginTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    tokens?: LoginTokens;
  };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
<<<<<<< HEAD
    details?: Record<string, unknown> | unknown[];
=======
    details?: unknown;
>>>>>>> 61e6a79 (Fix(lint code): fix lint code errors for homepage)
  };
  timestamp: string;
  path: string;
  method: string;
}

export interface RequestOtpRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  code: string;
}

export interface RefreshTokenRequest {
  refreshToken?: string;
}

export type AuthState =
  | 'idle'
  | 'sending'
  | 'sent'
  | 'verifying'
  | 'success'
  | 'error';

export type ErrorCode =
  | 'EMAIL_INVALID'
  | 'EMAIL_NOT_ALLOWED'
  | 'TOO_MANY_REQUESTS'
  | 'OTP_INVALID'
  | 'OTP_EXPIRED'
  | 'OTP_MAX_ATTEMPTS_EXCEEDED'
  | 'OTP_COOLDOWN_ACTIVE'
  | 'TOKEN_EXPIRED'
  | 'TOKEN_INVALID'
  | 'UNAUTHORIZED'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';

export interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  authState: AuthState;
  error: string | null;
  resendCooldown: number;
  login: (email: string, code: string) => Promise<void>;
  requestOtp: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  setAuthState: (state: AuthState) => void;
  setError: (error: string | null) => void;
  startCooldown: (seconds: number) => void;
  clearError: () => void;
  initialize: () => Promise<void>;
}