import { AuthService } from '../../src/services/auth.service';
import { UserService } from '../../src/services/user.service';
import { OtpService } from '../../src/services/otp.service';
import { RateLimitService } from '../../src/services/rate-limit.service';
import { MemoryUserRepository } from '../../src/repositories/memory/memory-user.repository';
import { MemoryOtpRepository } from '../../src/repositories/memory/memory-otp.repository';
import { MemoryRefreshTokenRepository } from '../../src/repositories/memory/memory-refresh-token.repository';
import { MemoryRateLimitRepository } from '../../src/repositories/memory/memory-rate-limit.repository';
import { MockAdapter } from '../../src/adapters/mock.adapter';
import { ErrorCode } from '../../src/types/errors';
import { extractOtpFromEmail } from '../helpers/test-utils';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let otpService: OtpService;
  let rateLimitService: RateLimitService;
  let refreshTokenRepository: MemoryRefreshTokenRepository;

  beforeEach(() => {
    const userRepository = new MemoryUserRepository();
    const otpRepository = new MemoryOtpRepository();
    const rateLimitRepository = new MemoryRateLimitRepository();
    refreshTokenRepository = new MemoryRefreshTokenRepository();

    userService = new UserService(userRepository);
    otpService = new OtpService(otpRepository);
    rateLimitService = new RateLimitService(rateLimitRepository);
    authService = new AuthService(
      userService,
      otpService,
      rateLimitService,
      refreshTokenRepository
    );

    MockAdapter.clear();
  });

  afterEach(() => {
    MockAdapter.clear();
  });

  describe('requestOtp', () => {
    it('should successfully request OTP for valid email', async () => {
      const email = 'test@example.com';
      const clientIp = '192.168.1.1';

      await authService.requestOtp(email, clientIp);

      const sentEmails = MockAdapter.getSentEmails();
      expect(sentEmails).toHaveLength(1);
      expect(sentEmails[0].to).toBe(email);
      expect(sentEmails[0].subject).toBe('Your login code');
      expect(sentEmails[0].html).toContain('Your Login Code');
    });

    it('should send email with valid OTP code', async () => {
      const email = 'test@example.com';
      const clientIp = '192.168.1.1';

      await authService.requestOtp(email, clientIp);

      const sentEmails = MockAdapter.getSentEmails();
      const otpCode = extractOtpFromEmail(sentEmails[0].html);

      expect(otpCode).toHaveLength(6);
      expect(otpCode).toMatch(/^\d{6}$/);
    });

    it('should enforce rate limiting', async () => {
      const email = 'test@example.com';
      const clientIp = '192.168.1.1';

      // Make multiple requests to trigger rate limit
      const promises = [];
      for (let i = 0; i < 15; i++) {
        promises.push(authService.requestOtp(email, clientIp));
      }

      await expect(Promise.all(promises)).rejects.toThrow(ErrorCode.RATE_LIMIT_EXCEEDED);
    });

    it('should enforce OTP cooldown', async () => {
      const email = 'test@example.com';
      const clientIp = '192.168.1.1';

      // Request first OTP
      await authService.requestOtp(email, clientIp);

      // Immediate second request should fail due to cooldown
      await expect(authService.requestOtp(email, clientIp))
        .rejects
        .toThrow(ErrorCode.OTP_COOLDOWN_ACTIVE);
    });
  });

  describe('verifyOtpAndLogin', () => {
    it('should successfully authenticate with valid OTP', async () => {
      const email = 'test@example.com';
      const clientIp = '192.168.1.1';

      // Request OTP
      await authService.requestOtp(email, clientIp);

      // Get OTP from mock email
      const sentEmails = MockAdapter.getSentEmails();
      const otpCode = extractOtpFromEmail(sentEmails[0].html);

      // Verify OTP and login
      const result = await authService.verifyOtpAndLogin(email, otpCode, clientIp);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('tokens');
      expect(result.user.email).toBe(email);
      expect(result.tokens).toHaveProperty('accessToken');
      expect(result.tokens).toHaveProperty('refreshToken');
    });

    it('should create new user on first login', async () => {
      const email = 'newuser@example.com';
      const clientIp = '192.168.1.1';

      await authService.requestOtp(email, clientIp);

      const sentEmails = MockAdapter.getSentEmails();
      const otpCode = extractOtpFromEmail(sentEmails[0].html);

      const result = await authService.verifyOtpAndLogin(email, otpCode, clientIp);

      expect(result.user.email).toBe(email);
      expect(result.user.id).toBeTruthy();
    });

    it('should update last login timestamp', async () => {
      const email = 'test@example.com';
      const clientIp = '192.168.1.1';

      await authService.requestOtp(email, clientIp);

      const sentEmails = MockAdapter.getSentEmails();
      const otpCode = extractOtpFromEmail(sentEmails[0].html);

      const result = await authService.verifyOtpAndLogin(email, otpCode, clientIp);

      expect(result.user.lastLoginAt).toBeTruthy();
      expect(result.user.lastLoginAt).toBeInstanceOf(Date);
    });

    it('should fail with invalid OTP', async () => {
      const email = 'test@example.com';
      const clientIp = '192.168.1.1';

      await authService.requestOtp(email, clientIp);

      await expect(authService.verifyOtpAndLogin(email, '000000', clientIp))
        .rejects
        .toThrow(ErrorCode.OTP_INVALID);
    });

    it('should enforce rate limiting on verification attempts', async () => {
      const email = 'test@example.com';
      const clientIp = '192.168.1.1';

      // Make multiple verification attempts to trigger rate limit
      const promises = [];
      for (let i = 0; i < 25; i++) {
        promises.push(
          authService.verifyOtpAndLogin(email, '000000', clientIp).catch(() => {})
        );
      }

      await Promise.all(promises);

      // Next attempt should fail due to rate limit
      await expect(authService.verifyOtpAndLogin(email, '000000', clientIp))
        .rejects
        .toThrow(ErrorCode.RATE_LIMIT_EXCEEDED);
    });
  });

  describe('refreshTokens', () => {
    let validRefreshToken: string;
    // userId removed: not needed for refresh token tests

    beforeEach(async () => {
      const email = 'test@example.com';
      const clientIp = '192.168.1.1';

      await authService.requestOtp(email, clientIp);

      const sentEmails = MockAdapter.getSentEmails();
      const otpCode = extractOtpFromEmail(sentEmails[0].html);

      const result = await authService.verifyOtpAndLogin(email, otpCode, clientIp);
      validRefreshToken = result.tokens.refreshToken;
    });

    it('should successfully refresh tokens with valid refresh token', async () => {
      const newTokens = await authService.refreshTokens(validRefreshToken);

      expect(newTokens).toHaveProperty('accessToken');
      expect(newTokens).toHaveProperty('refreshToken');
      expect(newTokens.accessToken).not.toBe(validRefreshToken);
      expect(newTokens.refreshToken).not.toBe(validRefreshToken);
    });

    it('should revoke old refresh token when creating new ones', async () => {
      await authService.refreshTokens(validRefreshToken);

      // Old refresh token should no longer work
      await expect(authService.refreshTokens(validRefreshToken))
        .rejects
        .toThrow(ErrorCode.TOKEN_INVALID);
    });

    it('should fail with invalid refresh token', async () => {
      const invalidToken = 'invalid-token';

      await expect(authService.refreshTokens(invalidToken))
        .rejects
        .toThrow(ErrorCode.TOKEN_INVALID);
    });

    it('should fail with expired refresh token', async () => {
      // Find the refresh token record and expire it
      const tokenRecord = await refreshTokenRepository.findByToken(validRefreshToken);
      if (tokenRecord) {
        tokenRecord.expiresAt = new Date(Date.now() - 1000); // 1 second ago
      }

      await expect(authService.refreshTokens(validRefreshToken))
        .rejects
        .toThrow(ErrorCode.TOKEN_EXPIRED);
    });
  });

  describe('logout', () => {
    let validRefreshToken: string;

    beforeEach(async () => {
      const email = 'test@example.com';
      const clientIp = '192.168.1.1';

      await authService.requestOtp(email, clientIp);

      const sentEmails = MockAdapter.getSentEmails();
      const otpCode = extractOtpFromEmail(sentEmails[0].html);

      const result = await authService.verifyOtpAndLogin(email, otpCode, clientIp);
      validRefreshToken = result.tokens.refreshToken;
    });

    it('should successfully logout with refresh token', async () => {
      await expect(authService.logout(validRefreshToken)).resolves.not.toThrow();

      // Refresh token should be revoked
      await expect(authService.refreshTokens(validRefreshToken))
        .rejects
        .toThrow(ErrorCode.TOKEN_INVALID);
    });

    it('should handle logout without refresh token', async () => {
      await expect(authService.logout()).resolves.not.toThrow();
    });
  });

  describe('getProfile', () => {
    let userId: string;

    beforeEach(async () => {
      const email = 'test@example.com';
      const clientIp = '192.168.1.1';

      await authService.requestOtp(email, clientIp);

      const sentEmails = MockAdapter.getSentEmails();
      const otpCode = extractOtpFromEmail(sentEmails[0].html);

      const result = await authService.verifyOtpAndLogin(email, otpCode, clientIp);
      userId = result.user.id;
    });

    it('should return user profile for valid user ID', async () => {
      const profile = await authService.getProfile(userId);

      expect(profile).toHaveProperty('id', userId);
      expect(profile).toHaveProperty('email', 'test@example.com');
      expect(profile).toHaveProperty('lastLoginAt');
    });

    it('should throw error for invalid user ID', async () => {
      const invalidUserId = 'invalid-user-id';

      await expect(authService.getProfile(invalidUserId))
        .rejects
        .toThrow(ErrorCode.USER_NOT_FOUND);
    });
  });
});