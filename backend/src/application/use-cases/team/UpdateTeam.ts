import { Team, TeamData } from '../../../domain/entities/Team';
import { ITeamRepository } from '../../../domain/repositories/TeamRepository';

export interface UpdateTeamResult {
  success: boolean;
  team?: Team;
  error?: string;
}

export class UpdateTeam {
  constructor(private readonly teamRepository: ITeamRepository) {}

  async execute(teamId: string, updateData: Partial<TeamData>): Promise<UpdateTeamResult> {
    try {
      const team = await this.teamRepository.findById(teamId);

      if (!team) {
        return {
          success: false,
          error: 'Team not found'
        };
      }

      team.update(updateData);
      const updatedTeam = await this.teamRepository.save(team);

      return {
        success: true,
        team: updatedTeam
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}
