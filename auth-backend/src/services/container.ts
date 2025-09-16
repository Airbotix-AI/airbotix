// Dependency injection container
import { UserService } from './user.service';
import { OtpService } from './otp.service';
import { AuthService } from './auth.service';
import { RateLimitService } from './rate-limit.service';

// Repository implementations
import { MemoryUserRepository } from '../repositories/memory/memory-user.repository';
import { MemoryOtpRepository } from '../repositories/memory/memory-otp.repository';
import { MemoryRefreshTokenRepository } from '../repositories/memory/memory-refresh-token.repository';
import { MemoryRateLimitRepository } from '../repositories/memory/memory-rate-limit.repository';

// Controllers
import { AuthController } from '../controllers/auth.controller';

export class ServiceContainer {
  // Repositories
  private userRepository = new MemoryUserRepository();
  private otpRepository = new MemoryOtpRepository();
  private refreshTokenRepository = new MemoryRefreshTokenRepository();
  private rateLimitRepository = new MemoryRateLimitRepository();

  // Services
  private userService = new UserService(this.userRepository);
  private otpService = new OtpService(this.otpRepository);
  private rateLimitService = new RateLimitService(this.rateLimitRepository);
  private authService = new AuthService(
    this.userService,
    this.otpService,
    this.rateLimitService,
    this.refreshTokenRepository
  );

  // Controllers
  private authController = new AuthController(this.authService);

  // Getters
  getUserService(): UserService {
    return this.userService;
  }

  getOtpService(): OtpService {
    return this.otpService;
  }

  getAuthService(): AuthService {
    return this.authService;
  }

  getRateLimitService(): RateLimitService {
    return this.rateLimitService;
  }

  getAuthController(): AuthController {
    return this.authController;
  }

  // Cleanup method for testing
  cleanup(): void {
    this.userRepository.clear();
    this.otpRepository.clear();
    this.refreshTokenRepository.clear();
    this.rateLimitRepository.clear();
  }

  // Background cleanup tasks
  async runCleanupTasks(): Promise<void> {
    await this.otpService.cleanupExpiredOtps();
    await this.rateLimitService.cleanupExpiredRecords();
    const deletedTokens = await this.refreshTokenRepository.deleteExpired();

    if (deletedTokens > 0) {
      console.log(`Cleaned up ${deletedTokens} expired refresh tokens`);
    }
  }
}

// Singleton instance
export const container = new ServiceContainer();