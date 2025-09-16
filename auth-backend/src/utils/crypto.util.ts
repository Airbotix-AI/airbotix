import bcrypt from 'bcrypt';
import crypto from 'crypto';

export class CryptoUtil {
  private static readonly SALT_ROUNDS = 12;

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static generateOtpCode(length: number): string {
    const digits = '0123456789';
    let code = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, digits.length);
      code += digits[randomIndex];
    }

    return code;
  }

  static async hashOtpCode(code: string): Promise<string> {
    return this.hashPassword(code);
  }

  static async compareOtpCode(code: string, hash: string): Promise<boolean> {
    return this.comparePassword(code, hash);
  }

  static generateSecureToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  static generateUuid(): string {
    return crypto.randomUUID();
  }
}