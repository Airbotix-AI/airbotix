import { OtpService } from '../../src/services/otp.service';
import { MemoryOtpRepository } from '../../src/repositories/memory/memory-otp.repository';
import { ErrorCode } from '../../src/types/errors';
import { config } from '../../src/config/env';

describe('OtpService', () => {
  let otpService: OtpService;
  let otpRepository: MemoryOtpRepository;

  beforeEach(() => {
    otpRepository = new MemoryOtpRepository();
    otpService = new OtpService(otpRepository);
  });

  afterEach(() => {
    otpRepository.clear();
  });

  describe('generateOtp', () => {
    it('should generate a valid OTP code', async () => {
      const email = 'test@example.com';
      const code = await otpService.generateOtp(email);

      expect(code).toHaveLength(config.otp.length);
      expect(code).toMatch(/^\d+$/);
    });

    it('should store OTP record in repository', async () => {
      const email = 'test@example.com';
      await otpService.generateOtp(email);

      const otpRecord = await otpRepository.findByEmail(email);
      expect(otpRecord).toBeTruthy();
      expect(otpRecord!.email).toBe(email);
      expect(otpRecord!.attempts).toBe(0);
      expect(otpRecord!.isUsed).toBe(false);
    });

    it('should delete existing OTP when generating new one', async () => {
      const email = 'test@example.com';

      // Generate first OTP
      await otpService.generateOtp(email);
      const allOtps1 = otpRepository.getAllOtps();
      expect(allOtps1).toHaveLength(1);

      // Generate second OTP
      await otpService.generateOtp(email);
      const allOtps2 = otpRepository.getAllOtps();
      expect(allOtps2).toHaveLength(1); // Should still be 1, old one deleted
    });
  });

  describe('verifyOtp', () => {
    it('should successfully verify valid OTP', async () => {
      const email = 'test@example.com';
      const code = await otpService.generateOtp(email);

      await expect(otpService.verifyOtp(email, code)).resolves.not.toThrow();
    });

    it('should throw error for non-existent OTP', async () => {
      const email = 'test@example.com';

      await expect(otpService.verifyOtp(email, '123456'))
        .rejects
        .toThrow(ErrorCode.OTP_NOT_FOUND);
    });

    it('should throw error for expired OTP', async () => {
      const email = 'test@example.com';
      const code = await otpService.generateOtp(email);

      // Manually set OTP as expired
      const otpRecord = await otpRepository.findByEmail(email);
      if (otpRecord) {
        otpRecord.expiresAt = new Date(Date.now() - 1000); // 1 second ago
      }

      await expect(otpService.verifyOtp(email, code))
        .rejects
        .toThrow(ErrorCode.OTP_EXPIRED);
    });

    it('should throw error for already used OTP', async () => {
      const email = 'test@example.com';
      const code = await otpService.generateOtp(email);

      // Use the OTP
      await otpService.verifyOtp(email, code);

      // Try to use it again
      await expect(otpService.verifyOtp(email, code))
        .rejects
        .toThrow(ErrorCode.OTP_INVALID);
    });

    it('should increment attempts on invalid code', async () => {
      const email = 'test@example.com';
      await otpService.generateOtp(email);

      try {
        await otpService.verifyOtp(email, '000000'); // Wrong code
      } catch (error) {
        // Expected to fail
      }

      const otpRecord = await otpRepository.findByEmail(email);
      expect(otpRecord!.attempts).toBe(1);
    });

    it('should throw error after max attempts exceeded', async () => {
      const email = 'test@example.com';
      await otpService.generateOtp(email);

      // Exceed max attempts
      for (let i = 0; i < config.otp.maxVerifyAttempts; i++) {
        try {
          await otpService.verifyOtp(email, '000000'); // Wrong code
        } catch (error) {
          // Expected to fail
        }
      }

      // Next attempt should throw max attempts exceeded
      await expect(otpService.verifyOtp(email, '000000'))
        .rejects
        .toThrow(ErrorCode.OTP_MAX_ATTEMPTS_EXCEEDED);
    });

    it('should mark OTP as used after successful verification', async () => {
      const email = 'test@example.com';
      const code = await otpService.generateOtp(email);

      await otpService.verifyOtp(email, code);

      const otpRecord = await otpRepository.findByEmail(email);
      expect(otpRecord!.isUsed).toBe(true);
    });
  });

  describe('cleanupExpiredOtps', () => {
    it('should remove expired OTPs', async () => {
      const email = 'test@example.com';
      await otpService.generateOtp(email);

      // Manually expire the OTP
      const otpRecord = await otpRepository.findByEmail(email);
      if (otpRecord) {
        otpRecord.expiresAt = new Date(Date.now() - 1000);
      }

      await otpService.cleanupExpiredOtps();

      const allOtps = otpRepository.getAllOtps();
      expect(allOtps).toHaveLength(0);
    });

    it('should keep valid OTPs during cleanup', async () => {
      const email = 'test@example.com';
      await otpService.generateOtp(email);

      await otpService.cleanupExpiredOtps();

      const allOtps = otpRepository.getAllOtps();
      expect(allOtps).toHaveLength(1);
    });
  });
});