import { v4 as uuidv4 } from 'uuid';
import { OtpRecord } from '../../types/auth';
import { OtpRepository } from '../otp.repository';

export class MemoryOtpRepository implements OtpRepository {
  private otps: Map<string, OtpRecord> = new Map();

  async create(otpData: {
    email: string;
    codeHash: string;
    expiresAt: Date;
  }): Promise<OtpRecord> {
    const otp: OtpRecord = {
      id: uuidv4(),
      email: otpData.email,
      codeHash: otpData.codeHash,
      expiresAt: otpData.expiresAt,
      attempts: 0,
      isUsed: false,
      createdAt: new Date(),
    };

    this.otps.set(otp.id, otp);
    return otp;
  }

  async findByEmail(email: string): Promise<OtpRecord | null> {
    for (const otp of this.otps.values()) {
      if (otp.email === email && !otp.isUsed) {
        return otp;
      }
    }
    return null;
  }

  async incrementAttempts(id: string): Promise<void> {
    const otp = this.otps.get(id);
    if (otp) {
      otp.attempts += 1;
    }
  }

  async markAsUsed(id: string): Promise<void> {
    const otp = this.otps.get(id);
    if (otp) {
      otp.isUsed = true;
    }
  }

  async delete(id: string): Promise<void> {
    this.otps.delete(id);
  }

  async deleteExpired(): Promise<number> {
    const now = new Date();
    let deletedCount = 0;

    for (const [id, otp] of this.otps.entries()) {
      if (otp.expiresAt < now) {
        this.otps.delete(id);
        deletedCount++;
      }
    }

    return deletedCount;
  }

  async deleteByEmail(email: string): Promise<void> {
    for (const [id, otp] of this.otps.entries()) {
      if (otp.email === email) {
        this.otps.delete(id);
      }
    }
  }

  // Utility methods for testing
  clear(): void {
    this.otps.clear();
  }

  getAllOtps(): OtpRecord[] {
    return Array.from(this.otps.values());
  }
}