import { IPlayerRepository } from '../../../domain/repositories/PlayerRepository';

export interface DeletePlayerResult {
  success: boolean;
  error?: string;
}

export class DeletePlayer {
  constructor(private readonly playerRepository: IPlayerRepository) {}

  async execute(playerId: string): Promise<DeletePlayerResult> {
    try {
      const deleted = await this.playerRepository.delete(playerId);

      if (!deleted) {
        return {
          success: false,
          error: 'Player not found',
        };
      }

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
