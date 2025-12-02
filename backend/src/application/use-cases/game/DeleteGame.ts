import { IGameRepository } from '../../../domain/repositories/GameRepository';

export interface DeleteGameResult {
  success: boolean;
  error?: string;
}

export class DeleteGame {
  constructor(private readonly gameRepository: IGameRepository) {}

  async execute(gameId: string, userId: string): Promise<DeleteGameResult> {
    try {
      const game = await this.gameRepository.findById(gameId, userId);

      if (!game) {
        return {
          success: false,
          error: 'Game not found',
        };
      }

      await this.gameRepository.delete(gameId, userId);

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
