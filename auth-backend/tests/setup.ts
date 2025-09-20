// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-purposes-only';
process.env.EMAIL_PROVIDER = 'mock';
process.env.APP_BASE_URL = 'http://localhost:3000';
process.env.EMAIL_FROM = 'test@example.com';

// Increase test timeout for async operations
jest.setTimeout(10000);

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};