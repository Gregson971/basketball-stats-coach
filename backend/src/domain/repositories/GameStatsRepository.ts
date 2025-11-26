import { GameStats } from '../entities/GameStats';

/**
 * Aggregated statistics for a player
 */
export interface PlayerAggregateStats {
  playerId: string;
  gamesPlayed: number;
  totalPoints: number;
  totalRebounds: number;
  totalAssists: number;
  totalSteals: number;
  totalBlocks: number;
  totalTurnovers: number;
  averagePoints: number;
  averageRebounds: number;
  averageAssists: number;
  fieldGoalPercentage: number;
  freeThrowPercentage: number;
  threePointPercentage: number;
}

/**
 * GameStats Repository Interface
 * Defines the contract for game statistics data persistence
 */
export interface IGameStatsRepository {
  /**
   * Find game stats by ID
   */
  findById(id: string): Promise<GameStats | null>;

  /**
   * Find game stats by game ID
   */
  findByGameId(gameId: string): Promise<GameStats[]>;

  /**
   * Find game stats by player ID
   */
  findByPlayerId(playerId: string): Promise<GameStats[]>;

  /**
   * Find game stats by game ID and player ID
   */
  findByGameAndPlayer(gameId: string, playerId: string): Promise<GameStats | null>;

  /**
   * Save game stats (create or update)
   */
  save(gameStats: GameStats): Promise<GameStats>;

  /**
   * Delete game stats by ID
   */
  delete(id: string): Promise<boolean>;

  /**
   * Get aggregate stats for a player across multiple games
   */
  getPlayerAggregateStats(playerId: string): Promise<PlayerAggregateStats>;
}
