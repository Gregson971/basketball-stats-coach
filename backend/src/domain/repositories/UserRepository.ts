import { User } from '../entities/User';

/**
 * User Repository Interface
 * Defines the contract for user data persistence
 */
export interface IUserRepository {
  /**
   * Find a user by ID
   */
  findById(id: string): Promise<User | null>;

  /**
   * Find a user by email
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Find all users
   */
  findAll(): Promise<User[]>;

  /**
   * Save a user (create or update)
   */
  save(user: User): Promise<User>;

  /**
   * Delete a user by ID
   */
  delete(id: string): Promise<boolean>;
}
