import { ITeamRepository } from '../../../domain/repositories/TeamRepository';

export interface DeleteTeamResult {
  success: boolean;
  error?: string;
}

export class DeleteTeam {
  constructor(private readonly teamRepository: ITeamRepository) {}

  async execute(teamId: string, userId: string): Promise<DeleteTeamResult> {
    try {
      const team = await this.teamRepository.findById(teamId, userId);

      if (!team) {
        return {
          success: false,
          error: 'Team not found',
        };
      }

      await this.teamRepository.delete(teamId, userId);

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
