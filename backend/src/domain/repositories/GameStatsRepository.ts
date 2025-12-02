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
   * Find game stats by ID and userId
   */
  findById(id: string, userId: string): Promise<GameStats | null>;

  /**
   * Find game stats by game ID and userId
   */
  findByGameId(gameId: string, userId: string): Promise<GameStats[]>;

  /**
   * Find game stats by player ID and userId
   */
  findByPlayerId(playerId: string, userId: string): Promise<GameStats[]>;

  /**
   * Find game stats by game ID and player ID
   */
  findByGameAndPlayer(gameId: string, playerId: string, userId: string): Promise<GameStats | null>;

  /**
   * Find all game stats for a userId
   */
  findByUserId(userId: string): Promise<GameStats[]>;

  /**
   * Save game stats (create or update)
   */
  save(gameStats: GameStats): Promise<GameStats>;

  /**
   * Delete game stats by ID and userId
   */
  delete(id: string, userId: string): Promise<boolean>;

  /**
   * Get aggregate stats for a player across multiple games
   */
  getPlayerAggregateStats(playerId: string, userId: string): Promise<PlayerAggregateStats>;

  /**
   * Delete all game stats for a userId (cascade delete)
   */
  deleteByUserId(userId: string): Promise<number>;
}
