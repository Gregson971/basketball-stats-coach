import { Game } from '../../../domain/entities/Game';
import { IGameRepository } from '../../../domain/repositories/GameRepository';

export interface StartGameResult {
  success: boolean;
  game?: Game;
  error?: string;
}

export class StartGame {
  constructor(private readonly gameRepository: IGameRepository) {}

  async execute(gameId: string, userId: string): Promise<StartGameResult> {
    try {
      // Find the game
      const game = await this.gameRepository.findById(gameId, userId);

      if (!game) {
        return {
          success: false,
          error: 'Game not found',
        };
      }

      // Start the game
      game.start();

      // Save updated game
      const updatedGame = await this.gameRepository.save(game);

      return {
        success: true,
        game: updatedGame,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
