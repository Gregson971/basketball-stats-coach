import { GameStats } from '../../../domain/entities/GameStats';
import { IGameStatsRepository } from '../../../domain/repositories/GameStatsRepository';

export interface UndoLastGameActionResult {
  success: boolean;
  gameStats?: GameStats;
  error?: string;
}

export class UndoLastGameAction {
  constructor(private readonly gameStatsRepository: IGameStatsRepository) {}

  async execute(
    gameId: string,
    playerId: string,
    userId: string
  ): Promise<UndoLastGameActionResult> {
    try {
      const gameStats = await this.gameStatsRepository.findByGameAndPlayer(
        gameId,
        playerId,
        userId
      );

      if (!gameStats) {
        return {
          success: false,
          error: 'Game stats not found',
        };
      }

      gameStats.undoLastAction();
      const updatedStats = await this.gameStatsRepository.save(gameStats);

      return {
        success: true,
        gameStats: updatedStats,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
