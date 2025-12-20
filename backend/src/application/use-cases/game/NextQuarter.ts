import { Game } from '../../../domain/entities/Game';
import { IGameRepository } from '../../../domain/repositories/GameRepository';

export interface NextQuarterRequest {
  gameId: string;
  userId: string;
}

export interface NextQuarterResult {
  success: boolean;
  game?: Game;
  error?: string;
}

export class NextQuarter {
  constructor(private readonly gameRepository: IGameRepository) {}

  async execute(request: NextQuarterRequest): Promise<NextQuarterResult> {
    try {
      const { gameId, userId } = request;

      // Récupérer le match
      const game = await this.gameRepository.findById(gameId, userId);
      if (!game) {
        return { success: false, error: 'Game not found' };
      }

      // Passer au quart-temps suivant
      game.nextQuarter();
      const updatedGame = await this.gameRepository.save(game);

      return { success: true, game: updatedGame };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
