import { UserService } from './user.service';
import { OtpService } from './otp.service';
import { RateLimitService } from './rate-limit.service';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';
import { emailAdapter } from '../adapters/email.factory';
import { JwtUtil } from '../utils/jwt.util';
// import { CryptoUtil } from '../utils/crypto.util';
import { AppError, ErrorCode } from '../types/errors';
import { AuthResponse, TokenPair, User } from '../types/auth';
import { config } from '../config/env';
import { logger } from '../utils/logger';

export class AuthService {
  constructor(
    private userService: UserService,
    private otpService: OtpService,
    private rateLimitService: RateLimitService,
    private refreshTokenRepository: RefreshTokenRepository
  ) {}

  async requestOtp(email: string, clientIp: string): Promise<void> {
    // Check rate limiting
    const rateLimitKey = `otp_request:${clientIp}`;
    await this.rateLimitService.enforceRateLimit(rateLimitKey, 10, 15 * 60 * 1000); // 10 requests per 15 minutes

    // Check OTP cooldown
    await this.rateLimitService.checkOtpCooldown(email);

    // Generate OTP
    const code = await this.otpService.generateOtp(email);

    // Send OTP via email
    await this.sendOtpEmail(email, code);

    logger.info('OTP requested', {
      email: this.maskEmail(email),
      clientIp: this.maskIp(clientIp),
    });
  }

  async verifyOtpAndLogin(email: string, code: string, clientIp: string): Promise<AuthResponse> {
    // Check rate limiting
    const rateLimitKey = `otp_verify:${clientIp}`;
    await this.rateLimitService.enforceRateLimit(rateLimitKey, 20, 15 * 60 * 1000); // 20 attempts per 15 minutes

    // Verify OTP
    await this.otpService.verifyOtp(email, code);

    // Create or get user
    const user = await this.userService.createOrGetUser(email);

    // Update last login
    await this.userService.updateLastLogin(user.id);

    // Generate tokens
    const tokens = await this.generateTokenPair(user);

    logger.info('User authenticated successfully', {
      userId: user.id,
      email: this.maskEmail(email),
      clientIp: this.maskIp(clientIp),
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        lastLoginAt: user.lastLoginAt,
      },
      tokens,
    };
  }

  async refreshTokens(refreshToken: string): Promise<TokenPair> {
    // Find refresh token in database
    const tokenRecord = await this.refreshTokenRepository.findByToken(refreshToken);

    if (!tokenRecord) {
      throw AppError.unauthorized(
        ErrorCode.TOKEN_INVALID,
        ErrorCode.TOKEN_INVALID
      );
    }

    // Check if token is expired
    if (tokenRecord.expiresAt < new Date()) {
      await this.refreshTokenRepository.delete(tokenRecord.id);
      throw AppError.unauthorized(
        ErrorCode.TOKEN_EXPIRED,
        ErrorCode.TOKEN_EXPIRED
      );
    }

    // Get user
    const user = await this.userService.findByIdOrThrow(tokenRecord.userId);

    // Revoke old refresh token
    await this.refreshTokenRepository.revokeByToken(refreshToken);

    // Generate new tokens
    const tokens = await this.generateTokenPair(user);

    logger.info('Tokens refreshed', {
      userId: user.id,
      email: this.maskEmail(user.email),
    });

    return tokens;
  }

  async logout(refreshToken?: string): Promise<void> {
    if (refreshToken) {
      await this.refreshTokenRepository.revokeByToken(refreshToken);
      logger.info('User logged out', { refreshToken: this.maskToken(refreshToken) });
    }
  }

  async logoutAllSessions(userId: string): Promise<void> {
    await this.refreshTokenRepository.revokeAllForUser(userId);
    logger.info('All sessions logged out', { userId });
  }

  async getProfile(userId: string): Promise<Omit<User, 'createdAt' | 'updatedAt'>> {
    const user = await this.userService.findByIdOrThrow(userId);
    return {
      id: user.id,
      email: user.email,
      lastLoginAt: user.lastLoginAt,
    };
  }

  private async generateTokenPair(user: User): Promise<TokenPair> {
    const payload = {
      userId: user.id,
      email: user.email,
    };

    const accessToken = JwtUtil.generateAccessToken(payload);
    const refreshToken = JwtUtil.generateRefreshToken(payload);

    // Store refresh token
    await this.refreshTokenRepository.create({
      userId: user.id,
      token: refreshToken,
      expiresAt: JwtUtil.getExpirationTime(config.jwt.refreshExpiresIn),
    });

    return { accessToken, refreshToken };
  }

  private async sendOtpEmail(email: string, code: string): Promise<void> {
    const subject = 'Your login code';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Login Code</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
          .code { font-size: 32px; font-weight: bold; color: #007bff; text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px; letter-spacing: 4px; }
          .warning { color: #dc3545; font-size: 14px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <h2>Your Login Code</h2>
        <p>Use this code to complete your login:</p>
        <div class="code">${code}</div>
        <p>This code will expire in ${config.otp.ttlMinutes} minutes.</p>
        <div class="warning">
          <strong>Security Notice:</strong> If you didn't request this code, please ignore this email.
        </div>
      </body>
      </html>
    `;

    const text = `
      Your login code: ${code}

      This code will expire in ${config.otp.ttlMinutes} minutes.

      If you didn't request this code, please ignore this email.
    `;

    try {
      await emailAdapter.sendEmail({
        to: email,
        subject,
        html,
        text,
      });
    } catch (error) {
      logger.error('Failed to send OTP email', {
        email: this.maskEmail(email),
        error,
      });
      throw AppError.internal(
        ErrorCode.EMAIL_SEND_FAILED,
        'Failed to send verification code'
      );
    }
  }

  private maskEmail(email: string): string {
    const [local, domain] = email.split('@');
    if (local.length <= 2) return email;
    return `${local.substring(0, 2)}***@${domain}`;
  }

  private maskIp(ip: string): string {
    const parts = ip.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.***.***.`;
    }
    return ip.substring(0, 4) + '***';
  }

  private maskToken(token: string): string {
    if (token.length <= 8) return token;
    return `${token.substring(0, 4)}***${token.substring(token.length - 4)}`;
  }
}