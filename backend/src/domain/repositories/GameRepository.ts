import { Game, GameStatus } from '../entities/Game';

/**
 * Game Repository Interface
 * Defines the contract for game data persistence
 */
export interface IGameRepository {
  /**
   * Find a game by ID
   */
  findById(id: string): Promise<Game | null>;

  /**
   * Find all games for a team
   */
  findByTeamId(teamId: string): Promise<Game[]>;

  /**
   * Find all games
   */
  findAll(): Promise<Game[]>;

  /**
   * Find games by status
   */
  findByStatus(status: GameStatus): Promise<Game[]>;

  /**
   * Save a game (create or update)
   */
  save(game: Game): Promise<Game>;

  /**
   * Delete a game by ID
   */
  delete(id: string): Promise<boolean>;
}
