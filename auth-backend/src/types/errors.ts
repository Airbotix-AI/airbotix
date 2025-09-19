export enum ErrorCode {
  // Authentication Errors
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  UNAUTHORIZED = 'UNAUTHORIZED',

  // OTP Errors
  OTP_INVALID = 'OTP_INVALID',
  OTP_EXPIRED = 'OTP_EXPIRED',
  OTP_MAX_ATTEMPTS_EXCEEDED = 'OTP_MAX_ATTEMPTS_EXCEEDED',
  OTP_COOLDOWN_ACTIVE = 'OTP_COOLDOWN_ACTIVE',
  OTP_NOT_FOUND = 'OTP_NOT_FOUND',

  // Validation Errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_EMAIL = 'INVALID_EMAIL',
  INVALID_OTP_CODE = 'INVALID_OTP_CODE',

  // User Errors
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',

  // Rate Limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',

  // System Errors
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  EMAIL_SEND_FAILED = 'EMAIL_SEND_FAILED',
  DATABASE_ERROR = 'DATABASE_ERROR',
}

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    public message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(code: ErrorCode, message: string, details?: any): AppError {
    return new AppError(code, message, 400, details);
  }

  static unauthorized(code: ErrorCode, message: string, details?: any): AppError {
    return new AppError(code, message, 401, details);
  }

  static forbidden(code: ErrorCode, message: string, details?: any): AppError {
    return new AppError(code, message, 403, details);
  }

  static notFound(code: ErrorCode, message: string, details?: any): AppError {
    return new AppError(code, message, 404, details);
  }

  static tooManyRequests(code: ErrorCode, message: string, details?: any): AppError {
    return new AppError(code, message, 429, details);
  }

  static internal(code: ErrorCode, message: string, details?: any): AppError {
    return new AppError(code, message, 500, details);
  }
}