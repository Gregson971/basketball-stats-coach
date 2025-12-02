import { GameStats } from '../../../domain/entities/GameStats';
import { IGameStatsRepository } from '../../../domain/repositories/GameStatsRepository';

export interface GetPlayerGameStatsResult {
  success: boolean;
  gameStats?: GameStats;
  error?: string;
}

export class GetPlayerGameStats {
  constructor(private readonly gameStatsRepository: IGameStatsRepository) {}

  async execute(gameId: string, playerId: string, userId: string): Promise<GetPlayerGameStatsResult> {
    try {
      const gameStats = await this.gameStatsRepository.findByGameAndPlayer(gameId, playerId, userId);

      if (!gameStats) {
        return {
          success: false,
          error: 'Game stats not found',
        };
      }

      return {
        success: true,
        gameStats,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
