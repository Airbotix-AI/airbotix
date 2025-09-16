import { RateLimitRepository } from '../repositories/rate-limit.repository';
import { AppError, ErrorCode } from '../types/errors';
import { config } from '../config/env';
import { logger } from '../utils/logger';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: Date;
  retryAfter?: number;
}

export class RateLimitService {
  constructor(private rateLimitRepository: RateLimitRepository) {}

  async checkRateLimit(
    key: string,
    maxRequests: number = config.rateLimit.maxRequests,
    windowMs: number = config.rateLimit.windowMs
  ): Promise<RateLimitResult> {
    await this.cleanupExpiredRecords();

    const now = new Date();
    let record = await this.rateLimitRepository.findByKey(key);

    if (!record) {
      // Create new rate limit record
      record = await this.rateLimitRepository.create({
        key,
        count: 1,
        resetTime: new Date(now.getTime() + windowMs),
      });

      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime: record.resetTime,
      };
    }

    // Check if the window has expired
    if (record.resetTime <= now) {
      // Reset the counter
      await this.rateLimitRepository.delete(key);
      record = await this.rateLimitRepository.create({
        key,
        count: 1,
        resetTime: new Date(now.getTime() + windowMs),
      });

      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime: record.resetTime,
      };
    }

    // Check if rate limit is exceeded
    if (record.count >= maxRequests) {
      const retryAfter = Math.ceil((record.resetTime.getTime() - now.getTime()) / 1000);

      logger.warn('Rate limit exceeded', {
        key: this.maskKey(key),
        count: record.count,
        maxRequests,
        retryAfter,
      });

      return {
        allowed: false,
        remaining: 0,
        resetTime: record.resetTime,
        retryAfter,
      };
    }

    // Increment counter
    record = await this.rateLimitRepository.increment(key);

    return {
      allowed: true,
      remaining: Math.max(0, maxRequests - record.count),
      resetTime: record.resetTime,
    };
  }

  async enforceRateLimit(
    key: string,
    maxRequests?: number,
    windowMs?: number
  ): Promise<RateLimitResult> {
    const result = await this.checkRateLimit(key, maxRequests, windowMs);

    if (!result.allowed) {
      throw AppError.tooManyRequests(
        ErrorCode.RATE_LIMIT_EXCEEDED,
        'Too many requests',
        {
          retryAfter: result.retryAfter,
          resetTime: result.resetTime,
        }
      );
    }

    return result;
  }

  async checkOtpCooldown(email: string): Promise<void> {
    const cooldownKey = `otp_cooldown:${email}`;
    const cooldownWindowMs = config.otp.resendCooldownSeconds * 1000;

    const record = await this.rateLimitRepository.findByKey(cooldownKey);

    if (record && record.resetTime > new Date()) {
      const remainingSeconds = Math.ceil(
        (record.resetTime.getTime() - Date.now()) / 1000
      );

      throw AppError.tooManyRequests(
        ErrorCode.OTP_COOLDOWN_ACTIVE,
        `Please wait ${remainingSeconds} seconds before requesting another OTP`,
        {
          retryAfter: remainingSeconds,
          resetTime: record.resetTime,
        }
      );
    }

    // Set cooldown
    if (record) {
      await this.rateLimitRepository.delete(cooldownKey);
    }

    await this.rateLimitRepository.create({
      key: cooldownKey,
      count: 1,
      resetTime: new Date(Date.now() + cooldownWindowMs),
    });
  }

  async resetRateLimit(key: string): Promise<void> {
    await this.rateLimitRepository.delete(key);
    logger.info('Rate limit reset', { key: this.maskKey(key) });
  }

  async cleanupExpiredRecords(): Promise<void> {
    try {
      const deletedCount = await this.rateLimitRepository.deleteExpired();
      if (deletedCount > 0) {
        logger.debug('Expired rate limit records cleaned up', { count: deletedCount });
      }
    } catch (error) {
      logger.error('Failed to cleanup expired rate limit records', { error });
    }
  }

  private maskKey(key: string): string {
    if (key.includes(':')) {
      const [prefix, value] = key.split(':', 2);
      return `${prefix}:${this.maskValue(value)}`;
    }
    return this.maskValue(key);
  }

  private maskValue(value: string): string {
    if (value.length <= 4) return value;
    return `${value.substring(0, 2)}***${value.substring(value.length - 2)}`;
  }
}