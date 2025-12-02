import { Game, GameStatus } from '../entities/Game';

/**
 * Game Repository Interface
 * Defines the contract for game data persistence
 */
export interface IGameRepository {
  /**
   * Find a game by ID and userId
   */
  findById(id: string, userId: string): Promise<Game | null>;

  /**
   * Find all games for a team and userId
   */
  findByTeamId(teamId: string, userId: string): Promise<Game[]>;

  /**
   * Find all games for a userId
   */
  findAll(userId: string): Promise<Game[]>;

  /**
   * Find games by status and userId
   */
  findByStatus(status: GameStatus, userId: string): Promise<Game[]>;

  /**
   * Find all games for a userId
   */
  findByUserId(userId: string): Promise<Game[]>;

  /**
   * Save a game (create or update)
   */
  save(game: Game): Promise<Game>;

  /**
   * Delete a game by ID and userId
   */
  delete(id: string, userId: string): Promise<boolean>;

  /**
   * Delete all games for a userId (cascade delete)
   */
  deleteByUserId(userId: string): Promise<number>;
}
