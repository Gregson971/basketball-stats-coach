import { Team } from '../entities/Team';

/**
 * Team Repository Interface
 * Defines the contract for team data persistence
 */
export interface ITeamRepository {
  /**
   * Find a team by ID
   */
  findById(id: string): Promise<Team | null>;

  /**
   * Find all teams
   */
  findAll(): Promise<Team[]>;

  /**
   * Save a team (create or update)
   */
  save(team: Team): Promise<Team>;

  /**
   * Delete a team by ID
   */
  delete(id: string): Promise<boolean>;

  /**
   * Search teams by name
   */
  searchByName(query: string): Promise<Team[]>;
}
