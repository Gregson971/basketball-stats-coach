import {
  IGameStatsRepository,
  PlayerAggregateStats,
} from '../../../domain/repositories/GameStatsRepository';

export interface GetPlayerCareerStatsResult {
  success: boolean;
  stats?: PlayerAggregateStats;
  error?: string;
}

export class GetPlayerCareerStats {
  constructor(private readonly gameStatsRepository: IGameStatsRepository) {}

  async execute(playerId: string, userId: string): Promise<GetPlayerCareerStatsResult> {
    try {
      const stats = await this.gameStatsRepository.getPlayerAggregateStats(playerId, userId);

      return {
        success: true,
        stats,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
