import { Game, GameData } from '../../../domain/entities/Game';
import { IGameRepository } from '../../../domain/repositories/GameRepository';

export interface CreateGameResult {
  success: boolean;
  game?: Game;
  error?: string;
}

export class CreateGame {
  constructor(private readonly gameRepository: IGameRepository) {}

  async execute(gameData: GameData): Promise<CreateGameResult> {
    try {
      const game = new Game(gameData);
      const savedGame = await this.gameRepository.save(game);

      return {
        success: true,
        game: savedGame,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
