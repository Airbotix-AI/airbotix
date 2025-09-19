import { v4 as uuidv4 } from 'uuid';
import { RateLimitRecord } from '../../types/auth';
import { RateLimitRepository } from '../rate-limit.repository';

export class MemoryRateLimitRepository implements RateLimitRepository {
  private records: Map<string, RateLimitRecord> = new Map();

  async findByKey(key: string): Promise<RateLimitRecord | null> {
    for (const record of this.records.values()) {
      if (record.key === key) {
        return record;
      }
    }
    return null;
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

    this.records.set(record.id, record);
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
      resetTime: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
    });
  }

  async delete(key: string): Promise<void> {
    for (const [id, record] of this.records.entries()) {
      if (record.key === key) {
        this.records.delete(id);
        break;
      }
    }
  }

  async deleteExpired(): Promise<number> {
    const now = new Date();
    let deletedCount = 0;

    for (const [id, record] of this.records.entries()) {
      if (record.resetTime < now) {
        this.records.delete(id);
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