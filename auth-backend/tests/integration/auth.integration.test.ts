import request from 'supertest';
import { app } from '../../src/app';
import { MockAdapter } from '../../src/adapters/mock.adapter';
import { container } from '../../src/services/container';
import {
  extractOtpFromEmail,
  expectSuccessResponse,
  expectErrorResponse,
  expectValidTokens,
  cleanupTestContainer,
} from '../helpers/test-utils';

describe('Auth Integration Tests', () => {
  beforeEach(() => {
    cleanupTestContainer(container);
  });

  afterEach(() => {
    cleanupTestContainer(container);
  });

  describe('POST /auth/request-otp', () => {
    it('should successfully request OTP for valid email', async () => {
      const response = await request(app)
        .post('/auth/request-otp')
        .send({ email: 'test@example.com' })
        .expect(200);

      expectSuccessResponse(response);
      expect(response.body.message).toBe('Verification code sent to your email');
      expect(response.body.data.email).toBe('test@example.com');

      // Verify email was sent
      const sentEmails = MockAdapter.getSentEmails();
      expect(sentEmails).toHaveLength(1);
      expect(sentEmails[0].to).toBe('test@example.com');
    });

    it('should fail with invalid email format', async () => {
      const response = await request(app)
        .post('/auth/request-otp')
        .send({ email: 'invalid-email' })
        .expect(400);

      expectErrorResponse(response, 'VALIDATION_ERROR');
    });

    it('should fail with missing email', async () => {
      const response = await request(app)
        .post('/auth/request-otp')
        .send({})
        .expect(400);

      expectErrorResponse(response, 'VALIDATION_ERROR');
    });

    it('should enforce OTP cooldown', async () => {
      const email = 'test@example.com';

      // First request should succeed
      await request(app)
        .post('/auth/request-otp')
        .send({ email })
        .expect(200);

      // Immediate second request should fail
      const response = await request(app)
        .post('/auth/request-otp')
        .send({ email })
        .expect(429);

      expectErrorResponse(response, 'OTP_COOLDOWN_ACTIVE');
    });
  });

  describe('POST /auth/verify-otp', () => {
    const setupOtpTest = async (email = 'test@example.com') => {
      await request(app)
        .post('/auth/request-otp')
        .send({ email })
        .expect(200);

      const sentEmails = MockAdapter.getSentEmails();
      const otpCode = extractOtpFromEmail(sentEmails[sentEmails.length - 1].html);

      return { email, otpCode };
    };

    it('should successfully verify OTP and return tokens', async () => {
      const { email, otpCode } = await setupOtpTest();

      const response = await request(app)
        .post('/auth/verify-otp')
        .send({ email, code: otpCode })
        .expect(200);

      expectSuccessResponse(response);
      expect(response.body.message).toBe('Authentication successful');
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data.user).toHaveProperty('email', email);
      expect(response.body.data.user).toHaveProperty('lastLoginAt');

      expectValidTokens(response.body.data.tokens);
    });

    it('should create new user on first login', async () => {
      const { email, otpCode } = await setupOtpTest('newuser@example.com');

      const response = await request(app)
        .post('/auth/verify-otp')
        .send({ email, code: otpCode })
        .expect(200);

      expectSuccessResponse(response);
      expect(response.body.data.user.email).toBe(email);
      expect(response.body.data.user.id).toBeTruthy();
    });

    it('should use cookie mode when requested', async () => {
      const { email, otpCode } = await setupOtpTest();

      const response = await request(app)
        .post('/auth/verify-otp')
        .set('X-Auth-Method', 'cookie')
        .send({ email, code: otpCode })
        .expect(200);

      expectSuccessResponse(response);
      expect(response.body.data.tokens).toBeUndefined(); // Tokens not in response body

      // Check cookies are set
      const cookies = response.get('Set-Cookie');
      expect(cookies).toBeDefined();
      const cookieStrings = cookies!.join('; ');
      expect(cookieStrings).toContain('accessToken=');
      expect(cookieStrings).toContain('refreshToken=');
    });

    it('should fail with invalid OTP code', async () => {
      const { email } = await setupOtpTest();

      const response = await request(app)
        .post('/auth/verify-otp')
        .send({ email, code: '000000' })
        .expect(400);

      expectErrorResponse(response, 'OTP_INVALID');
    });

    it('should fail with non-existent email', async () => {
      const response = await request(app)
        .post('/auth/verify-otp')
        .send({ email: 'nonexistent@example.com', code: '123456' })
        .expect(400);

      expectErrorResponse(response, 'OTP_NOT_FOUND');
    });

    it('should fail with invalid code format', async () => {
      const { email } = await setupOtpTest();

      const response = await request(app)
        .post('/auth/verify-otp')
        .send({ email, code: '12345' }) // Too short
        .expect(400);

      expectErrorResponse(response, 'VALIDATION_ERROR');
    });

    it('should fail after max attempts exceeded', async () => {
      const { email } = await setupOtpTest();

      // Make multiple failed attempts
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/auth/verify-otp')
          .send({ email, code: '000000' })
          .expect(400);
      }

      // Next attempt should fail with max attempts exceeded
      const response = await request(app)
        .post('/auth/verify-otp')
        .send({ email, code: '000000' })
        .expect(400);

      expectErrorResponse(response, 'OTP_MAX_ATTEMPTS_EXCEEDED');
    });
  });

  describe('POST /auth/refresh', () => {
    const setupAuthenticatedUser = async () => {
      const { email, otpCode } = await setupOtpTest();

      const authResponse = await request(app)
        .post('/auth/verify-otp')
        .send({ email, code: otpCode })
        .expect(200);

      return authResponse.body.data.tokens;
    };

    const setupOtpTest = async (email = 'test@example.com') => {
      await request(app)
        .post('/auth/request-otp')
        .send({ email })
        .expect(200);

      const sentEmails = MockAdapter.getSentEmails();
      const otpCode = extractOtpFromEmail(sentEmails[sentEmails.length - 1].html);

      return { email, otpCode };
    };

    it('should successfully refresh tokens with valid refresh token', async () => {
      const tokens = await setupAuthenticatedUser();

      const response = await request(app)
        .post('/auth/refresh')
        .send({ refreshToken: tokens.refreshToken })
        .expect(200);

      expectSuccessResponse(response);
      expect(response.body.message).toBe('Tokens refreshed successfully');
      expectValidTokens(response.body.data.tokens);

      // New tokens should be different
      expect(response.body.data.tokens.accessToken).not.toBe(tokens.accessToken);
      expect(response.body.data.tokens.refreshToken).not.toBe(tokens.refreshToken);
    });

    it('should fail with invalid refresh token', async () => {
      const response = await request(app)
        .post('/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);

      expectErrorResponse(response, 'TOKEN_INVALID');
    });

    it('should fail with missing refresh token', async () => {
      const response = await request(app)
        .post('/auth/refresh')
        .send({})
        .expect(401);

      expect(response.body.error.code).toBe('TOKEN_REQUIRED');
    });

    it('should revoke old refresh token after successful refresh', async () => {
      const tokens = await setupAuthenticatedUser();

      // Refresh tokens
      await request(app)
        .post('/auth/refresh')
        .send({ refreshToken: tokens.refreshToken })
        .expect(200);

      // Old refresh token should not work anymore
      const response = await request(app)
        .post('/auth/refresh')
        .send({ refreshToken: tokens.refreshToken })
        .expect(401);

      expectErrorResponse(response, 'TOKEN_INVALID');
    });
  });

  describe('POST /auth/logout', () => {
    const setupAuthenticatedUser = async () => {
      const { email, otpCode } = await setupOtpTest();

      const authResponse = await request(app)
        .post('/auth/verify-otp')
        .send({ email, code: otpCode })
        .expect(200);

      return authResponse.body.data.tokens;
    };

    const setupOtpTest = async (email = 'test@example.com') => {
      await request(app)
        .post('/auth/request-otp')
        .send({ email })
        .expect(200);

      const sentEmails = MockAdapter.getSentEmails();
      const otpCode = extractOtpFromEmail(sentEmails[sentEmails.length - 1].html);

      return { email, otpCode };
    };

    it('should successfully logout with refresh token', async () => {
      const tokens = await setupAuthenticatedUser();

      const response = await request(app)
        .post('/auth/logout')
        .send({ refreshToken: tokens.refreshToken })
        .expect(200);

      expectSuccessResponse(response);
      expect(response.body.message).toBe('Logged out successfully');

      // Refresh token should be revoked
      await request(app)
        .post('/auth/refresh')
        .send({ refreshToken: tokens.refreshToken })
        .expect(401);
    });

    it('should handle logout without refresh token', async () => {
      const response = await request(app)
        .post('/auth/logout')
        .send({})
        .expect(200);

      expectSuccessResponse(response);
    });
  });

  describe('GET /auth/me', () => {
    const setupAuthenticatedUser = async () => {
      const { email, otpCode } = await setupOtpTest();

      const authResponse = await request(app)
        .post('/auth/verify-otp')
        .send({ email, code: otpCode })
        .expect(200);

      return {
        tokens: authResponse.body.data.tokens,
        user: authResponse.body.data.user,
      };
    };

    const setupOtpTest = async (email = 'test@example.com') => {
      await request(app)
        .post('/auth/request-otp')
        .send({ email })
        .expect(200);

      const sentEmails = MockAdapter.getSentEmails();
      const otpCode = extractOtpFromEmail(sentEmails[sentEmails.length - 1].html);

      return { email, otpCode };
    };

    it('should return user profile with valid access token', async () => {
      const { tokens, user } = await setupAuthenticatedUser();

      const response = await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer ${tokens.accessToken}`)
        .expect(200);

      expectSuccessResponse(response);
      expect(response.body.data.user).toEqual(user);
    });

    it('should fail without access token', async () => {
      const response = await request(app)
        .get('/auth/me')
        .expect(401);

      expectErrorResponse(response, 'UNAUTHORIZED');
    });

    it('should fail with invalid access token', async () => {
      const response = await request(app)
        .get('/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expectErrorResponse(response, 'TOKEN_INVALID');
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce global rate limiting', async () => {
      const requests = [];

      // Make many requests quickly to trigger rate limiting
      for (let i = 0; i < 150; i++) {
        requests.push(
          request(app)
            .get('/health')
            .expect((res) => {
              // Accept both 200 (success) and 429 (rate limited)
              if (res.status !== 200 && res.status !== 429) {
                throw new Error(`Unexpected status: ${res.status}`);
              }
            })
        );
      }

      const responses = await Promise.all(requests);
      const rateLimitedCount = responses.filter(res => res.status === 429).length;

      expect(rateLimitedCount).toBeGreaterThan(0);
    }, 15000);
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent endpoints', async () => {
      const response = await request(app)
        .get('/non-existent-endpoint')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('ENDPOINT_NOT_FOUND');
    });

    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/auth/request-otp')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expectSuccessResponse(response);
      expect(response.body.data.status).toBe('healthy');
      expect(response.body.data.timestamp).toBeTruthy();
      expect(response.body.data.environment).toBe('test');
    });
  });
});