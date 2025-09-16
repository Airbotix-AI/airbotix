import { OtpRepository } from '../repositories/otp.repository';
import { CryptoUtil } from '../utils/crypto.util';
import { AppError, ErrorCode } from '../types/errors';
import { config } from '../config/env';
import { logger } from '../utils/logger';

export class OtpService {
  constructor(private otpRepository: OtpRepository) {}

  async generateOtp(email: string): Promise<string> {
    // Delete any existing OTP for this email
    await this.otpRepository.deleteByEmail(email);

    // Generate new OTP code
    const code = CryptoUtil.generateOtpCode(config.otp.length);
    const codeHash = await CryptoUtil.hashOtpCode(code);

    const expiresAt = new Date(
      Date.now() + config.otp.ttlMinutes * 60 * 1000
    );

    await this.otpRepository.create({
      email,
      codeHash,
      expiresAt,
    });

    logger.info('OTP generated', {
      email: this.maskEmail(email),
      expiresAt,
    });

    return code;
  }

  async verifyOtp(email: string, code: string): Promise<void> {
    const otpRecord = await this.otpRepository.findByEmail(email);

    if (!otpRecord) {
      logger.warn('OTP verification failed - not found', {
        email: this.maskEmail(email),
      });
      throw AppError.badRequest(
        ErrorCode.OTP_NOT_FOUND,
        'No OTP found for this email'
      );
    }

    // Check if OTP is expired
    if (otpRecord.expiresAt < new Date()) {
      await this.otpRepository.delete(otpRecord.id);
      logger.warn('OTP verification failed - expired', {
        email: this.maskEmail(email),
        expiresAt: otpRecord.expiresAt,
      });
      throw AppError.badRequest(
        ErrorCode.OTP_EXPIRED,
        'OTP has expired'
      );
    }

    // Check if OTP is already used
    if (otpRecord.isUsed) {
      logger.warn('OTP verification failed - already used', {
        email: this.maskEmail(email),
      });
      throw AppError.badRequest(
        ErrorCode.OTP_INVALID,
        'OTP has already been used'
      );
    }

    // Check max attempts
    if (otpRecord.attempts >= config.otp.maxVerifyAttempts) {
      await this.otpRepository.delete(otpRecord.id);
      logger.warn('OTP verification failed - max attempts exceeded', {
        email: this.maskEmail(email),
        attempts: otpRecord.attempts,
      });
      throw AppError.badRequest(
        ErrorCode.OTP_MAX_ATTEMPTS_EXCEEDED,
        'Too many verification attempts'
      );
    }

    // Verify the code
    const isValid = await CryptoUtil.compareOtpCode(code, otpRecord.codeHash);

    if (!isValid) {
      await this.otpRepository.incrementAttempts(otpRecord.id);
      logger.warn('OTP verification failed - invalid code', {
        email: this.maskEmail(email),
        attempts: otpRecord.attempts + 1,
      });
      throw AppError.badRequest(
        ErrorCode.OTP_INVALID,
        'Invalid OTP code'
      );
    }

    // Mark as used and clean up
    await this.otpRepository.markAsUsed(otpRecord.id);

    logger.info('OTP verified successfully', {
      email: this.maskEmail(email),
    });
  }

  async cleanupExpiredOtps(): Promise<void> {
    try {
      const deletedCount = await this.otpRepository.deleteExpired();
      if (deletedCount > 0) {
        logger.info('Expired OTPs cleaned up', { count: deletedCount });
      }
    } catch (error) {
      logger.error('Failed to cleanup expired OTPs', { error });
    }
  }

  private maskEmail(email: string): string {
    const [local, domain] = email.split('@');
    if (local.length <= 2) return email;
    return `${local.substring(0, 2)}***@${domain}`;
  }
}