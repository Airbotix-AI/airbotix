import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { RequestOtpRequest, VerifyOtpRequest, RefreshTokenRequest } from '../types/auth';
import { config } from '../config/env';

export class AuthController {
  constructor(private authService: AuthService) {}

  requestOtp = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const { email }: RequestOtpRequest = req.body;
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';

    await this.authService.requestOtp(email, clientIp);

    res.json({
      success: true,
      message: 'Verification code sent to your email',
      data: {
        email,
        expiresInMinutes: config.otp.ttlMinutes,
        cooldownSeconds: config.otp.resendCooldownSeconds,
      },
    });
  };

  verifyOtp = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const { email, code }: VerifyOtpRequest = req.body;
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';

    const authResponse = await this.authService.verifyOtpAndLogin(email, code, clientIp);

    // Set cookies if using cookie-based auth
    if (this.shouldUseCookies(req)) {
      this.setAuthCookies(res, authResponse.tokens);
    }

    res.json({
      success: true,
      message: 'Authentication successful',
      data: {
        user: authResponse.user,
        tokens: this.shouldUseCookies(req) ? undefined : authResponse.tokens,
      },
    });
  };

  refreshToken = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    let refreshToken: string | undefined;

    // Get refresh token from request body or cookies
    const { refreshToken: bodyToken }: RefreshTokenRequest = req.body;
    if (bodyToken) {
      refreshToken = bodyToken;
    } else if (req.cookies?.refreshToken) {
      refreshToken = req.cookies.refreshToken;
    }

    if (!refreshToken) {
      res.status(401).json({
        success: false,
        error: {
          code: 'TOKEN_REQUIRED',
          message: 'Refresh token is required',
        },
      });
      return;
    }

    const tokens = await this.authService.refreshTokens(refreshToken);

    // Set cookies if using cookie-based auth
    if (this.shouldUseCookies(req)) {
      this.setAuthCookies(res, tokens);
    }

    res.json({
      success: true,
      message: 'Tokens refreshed successfully',
      data: {
        tokens: this.shouldUseCookies(req) ? undefined : tokens,
      },
    });
  };

  logout = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    let refreshToken: string | undefined;

    // Get refresh token from cookies or body
    if (req.cookies?.refreshToken) {
      refreshToken = req.cookies.refreshToken;
    } else if (req.body.refreshToken) {
      refreshToken = req.body.refreshToken;
    }

    await this.authService.logout(refreshToken);

    // Clear cookies
    if (req.cookies?.accessToken || req.cookies?.refreshToken) {
      this.clearAuthCookies(res);
    }

    res.json({
      success: true,
      message: 'Logged out successfully',
      data: {},
    });
  };

  getProfile = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const userId = req.user!.userId;
    const profile = await this.authService.getProfile(userId);

    res.json({
      success: true,
      data: { user: profile },
    });
  };

  private shouldUseCookies(req: Request): boolean {
    // Check if client prefers cookies (can be determined by header or query param)
    return req.headers['x-auth-method'] === 'cookie' || req.query.authMethod === 'cookie';
  }

  private setAuthCookies(res: Response, tokens: { accessToken: string; refreshToken: string }): void {
    // Set access token cookie (shorter expiry)
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: config.cookie.httpOnly,
      secure: config.cookie.secure,
      sameSite: config.cookie.sameSite,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // Set refresh token cookie (longer expiry)
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: config.cookie.httpOnly,
      secure: config.cookie.secure,
      sameSite: config.cookie.sameSite,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/auth/refresh', // Only send with refresh requests
    });
  }

  private clearAuthCookies(res: Response): void {
    res.clearCookie('accessToken', {
      httpOnly: config.cookie.httpOnly,
      secure: config.cookie.secure,
      sameSite: config.cookie.sameSite,
    });

    res.clearCookie('refreshToken', {
      httpOnly: config.cookie.httpOnly,
      secure: config.cookie.secure,
      sameSite: config.cookie.sameSite,
      path: '/auth/refresh',
    });
  }
}