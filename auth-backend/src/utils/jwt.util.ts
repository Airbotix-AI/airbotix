import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/env';
import { JwtPayload } from '../types/auth';

export class JwtUtil {
  static generateAccessToken(payload: Omit<JwtPayload, 'type'>): string {
    return jwt.sign(
      { ...payload, type: 'access', jti: uuidv4() },
      config.jwt.secret,
      { expiresIn: config.jwt.accessExpiresIn } as jwt.SignOptions
    );
  }

  static generateRefreshToken(payload: Omit<JwtPayload, 'type'>): string {
    return jwt.sign(
      { ...payload, type: 'refresh', jti: uuidv4() },
      config.jwt.secret,
      { expiresIn: config.jwt.refreshExpiresIn } as jwt.SignOptions
    );
  }

  static verifyToken(token: string): JwtPayload {
    return jwt.verify(token, config.jwt.secret) as JwtPayload;
  }

  static decodeToken(token: string): JwtPayload | null {
    try {
      return jwt.decode(token) as JwtPayload;
    } catch {
      return null;
    }
  }

  static getExpirationTime(expiresIn: string): Date {
    const now = Date.now();
    const duration = this.parseExpiration(expiresIn);
    return new Date(now + duration);
  }

  private static parseExpiration(expiresIn: string): number {
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) throw new Error(`Invalid expiration format: ${expiresIn}`);

    const value = parseInt(match[1]);
    const unit = match[2];

    const multipliers = {
      s: 1000,           // seconds
      m: 60 * 1000,      // minutes
      h: 60 * 60 * 1000, // hours
      d: 24 * 60 * 60 * 1000, // days
    };

    return value * multipliers[unit as keyof typeof multipliers];
  }
}