import { Game } from '../../../domain/entities/Game';
import { IGameRepository } from '../../../domain/repositories/GameRepository';

export interface CompleteGameResult {
  success: boolean;
  game?: Game;
  error?: string;
}

export class CompleteGame {
  constructor(private readonly gameRepository: IGameRepository) {}

  async execute(gameId: string): Promise<CompleteGameResult> {
    try {
      const game = await this.gameRepository.findById(gameId);

      if (!game) {
        return {
          success: false,
          error: 'Game not found'
        };
      }

      game.complete();
      const updatedGame = await this.gameRepository.save(game);

      return {
        success: true,
        game: updatedGame
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}
