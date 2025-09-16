import { v4 as uuidv4 } from 'uuid';
import { User } from '../../types/auth';
import { UserRepository } from '../user.repository';

export class MemoryUserRepository implements UserRepository {
  private users: Map<string, User> = new Map();

  async findByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async create(userData: { email: string }): Promise<User> {
    const user: User = {
      id: uuidv4(),
      email: userData.email,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.set(user.id, user);
    return user;
  }

  async updateLastLogin(id: string): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      user.lastLoginAt = new Date();
      user.updatedAt = new Date();
    }
  }

  async delete(id: string): Promise<void> {
    this.users.delete(id);
  }

  // Utility methods for testing
  clear(): void {
    this.users.clear();
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }
}