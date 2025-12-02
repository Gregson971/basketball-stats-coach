import { Request, Response } from 'express';
import { RecordGameAction } from '../../application/use-cases/stats/RecordGameAction';
import { UndoLastGameAction } from '../../application/use-cases/stats/UndoLastGameAction';
import { GetPlayerGameStats } from '../../application/use-cases/stats/GetPlayerGameStats';
import { GetPlayerCareerStats } from '../../application/use-cases/stats/GetPlayerCareerStats';
import { IGameStatsRepository } from '../../domain/repositories/GameStatsRepository';
import { IGameRepository } from '../../domain/repositories/GameRepository';

// Default userId for tests when auth is disabled
const DEFAULT_TEST_USER_ID = 'test-user';

export class StatsController {
  private recordGameAction: RecordGameAction;
  private undoLastGameAction: UndoLastGameAction;
  private getPlayerGameStats: GetPlayerGameStats;
  private getPlayerCareerStats: GetPlayerCareerStats;

  constructor(gameStatsRepository: IGameStatsRepository, gameRepository: IGameRepository) {
    this.recordGameAction = new RecordGameAction(gameStatsRepository, gameRepository);
    this.undoLastGameAction = new UndoLastGameAction(gameStatsRepository);
    this.getPlayerGameStats = new GetPlayerGameStats(gameStatsRepository);
    this.getPlayerCareerStats = new GetPlayerCareerStats(gameStatsRepository);
  }

  async recordAction(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId || DEFAULT_TEST_USER_ID;
    const { gameId } = req.params;
    const actionData = {
      gameId,
      userId,
      ...req.body,
    };

    const result = await this.recordGameAction.execute(actionData);

    if (!result.success) {
      res.status(400).json({ success: false, error: result.error });
      return;
    }

    res.status(201).json({ success: true, gameStats: result.gameStats });
  }

  async undoAction(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId || DEFAULT_TEST_USER_ID;
    const { gameId, playerId } = req.params;
    const result = await this.undoLastGameAction.execute(gameId, playerId, userId);

    if (!result.success) {
      res.status(400).json({ success: false, error: result.error });
      return;
    }

    res.status(200).json({ success: true, gameStats: result.gameStats });
  }

  async getGameStats(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId || DEFAULT_TEST_USER_ID;
    const { gameId, playerId } = req.params;
    const result = await this.getPlayerGameStats.execute(gameId, playerId, userId);

    if (!result.success) {
      res.status(404).json({ success: false, error: result.error });
      return;
    }

    res.status(200).json({ success: true, gameStats: result.gameStats });
  }

  async getCareerStats(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId || DEFAULT_TEST_USER_ID;
    const { playerId } = req.params;
    const result = await this.getPlayerCareerStats.execute(playerId, userId);

    if (!result.success) {
      res.status(400).json({ success: false, error: result.error });
      return;
    }

    res.status(200).json({ success: true, stats: result.stats });
  }
}
