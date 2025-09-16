import { User } from '../types/auth';

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(userData: { email: string }): Promise<User>;
  updateLastLogin(id: string): Promise<void>;
  delete(id: string): Promise<void>;
}