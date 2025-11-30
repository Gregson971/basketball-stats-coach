import { Game, GameData } from '../../../domain/entities/Game';
import { IGameRepository } from '../../../domain/repositories/GameRepository';

export interface UpdateGameResult {
  success: boolean;
  game?: Game;
  error?: string;
}

export class UpdateGame {
  constructor(private readonly gameRepository: IGameRepository) {}

  async execute(gameId: string, updateData: Partial<GameData>): Promise<UpdateGameResult> {
    try {
      const game = await this.gameRepository.findById(gameId);

      if (!game) {
        return {
          success: false,
          error: 'Game not found',
        };
      }

      game.update(updateData);
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
