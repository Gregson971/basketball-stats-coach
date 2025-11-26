import { Team } from '../../../domain/entities/Team';
import { ITeamRepository } from '../../../domain/repositories/TeamRepository';

export interface GetAllTeamsResult {
  success: boolean;
  teams?: Team[];
  error?: string;
}

export class GetAllTeams {
  constructor(private readonly teamRepository: ITeamRepository) {}

  async execute(): Promise<GetAllTeamsResult> {
    try {
      const teams = await this.teamRepository.findAll();

      return {
        success: true,
        teams
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}
