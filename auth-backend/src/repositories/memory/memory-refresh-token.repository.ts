import { v4 as uuidv4 } from 'uuid';
import { RefreshToken } from '../../types/auth';
import { RefreshTokenRepository } from '../refresh-token.repository';

export class MemoryRefreshTokenRepository implements RefreshTokenRepository {
  private tokens: Map<string, RefreshToken> = new Map();

  async create(tokenData: {
    userId: string;
    token: string;
    expiresAt: Date;
  }): Promise<RefreshToken> {
    const refreshToken: RefreshToken = {
      id: uuidv4(),
      userId: tokenData.userId,
      token: tokenData.token,
      expiresAt: tokenData.expiresAt,
      createdAt: new Date(),
      isRevoked: false,
    };

    this.tokens.set(refreshToken.id, refreshToken);
    return refreshToken;
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    for (const refreshToken of this.tokens.values()) {
      if (refreshToken.token === token && !refreshToken.isRevoked) {
        return refreshToken;
      }
    }
    return null;
  }

  async revokeByToken(token: string): Promise<void> {
    for (const refreshToken of this.tokens.values()) {
      if (refreshToken.token === token) {
        refreshToken.isRevoked = true;
        break;
      }
    }
  }

  async revokeAllForUser(userId: string): Promise<void> {
    for (const refreshToken of this.tokens.values()) {
      if (refreshToken.userId === userId) {
        refreshToken.isRevoked = true;
      }
    }
  }

  async deleteExpired(): Promise<number> {
    const now = new Date();
    let deletedCount = 0;

    for (const [id, token] of this.tokens.entries()) {
      if (token.expiresAt < now) {
        this.tokens.delete(id);
        deletedCount++;
      }
    }

    return deletedCount;
  }

  async delete(id: string): Promise<void> {
    this.tokens.delete(id);
  }

  // Utility methods for testing
  clear(): void {
    this.tokens.clear();
  }

  getAllTokens(): RefreshToken[] {
    return Array.from(this.tokens.values());
  }
}