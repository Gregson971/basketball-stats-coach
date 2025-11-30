import { Game } from '../../../domain/entities/Game';
import { IGameRepository } from '../../../domain/repositories/GameRepository';

export interface GetGameResult {
  success: boolean;
  game?: Game;
  error?: string;
}

export class GetGame {
  constructor(private readonly gameRepository: IGameRepository) {}

  async execute(gameId: string): Promise<GetGameResult> {
    try {
      const game = await this.gameRepository.findById(gameId);

      if (!game) {
        return {
          success: false,
          error: 'Game not found',
        };
      }

      return {
        success: true,
        game,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
