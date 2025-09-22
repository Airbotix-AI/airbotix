import { MockEmailRecord } from '../../src/adapters/mock.adapter';
import { ServiceContainer } from '../../src/services/container';
export declare const extractOtpFromEmail: (emailHtml: string) => string;
export declare const waitFor: (ms: number) => Promise<void>;
export declare const getLastEmailForAddress: (email: string) => MockEmailRecord | undefined;
export declare const createTestContainer: () => ServiceContainer;
export declare const cleanupTestContainer: (container: ServiceContainer) => void;
export declare const createTestUser: () => {
    email: string;
};
export declare const createTestOtpRequest: () => {
    email: string;
};
export declare const createTestOtpVerification: (code: string) => {
    email: string;
    code: string;
};
export declare const TEST_IPS: {
    VALID: string;
    BLOCKED: string;
    LOCALHOST: string;
};
export declare const expectSuccessResponse: (response: any) => void;
export declare const expectErrorResponse: (response: any, expectedCode: string) => void;
export declare const expectValidTokens: (tokens: any) => void;
//# sourceMappingURL=test-utils.d.ts.map