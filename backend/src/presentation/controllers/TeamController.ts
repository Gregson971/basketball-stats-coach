import { Request, Response } from 'express';
import { CreateTeam } from '../../application/use-cases/team/CreateTeam';
import { UpdateTeam } from '../../application/use-cases/team/UpdateTeam';
import { DeleteTeam } from '../../application/use-cases/team/DeleteTeam';
import { GetTeam } from '../../application/use-cases/team/GetTeam';
import { GetAllTeams } from '../../application/use-cases/team/GetAllTeams';
import { ITeamRepository } from '../../domain/repositories/TeamRepository';

// Default userId for tests when auth is disabled
const DEFAULT_TEST_USER_ID = 'test-user';

export class TeamController {
  private createTeam: CreateTeam;
  private updateTeam: UpdateTeam;
  private deleteTeam: DeleteTeam;
  private getTeam: GetTeam;
  private getAllTeams: GetAllTeams;

  constructor(teamRepository: ITeamRepository) {
    this.createTeam = new CreateTeam(teamRepository);
    this.updateTeam = new UpdateTeam(teamRepository);
    this.deleteTeam = new DeleteTeam(teamRepository);
    this.getTeam = new GetTeam(teamRepository);
    this.getAllTeams = new GetAllTeams(teamRepository);
  }

  async create(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId || DEFAULT_TEST_USER_ID;
    const result = await this.createTeam.execute({ ...req.body, userId });

    if (!result.success) {
      res.status(400).json({ success: false, error: result.error });
      return;
    }

    res.status(201).json({ success: true, team: result.team });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId || DEFAULT_TEST_USER_ID;
    const result = await this.getTeam.execute(req.params.id, userId);

    if (!result.success) {
      res.status(404).json({ success: false, error: result.error });
      return;
    }

    res.status(200).json({ success: true, team: result.team });
  }

  async update(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId || DEFAULT_TEST_USER_ID;
    const result = await this.updateTeam.execute(req.params.id, userId, req.body);

    if (!result.success) {
      res.status(404).json({ success: false, error: result.error });
      return;
    }

    res.status(200).json({ success: true, team: result.team });
  }

  async delete(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId || DEFAULT_TEST_USER_ID;
    const result = await this.deleteTeam.execute(req.params.id, userId);

    if (!result.success) {
      res.status(404).json({ success: false, error: result.error });
      return;
    }

    res.status(200).json({ success: true, message: 'Team deleted successfully' });
  }

  async getAll(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId || DEFAULT_TEST_USER_ID;
    const result = await this.getAllTeams.execute(userId);

    if (!result.success) {
      res.status(500).json({ success: false, error: result.error });
      return;
    }

    res.status(200).json({ success: true, teams: result.teams });
  }
}
