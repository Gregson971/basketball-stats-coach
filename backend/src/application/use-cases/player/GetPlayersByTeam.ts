import { Player } from '../../../domain/entities/Player';
import { IPlayerRepository } from '../../../domain/repositories/PlayerRepository';

export interface GetPlayersByTeamResult {
  success: boolean;
  players?: Player[];
  error?: string;
}

export class GetPlayersByTeam {
  constructor(private readonly playerRepository: IPlayerRepository) {}

  async execute(teamId: string): Promise<GetPlayersByTeamResult> {
    try {
      const players = await this.playerRepository.findByTeamId(teamId);

      return {
        success: true,
        players
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}
