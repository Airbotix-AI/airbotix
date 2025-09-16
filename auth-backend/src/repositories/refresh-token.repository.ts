import { RefreshToken } from '../types/auth';

export interface RefreshTokenRepository {
  create(tokenData: {
    userId: string;
    token: string;
    expiresAt: Date;
  }): Promise<RefreshToken>;

  findByToken(token: string): Promise<RefreshToken | null>;

  revokeByToken(token: string): Promise<void>;

  revokeAllForUser(userId: string): Promise<void>;

  deleteExpired(): Promise<number>;

  delete(id: string): Promise<void>;
}