import { v4 as uuidv4 } from 'uuid';
import { RateLimitRecord } from '../../types/auth';
import { RateLimitRepository } from '../rate-limit.repository';

export class MemoryRateLimitRepository implements RateLimitRepository {
  // Keyed by rate limit key to ensure a single record per key
  private records: Map<string, RateLimitRecord> = new Map();

  async findByKey(key: string): Promise<RateLimitRecord | null> {
    return this.records.get(key) || null;
  }

  async create(data: {
    key: string;
    count: number;
    resetTime: Date;
  }): Promise<RateLimitRecord> {
    const record: RateLimitRecord = {
      id: uuidv4(),
      key: data.key,
      count: data.count,
      resetTime: data.resetTime,
      createdAt: new Date(),
    };

    this.records.set(record.key, record);
    return record;
  }

  async increment(key: string): Promise<RateLimitRecord> {
    const existing = await this.findByKey(key);

    if (existing) {
      existing.count += 1;
      return existing;
    }

    // Create new record if not exists
    return this.create({
      key,
      count: 1,
      resetTime: new Date(Date.now() + 15 * 60 * 1000), // default 15 minutes
    });
  }

  async delete(key: string): Promise<void> {
    this.records.delete(key);
  }

  async deleteExpired(): Promise<number> {
    const now = new Date();
    let deletedCount = 0;

    for (const [k, record] of this.records.entries()) {
      if (record.resetTime < now) {
        this.records.delete(k);
        deletedCount++;
      }
    }

    return deletedCount;
  }

  async reset(key: string): Promise<void> {
    await this.delete(key);
  }

  // Utility methods for testing
  clear(): void {
    this.records.clear();
  }

  getAllRecords(): RateLimitRecord[] {
    return Array.from(this.records.values());
  }
}