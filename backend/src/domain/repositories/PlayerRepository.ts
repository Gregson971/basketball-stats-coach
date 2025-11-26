import { Player } from '../entities/Player';

/**
 * Player Repository Interface
 * Defines the contract for player data persistence
 */
export interface IPlayerRepository {
  /**
   * Find a player by ID
   */
  findById(id: string): Promise<Player | null>;

  /**
   * Find all players for a team
   */
  findByTeamId(teamId: string): Promise<Player[]>;

  /**
   * Find all players
   */
  findAll(): Promise<Player[]>;

  /**
   * Save a player (create or update)
   */
  save(player: Player): Promise<Player>;

  /**
   * Delete a player by ID
   */
  delete(id: string): Promise<boolean>;

  /**
   * Search players by name
   */
  searchByName(query: string): Promise<Player[]>;
}
