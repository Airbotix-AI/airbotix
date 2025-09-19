import { Request, Response, NextFunction } from 'express';
import { AppError, ErrorCode } from '../types/errors';
import { logger } from '../utils/logger';

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
  path: string;
  method: string;
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      message: 'An unexpected error occurred',
    },
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
  };

  if (err instanceof AppError) {
    errorResponse.error = {
      code: err.code,
      message: err.message,
      details: err.details,
    };

    // Log application errors
    if (err.statusCode >= 500) {
      logger.error('Application error:', {
        error: err.message,
        code: err.code,
        stack: err.stack,
        path: req.path,
        method: req.method,
        body: req.body,
      });
    } else {
      logger.warn('Client error:', {
        error: err.message,
        code: err.code,
        path: req.path,
        method: req.method,
      });
    }

    res.status(err.statusCode).json(errorResponse);
    return;
  }

  // Handle Joi validation errors
  if (err.name === 'ValidationError') {
    const details = (err as any).details?.map((detail: any) => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));

    errorResponse.error = {
      code: ErrorCode.VALIDATION_ERROR,
      message: 'Validation failed',
      details,
    };

    logger.warn('Validation error:', {
      error: err.message,
      details,
      path: req.path,
      method: req.method,
      body: req.body,
    });

    res.status(400).json(errorResponse);
    return;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    errorResponse.error = {
      code: err.name === 'TokenExpiredError' ? ErrorCode.TOKEN_EXPIRED : ErrorCode.TOKEN_INVALID,
      message: err.name === 'TokenExpiredError' ? 'Token has expired' : 'Invalid token',
    };

    logger.warn('JWT error:', {
      error: err.message,
      path: req.path,
      method: req.method,
    });

    res.status(401).json(errorResponse);
    return;
  }

  // Log unexpected errors
  logger.error('Unexpected error:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
  });

  // Don't expose internal error details in production
  if (process.env.NODE_ENV === 'production') {
    errorResponse.error.message = 'Internal server error';
  } else {
    errorResponse.error.message = err.message;
  }

  res.status(500).json(errorResponse);
};