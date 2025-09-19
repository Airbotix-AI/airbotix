import { RateLimitRecord } from '../types/auth';

export interface RateLimitRepository {
  findByKey(key: string): Promise<RateLimitRecord | null>;

  create(data: {
    key: string;
    count: number;
    resetTime: Date;
  }): Promise<RateLimitRecord>;

  increment(key: string): Promise<RateLimitRecord>;

  delete(key: string): Promise<void>;

  deleteExpired(): Promise<number>;

  reset(key: string): Promise<void>;
}