import { Request, Response, NextFunction } from 'express';
import { JwtUtil } from '../utils/jwt.util';
import { AppError, ErrorCode } from '../types/errors';
import { JwtPayload } from '../types/auth';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}

export const authenticateToken = (req: Request, _res: Response, next: NextFunction): void => {
  let token: string | undefined;

  // Try to get token from Authorization header (Bearer token)
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  // Try to get token from cookies if not found in header
  if (!token && req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw AppError.unauthorized(
      ErrorCode.UNAUTHORIZED,
      'Access token is required'
    );
  }

  try {
    const payload = JwtUtil.verifyToken(token) as JwtPayload;

    if (payload.type !== 'access') {
      throw AppError.unauthorized(
        ErrorCode.TOKEN_INVALID,
        'Invalid token type'
      );
    }

    req.user = {
      userId: payload.userId,
      email: payload.email,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    // JWT verification errors are handled by error handler
    throw error;
  }
};

export const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    authenticateToken(req, res, next);
  } catch (error) {
    // Continue without authentication
    next();
  }
};