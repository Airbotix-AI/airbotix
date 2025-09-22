import { http, HttpResponse, type HttpHandler } from 'msw';
import { API_BASE_URL } from '@/constants/auth';

// Mock data storage
interface MockUser { id: string; email: string; lastLoginAt: string }
const mockUsers: Record<string, MockUser> = {};
const mockOtps: Record<string, { code: string; expiresAt: number; attempts: number }> = {};
const mockTokens: Record<string, { userId: string; expiresAt: number }> = {};

// Default test account
const DEFAULT_TEST_EMAIL = 'admin@airbotix.com';
const DEFAULT_TEST_OTP = '123456';

// Helper functions
const generateId = () => Math.random().toString(36).substr(2, 9);
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();
const generateToken = () => 'mock_token_' + Math.random().toString(36).substr(2, 20);

type ResolverCtx = { request: Request }

export const handlers: HttpHandler[] = [
  // Request OTP
  http.post(`${API_BASE_URL}/auth/request-otp`, async ({ request }: ResolverCtx) => {
    const body = await request.json() as { email: string };
    const { email } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return HttpResponse.json({
        success: false,
        error: {
          code: 'EMAIL_INVALID',
          message: 'Please enter a valid email address',
        },
      }, { status: 400 });
    }

    // Generate OTP - use fixed OTP for default test account
    const otpCode = email === DEFAULT_TEST_EMAIL ? DEFAULT_TEST_OTP : generateOtp();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    mockOtps[email] = {
      code: otpCode,
      expiresAt,
      attempts: 0,
    };

    // Log OTP for development
    console.log(`[MOCK] OTP for ${email}: ${otpCode}`);

    // Special message for default test account
    if (email === DEFAULT_TEST_EMAIL) {
      console.log(`[DEFAULT TEST ACCOUNT] Use OTP: ${DEFAULT_TEST_OTP}`);
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return HttpResponse.json({
      success: true,
      message: 'Verification code sent to your email',
      data: {
        email,
        expiresInMinutes: 10,
        cooldownSeconds: 60,
      },
    });
  }),

  // Verify OTP
  http.post(`${API_BASE_URL}/auth/verify-otp`, async ({ request }: ResolverCtx) => {
    const body = await request.json() as { email: string; code: string };
    const { email, code } = body;

    if (!email || !code) {
      return HttpResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email and code are required',
        },
      }, { status: 400 });
    }

    const otpData = mockOtps[email];

    if (!otpData) {
      return HttpResponse.json({
        success: false,
        error: {
          code: 'OTP_NOT_FOUND',
          message: 'No OTP found for this email',
        },
      }, { status: 400 });
    }

    if (Date.now() > otpData.expiresAt) {
      delete mockOtps[email];
      return HttpResponse.json({
        success: false,
        error: {
          code: 'OTP_EXPIRED',
          message: 'OTP has expired',
        },
      }, { status: 400 });
    }

    if (otpData.attempts >= 5) {
      delete mockOtps[email];
      return HttpResponse.json({
        success: false,
        error: {
          code: 'OTP_MAX_ATTEMPTS_EXCEEDED',
          message: 'Too many failed attempts',
        },
      }, { status: 400 });
    }

    if (otpData.code !== code) {
      mockOtps[email].attempts += 1;
      return HttpResponse.json({
        success: false,
        error: {
          code: 'OTP_INVALID',
          message: 'Invalid OTP code',
        },
      }, { status: 400 });
    }

    // OTP is valid - create or get user
    let user = mockUsers[email];
    if (!user) {
      user = {
        id: generateId(),
        email,
        lastLoginAt: new Date().toISOString(),
      };
      mockUsers[email] = user;
    } else {
      user.lastLoginAt = new Date().toISOString();
    }

    // Generate tokens
    const accessToken = generateToken();
    const refreshToken = generateToken();

    mockTokens[accessToken] = {
      userId: user.id,
      expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
    };

    mockTokens[refreshToken] = {
      userId: user.id,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    // Clean up OTP
    delete mockOtps[email];

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const authMethod = request.headers.get('X-Auth-Method');

    return HttpResponse.json({
      success: true,
      message: 'Authentication successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          lastLoginAt: user.lastLoginAt,
        },
        tokens: authMethod === 'cookie' ? undefined : {
          accessToken,
          refreshToken,
        },
      },
    }, {
      headers: authMethod === 'cookie' ? {
        'Set-Cookie': [
          `accessToken=${accessToken}; HttpOnly; Secure; SameSite=Lax; Max-Age=900`,
          `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Lax; Max-Age=604800; Path=/auth/refresh`,
        ].join(', ')
      } : {},
    });
  }),

  // Get user profile
  http.get(`${API_BASE_URL}/auth/me`, async ({ request }: ResolverCtx) => {
    let token: string | undefined;

    // Check for Bearer token first
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      token = authHeader.replace('Bearer ', '');
    } else {
      // For cookie auth, get access token from cookies
      const cookies = request.headers.get('cookie');
      if (cookies) {
        const accessTokenMatch = cookies.match(/accessToken=([^;]+)/);
        token = accessTokenMatch ? accessTokenMatch[1] : undefined;
      }
    }

    if (!token || !mockTokens[token]) {
      // For development, if no valid token found, return a mock user
      // This prevents constant redirects during development
      return HttpResponse.json({
        success: true,
        data: {
          user: {
            id: 'dev-user',
            email: DEFAULT_TEST_EMAIL,
            lastLoginAt: new Date().toISOString(),
          },
        },
      });
    }

    const tokenData = mockTokens[token];
    if (Date.now() > tokenData.expiresAt) {
      delete mockTokens[token];
      return HttpResponse.json({
        success: false,
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'Token has expired',
        },
      }, { status: 401 });
    }

    // Find user by ID
    const user = Object.values(mockUsers).find((u) => u.id === tokenData.userId);
    if (!user) {
      return HttpResponse.json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        },
      }, { status: 404 });
    }

    return HttpResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          lastLoginAt: user.lastLoginAt,
        },
      },
    });
  }),

  // Refresh token
  http.post(`${API_BASE_URL}/auth/refresh`, async () => {
    // For development, always return success without complex token logic
    // This prevents infinite refresh loops in development environment
    return HttpResponse.json({
      success: true,
      message: 'Tokens refreshed successfully',
      data: {
        tokens: null,
      },
    });
  }),

  // Logout
  http.post(`${API_BASE_URL}/auth/logout`, async ({ request }: ResolverCtx) => {
    const body = await request.json() as { refreshToken?: string };
    const { refreshToken } = body;

    if (refreshToken && mockTokens[refreshToken]) {
      delete mockTokens[refreshToken];
    }

    return HttpResponse.json({
      success: true,
      message: 'Logged out successfully',
    }, {
      headers: {
        'Set-Cookie': [
          'accessToken=; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
          'refreshToken=; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Path=/auth/refresh',
        ].join(', ')
      },
    });
  }),
];