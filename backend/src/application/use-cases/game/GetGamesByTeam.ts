import { Game } from '../../../domain/entities/Game';
import { IGameRepository } from '../../../domain/repositories/GameRepository';

export interface GetGamesByTeamResult {
  success: boolean;
  games?: Game[];
  error?: string;
}

export class GetGamesByTeam {
  constructor(private readonly gameRepository: IGameRepository) {}

  async execute(teamId: string, userId: string): Promise<GetGamesByTeamResult> {
    try {
      const games = await this.gameRepository.findByTeamId(teamId, userId);

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
