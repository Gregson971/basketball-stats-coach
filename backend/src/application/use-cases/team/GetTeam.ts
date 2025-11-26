import { Team } from '../../../domain/entities/Team';
import { ITeamRepository } from '../../../domain/repositories/TeamRepository';

export interface GetTeamResult {
  success: boolean;
  team?: Team;
  error?: string;
}

export class GetTeam {
  constructor(private readonly teamRepository: ITeamRepository) {}

  async execute(teamId: string): Promise<GetTeamResult> {
    try {
      const team = await this.teamRepository.findById(teamId);

      if (!team) {
        return {
          success: false,
          error: 'Team not found'
        };
      }

      return {
        success: true,
        team
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}
