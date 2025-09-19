import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validation.middleware';
import { authenticateToken } from '../middleware/auth.middleware';
import {
  requestOtpSchema,
  verifyOtpSchema,
  refreshTokenSchema,
} from '../validators/auth.validator';

export const createAuthRoutes = (authController: AuthController): Router => {
  const router = Router();

  // POST /auth/request-otp - Request OTP for email
  router.post(
    '/request-otp',
    validate(requestOtpSchema),
    authController.requestOtp
  );

  // POST /auth/verify-otp - Verify OTP and login
  router.post(
    '/verify-otp',
    validate(verifyOtpSchema),
    authController.verifyOtp
  );

  // POST /auth/refresh - Refresh access token
  router.post(
    '/refresh',
    validate(refreshTokenSchema),
    authController.refreshToken
  );

  // POST /auth/logout - Logout (revoke refresh token)
  router.post('/logout', authController.logout);

  // GET /auth/me - Get current user profile
  router.get('/me', authenticateToken, authController.getProfile);

  return router;
};