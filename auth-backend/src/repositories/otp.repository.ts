import { OtpRecord } from '../types/auth';

export interface OtpRepository {
  create(otpData: {
    email: string;
    codeHash: string;
    expiresAt: Date;
  }): Promise<OtpRecord>;

  findByEmail(email: string): Promise<OtpRecord | null>;

  incrementAttempts(id: string): Promise<void>;

  markAsUsed(id: string): Promise<void>;

  delete(id: string): Promise<void>;

  deleteExpired(): Promise<number>;

  deleteByEmail(email: string): Promise<void>;
}