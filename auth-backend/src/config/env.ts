import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = [
  'JWT_SECRET',
  'APP_BASE_URL',
  'EMAIL_FROM',
  'EMAIL_PROVIDER'
] as const;

// Validate required environment variables
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

export const config = {
  app: {
    env: process.env.NODE_ENV as 'development' | 'production' | 'test' || 'development',
    port: parseInt(process.env.PORT || '3000'),
    baseUrl: process.env.APP_BASE_URL!,
  },
  jwt: {
    secret: process.env.JWT_SECRET!,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  otp: {
    length: parseInt(process.env.OTP_LENGTH || '6'),
    ttlMinutes: parseInt(process.env.OTP_TTL_MIN || '10'),
    maxVerifyAttempts: parseInt(process.env.OTP_MAX_VERIFY_ATTEMPTS || '5'),
    resendCooldownSeconds: parseInt(process.env.OTP_RESEND_COOLDOWN_SEC || '60'),
  },
  email: {
    from: process.env.EMAIL_FROM!,
    provider: process.env.EMAIL_PROVIDER as 'sendgrid' | 'smtp' | 'mock',
    apiKey: process.env.EMAIL_API_KEY,
    smtp: {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  },
  cookie: {
    secure: process.env.COOKIE_SECURE === 'true',
    httpOnly: process.env.COOKIE_HTTP_ONLY !== 'false',
    sameSite: (process.env.COOKIE_SAME_SITE as 'strict' | 'lax' | 'none') || 'lax',
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  },
};