import { Request, Response } from 'express';
import { CreateGame } from '../../application/use-cases/game/CreateGame';
import { UpdateGame } from '../../application/use-cases/game/UpdateGame';
import { DeleteGame } from '../../application/use-cases/game/DeleteGame';
import { GetGame } from '../../application/use-cases/game/GetGame';
import { GetGamesByTeam } from '../../application/use-cases/game/GetGamesByTeam';
import { GetGamesByStatus } from '../../application/use-cases/game/GetGamesByStatus';
import { StartGame } from '../../application/use-cases/game/StartGame';
import { CompleteGame } from '../../application/use-cases/game/CompleteGame';
import { IGameRepository } from '../../domain/repositories/GameRepository';
import { GameStatus } from '../../domain/entities/Game';

// Default userId for tests when auth is disabled
const DEFAULT_TEST_USER_ID = 'test-user';

export class GameController {
  private createGame: CreateGame;
  private updateGame: UpdateGame;
  private deleteGame: DeleteGame;
  private getGame: GetGame;
  private getGamesByTeam: GetGamesByTeam;
  private getGamesByStatus: GetGamesByStatus;
  private startGame: StartGame;
  private completeGame: CompleteGame;

  constructor(gameRepository: IGameRepository) {
    this.createGame = new CreateGame(gameRepository);
    this.updateGame = new UpdateGame(gameRepository);
    this.deleteGame = new DeleteGame(gameRepository);
    this.getGame = new GetGame(gameRepository);
    this.getGamesByTeam = new GetGamesByTeam(gameRepository);
    this.getGamesByStatus = new GetGamesByStatus(gameRepository);
    this.startGame = new StartGame(gameRepository);
    this.completeGame = new CompleteGame(gameRepository);
  }

  async create(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId || DEFAULT_TEST_USER_ID;
    const result = await this.createGame.execute({ ...req.body, userId });

    if (!result.success) {
      res.status(400).json({ success: false, error: result.error });
      return;
    }

    res.status(201).json({ success: true, game: result.game });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId || DEFAULT_TEST_USER_ID;
    const result = await this.getGame.execute(req.params.id, userId);

    if (!result.success) {
      res.status(404).json({ success: false, error: result.error });
      return;
    }

    res.status(200).json({ success: true, game: result.game });
  }

  async update(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId || DEFAULT_TEST_USER_ID;
    const result = await this.updateGame.execute(req.params.id, userId, req.body);

    if (!result.success) {
      res.status(404).json({ success: false, error: result.error });
      return;
    }

    res.status(200).json({ success: true, game: result.game });
  }

  async delete(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId || DEFAULT_TEST_USER_ID;
    const result = await this.deleteGame.execute(req.params.id, userId);

    if (!result.success) {
      res.status(404).json({ success: false, error: result.error });
      return;
    }

    res.status(200).json({ success: true, message: 'Game deleted successfully' });
  }

  async getByTeam(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId || DEFAULT_TEST_USER_ID;
    const result = await this.getGamesByTeam.execute(req.params.teamId, userId);

    if (!result.success) {
      res.status(400).json({ success: false, error: result.error });
      return;
    }

    res.status(200).json({ success: true, games: result.games });
  }

  async getByStatus(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId || DEFAULT_TEST_USER_ID;
    const status = req.params.status as GameStatus;
    const result = await this.getGamesByStatus.execute(status, userId);

    if (!result.success) {
      res.status(400).json({ success: false, error: result.error });
      return;
    }

    res.status(200).json({ success: true, games: result.games });
  }

  async start(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId || DEFAULT_TEST_USER_ID;
    const result = await this.startGame.execute(req.params.id, userId);

    if (!result.success) {
      res.status(400).json({ success: false, error: result.error });
      return;
    }

    res.status(200).json({ success: true, game: result.game });
  }

  async complete(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId || DEFAULT_TEST_USER_ID;
    const result = await this.completeGame.execute(req.params.id, userId);

    if (!result.success) {
      res.status(400).json({ success: false, error: result.error });
      return;
    }

    res.status(200).json({ success: true, game: result.game });
  }
}
