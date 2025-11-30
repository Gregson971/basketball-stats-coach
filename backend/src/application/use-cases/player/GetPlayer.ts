import { Player } from '../../../domain/entities/Player';
import { IPlayerRepository } from '../../../domain/repositories/PlayerRepository';

export interface GetPlayerResult {
  success: boolean;
  player?: Player;
  error?: string;
}

export class GetPlayer {
  constructor(private readonly playerRepository: IPlayerRepository) {}

  async execute(playerId: string): Promise<GetPlayerResult> {
    try {
      const player = await this.playerRepository.findById(playerId);

      if (!player) {
        return {
          success: false,
          error: 'Player not found',
        };
      }

      return {
        success: true,
        player,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
