import { Team, TeamData } from '../../../domain/entities/Team';
import { ITeamRepository } from '../../../domain/repositories/TeamRepository';

export interface CreateTeamResult {
  success: boolean;
  team?: Team;
  error?: string;
}

export class CreateTeam {
  constructor(private readonly teamRepository: ITeamRepository) {}

  async execute(teamData: TeamData): Promise<CreateTeamResult> {
    try {
      const team = new Team(teamData);
      const savedTeam = await this.teamRepository.save(team);

      return {
        success: true,
        team: savedTeam,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
