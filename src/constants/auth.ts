export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  REQUEST_OTP: '/auth/request-otp',
  VERIFY_OTP: '/auth/verify-otp',
  REFRESH_TOKEN: '/auth/refresh',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  VERIFY: '/verify',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
  WORKSHOPS: '/workshops',
  ABOUT: '/about',
  CONTACT: '/contact',
  BOOK: '/book',
  MEDIA: '/media',
  BLOG: '/blog',
} as const;

export const ERROR_CODES = {
  EMAIL_INVALID: 'EMAIL_INVALID',
  EMAIL_NOT_ALLOWED: 'EMAIL_NOT_ALLOWED',
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
  OTP_INVALID: 'OTP_INVALID',
  OTP_EXPIRED: 'OTP_EXPIRED',
  OTP_MAX_ATTEMPTS_EXCEEDED: 'OTP_MAX_ATTEMPTS_EXCEEDED',
  OTP_COOLDOWN_ACTIVE: 'OTP_COOLDOWN_ACTIVE',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  UNAUTHORIZED: 'UNAUTHORIZED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'airbotix_access_token',
  REFRESH_TOKEN: 'airbotix_refresh_token',
  USER: 'airbotix_user',
  LANGUAGE: 'airbotix_language',
  AUTH_METHOD: 'airbotix_auth_method',
} as const;

export const AUTH_METHODS = {
  COOKIE: 'cookie',
  BEARER: 'bearer',
} as const;

export const OTP_CONFIG = {
  LENGTH: 6,
  COOLDOWN_SECONDS: 60,
  MAX_ATTEMPTS: 5,
} as const;

export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  OTP_CODE: /^\d{6}$/,
} as const;