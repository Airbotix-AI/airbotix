"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expectValidTokens = exports.expectErrorResponse = exports.expectSuccessResponse = exports.TEST_IPS = exports.createTestOtpVerification = exports.createTestOtpRequest = exports.createTestUser = exports.cleanupTestContainer = exports.createTestContainer = exports.getLastEmailForAddress = exports.waitFor = exports.extractOtpFromEmail = void 0;
const mock_adapter_1 = require("../../src/adapters/mock.adapter");
const container_1 = require("../../src/services/container");
const extractOtpFromEmail = (emailHtml) => {
    const otpMatch = emailHtml.match(/class="code">(\d{6})</);
    if (!otpMatch) {
        throw new Error('Could not extract OTP from email HTML');
    }
    return otpMatch[1];
};
exports.extractOtpFromEmail = extractOtpFromEmail;
const waitFor = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
exports.waitFor = waitFor;
const getLastEmailForAddress = (email) => {
    const emails = mock_adapter_1.MockAdapter.getEmailsFor(email);
    return emails[emails.length - 1];
};
exports.getLastEmailForAddress = getLastEmailForAddress;
const createTestContainer = () => {
    return new container_1.ServiceContainer();
};
exports.createTestContainer = createTestContainer;
const cleanupTestContainer = (container) => {
    container.cleanup();
    mock_adapter_1.MockAdapter.clear();
};
exports.cleanupTestContainer = cleanupTestContainer;
// Test data factories
const createTestUser = () => ({
    email: 'test@example.com',
});
exports.createTestUser = createTestUser;
const createTestOtpRequest = () => ({
    email: 'test@example.com',
});
exports.createTestOtpRequest = createTestOtpRequest;
const createTestOtpVerification = (code) => ({
    email: 'test@example.com',
    code,
});
exports.createTestOtpVerification = createTestOtpVerification;
// Mock IP addresses for testing
exports.TEST_IPS = {
    VALID: '192.168.1.1',
    BLOCKED: '10.0.0.1',
    LOCALHOST: '127.0.0.1',
};
// Common test assertions
const expectSuccessResponse = (response) => {
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('data');
};
exports.expectSuccessResponse = expectSuccessResponse;
const expectErrorResponse = (response, expectedCode) => {
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toHaveProperty('code', expectedCode);
};
exports.expectErrorResponse = expectErrorResponse;
const expectValidTokens = (tokens) => {
    expect(tokens).toHaveProperty('accessToken');
    expect(tokens).toHaveProperty('refreshToken');
    expect(typeof tokens.accessToken).toBe('string');
    expect(typeof tokens.refreshToken).toBe('string');
    expect(tokens.accessToken).toMatch(/^eyJ/); // JWT starts with eyJ
    expect(tokens.refreshToken).toMatch(/^eyJ/);
};
exports.expectValidTokens = expectValidTokens;
//# sourceMappingURL=test-utils.js.map