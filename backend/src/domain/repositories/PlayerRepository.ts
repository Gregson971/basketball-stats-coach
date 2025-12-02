import { Player } from '../entities/Player';

/**
 * Player Repository Interface
 * Defines the contract for player data persistence
 */
export interface IPlayerRepository {
  /**
   * Find a player by ID and userId
   */
  findById(id: string, userId: string): Promise<Player | null>;

  /**
   * Find all players for a team and userId
   */
  findByTeamId(teamId: string, userId: string): Promise<Player[]>;

  /**
   * Find all players for a userId
   */
  findByUserId(userId: string): Promise<Player[]>;

  /**
   * Save a player (create or update)
   */
  save(player: Player): Promise<Player>;

  /**
   * Delete a player by ID and userId
   */
  delete(id: string, userId: string): Promise<boolean>;

  /**
   * Search players by name for a userId
   */
  searchByName(query: string, userId: string): Promise<Player[]>;

  /**
   * Delete all players for a userId (cascade delete)
   */
  deleteByUserId(userId: string): Promise<number>;
}
