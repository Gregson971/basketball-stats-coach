import { Game, GameStatus } from '../../../domain/entities/Game';
import { IGameRepository } from '../../../domain/repositories/GameRepository';

export interface GetGamesByStatusResult {
  success: boolean;
  games?: Game[];
  error?: string;
}

export class GetGamesByStatus {
  constructor(private readonly gameRepository: IGameRepository) {}

  async execute(status: GameStatus, userId: string): Promise<GetGamesByStatusResult> {
    try {
      const games = await this.gameRepository.findByStatus(status, userId);

      return {
        success: true,
        games,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
