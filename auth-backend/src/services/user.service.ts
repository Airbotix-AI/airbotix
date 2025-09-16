import { UserRepository } from '../repositories/user.repository';
import { User } from '../types/auth';
import { AppError, ErrorCode } from '../types/errors';
import { logger } from '../utils/logger';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async findByIdOrThrow(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw AppError.notFound(ErrorCode.USER_NOT_FOUND, 'User not found');
    }
    return user;
  }

  async createOrGetUser(email: string): Promise<User> {
    let user = await this.userRepository.findByEmail(email);

    if (!user) {
      user = await this.userRepository.create({ email });
      logger.info('New user created', {
        userId: user.id,
        email: this.maskEmail(email),
      });
    }

    return user;
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.userRepository.updateLastLogin(userId);
    logger.debug('User last login updated', { userId });
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw AppError.notFound(ErrorCode.USER_NOT_FOUND, 'User not found');
    }

    await this.userRepository.delete(id);
    logger.info('User deleted', {
      userId: id,
      email: this.maskEmail(user.email),
    });
  }

  private maskEmail(email: string): string {
    const [local, domain] = email.split('@');
    if (local.length <= 2) return email;
    return `${local.substring(0, 2)}***@${domain}`;
  }
}