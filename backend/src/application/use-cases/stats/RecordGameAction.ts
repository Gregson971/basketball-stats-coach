import { GameStats, ActionType } from '../../../domain/entities/GameStats';
import { IGameStatsRepository } from '../../../domain/repositories/GameStatsRepository';
import { IGameRepository } from '../../../domain/repositories/GameRepository';

export interface RecordGameActionRequest {
  gameId: string;
  playerId: string;
  userId: string;
  actionType: ActionType;
  made?: boolean;
}

export interface RecordGameActionResult {
  success: boolean;
  gameStats?: GameStats;
  error?: string;
}

export class RecordGameAction {
  constructor(
    private readonly gameStatsRepository: IGameStatsRepository,
    private readonly gameRepository: IGameRepository
  ) {}

  async execute(actionData: RecordGameActionRequest): Promise<RecordGameActionResult> {
    try {
      const { gameId, playerId, userId, actionType, made } = actionData;

      // Verify game exists and is in progress
      const game = await this.gameRepository.findById(gameId, userId);
      if (!game) {
        return {
          success: false,
          error: 'Game not found',
        };
      }

      if (!game.isInProgress()) {
        return {
          success: false,
          error: 'Game is not in progress',
        };
      }

      // Verify player is currently on the court
      if (!game.currentLineup.includes(playerId)) {
        return {
          success: false,
          error: 'Player is not currently on the court',
        };
      }

      // Get or create game stats for this player
      let gameStats = await this.gameStatsRepository.findByGameAndPlayer(gameId, playerId, userId);

      if (!gameStats) {
        gameStats = new GameStats({ gameId, playerId, userId });
      }

      // Record the action
      switch (actionType) {
        case 'freeThrow':
          gameStats.recordFreeThrow(made ?? false);
          break;
        case 'twoPoint':
          gameStats.recordTwoPoint(made ?? false);
          break;
        case 'threePoint':
          gameStats.recordThreePoint(made ?? false);
          break;
        case 'offensiveRebound':
          gameStats.recordOffensiveRebound();
          break;
        case 'defensiveRebound':
          gameStats.recordDefensiveRebound();
          break;
        case 'assist':
          gameStats.recordAssist();
          break;
        case 'steal':
          gameStats.recordSteal();
          break;
        case 'block':
          gameStats.recordBlock();
          break;
        case 'turnover':
          gameStats.recordTurnover();
          break;
        case 'personalFoul':
          gameStats.recordPersonalFoul();
          break;
        default:
          return {
            success: false,
            error: `Invalid action type: ${actionType}`,
          };
      }

      // Save updated stats
      const savedStats = await this.gameStatsRepository.save(gameStats);

      return {
        success: true,
        gameStats: savedStats,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
