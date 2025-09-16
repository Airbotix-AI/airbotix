import { MockAdapter, MockEmailRecord } from '../../src/adapters/mock.adapter';
import { ServiceContainer } from '../../src/services/container';

export const extractOtpFromEmail = (emailHtml: string): string => {
  const otpMatch = emailHtml.match(/class="code">(\d{6})</);
  if (!otpMatch) {
    throw new Error('Could not extract OTP from email HTML');
  }
  return otpMatch[1];
};

export const waitFor = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const getLastEmailForAddress = (email: string): MockEmailRecord | undefined => {
  const emails = MockAdapter.getEmailsFor(email);
  return emails[emails.length - 1];
};

export const createTestContainer = (): ServiceContainer => {
  return new ServiceContainer();
};

export const cleanupTestContainer = (container: ServiceContainer): void => {
  container.cleanup();
  MockAdapter.clear();
};

// Test data factories
export const createTestUser = () => ({
  email: 'test@example.com',
});

export const createTestOtpRequest = () => ({
  email: 'test@example.com',
});

export const createTestOtpVerification = (code: string) => ({
  email: 'test@example.com',
  code,
});

// Mock IP addresses for testing
export const TEST_IPS = {
  VALID: '192.168.1.1',
  BLOCKED: '10.0.0.1',
  LOCALHOST: '127.0.0.1',
};

// Common test assertions
export const expectSuccessResponse = (response: any) => {
  expect(response.body).toHaveProperty('success', true);
  expect(response.body).toHaveProperty('data');
};

export const expectErrorResponse = (response: any, expectedCode: string) => {
  expect(response.body).toHaveProperty('success', false);
  expect(response.body).toHaveProperty('error');
  expect(response.body.error).toHaveProperty('code', expectedCode);
};

export const expectValidTokens = (tokens: any) => {
  expect(tokens).toHaveProperty('accessToken');
  expect(tokens).toHaveProperty('refreshToken');
  expect(typeof tokens.accessToken).toBe('string');
  expect(typeof tokens.refreshToken).toBe('string');
  expect(tokens.accessToken).toMatch(/^eyJ/); // JWT starts with eyJ
  expect(tokens.refreshToken).toMatch(/^eyJ/);
};