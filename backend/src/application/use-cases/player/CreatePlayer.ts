import { Player, PlayerData } from '../../../domain/entities/Player';
import { IPlayerRepository } from '../../../domain/repositories/PlayerRepository';

export interface CreatePlayerResult {
  success: boolean;
  player?: Player;
  error?: string;
}

export class CreatePlayer {
  constructor(private readonly playerRepository: IPlayerRepository) {}

  async execute(playerData: PlayerData): Promise<CreatePlayerResult> {
    try {
      // Create player entity (validation happens in constructor)
      const player = new Player(playerData);

      // Save to repository
      const savedPlayer = await this.playerRepository.save(player);

      return {
        success: true,
        player: savedPlayer
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}
