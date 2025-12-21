import { Player, PlayerData } from '../../../domain/entities/Player';
import { IPlayerRepository } from '../../../domain/repositories/PlayerRepository';

export interface UpdatePlayerResult {
  success: boolean;
  player?: Player;
  error?: string;
}

export class UpdatePlayer {
  constructor(private readonly playerRepository: IPlayerRepository) {}

  async execute(
    playerId: string,
    userId: string,
    updateData: Partial<PlayerData>
  ): Promise<UpdatePlayerResult> {
    try {
      // Find the player
      const player = await this.playerRepository.findById(playerId, userId);

      if (!player) {
        return {
          success: false,
          error: 'Player not found',
        };
      }

      // Update player (validation happens in update method)
      player.update(updateData);

      // Save updated player
      const updatedPlayer = await this.playerRepository.save(player);

      return {
        success: true,
        player: updatedPlayer,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
