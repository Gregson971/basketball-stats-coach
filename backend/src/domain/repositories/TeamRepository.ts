import { Team } from '../entities/Team';

/**
 * Team Repository Interface
 * Defines the contract for team data persistence
 */
export interface ITeamRepository {
  /**
   * Find a team by ID and userId
   */
  findById(id: string, userId: string): Promise<Team | null>;

  /**
   * Find all teams for a userId
   */
  findAll(userId: string): Promise<Team[]>;

  /**
   * Find all teams for a userId
   */
  findByUserId(userId: string): Promise<Team[]>;

  /**
   * Save a team (create or update)
   */
  save(team: Team): Promise<Team>;

  /**
   * Delete a team by ID and userId
   */
  delete(id: string, userId: string): Promise<boolean>;

  /**
   * Search teams by name for a userId
   */
  searchByName(query: string, userId: string): Promise<Team[]>;

  /**
   * Delete all teams for a userId (cascade delete)
   */
  deleteByUserId(userId: string): Promise<number>;
}
