import { Request, Response } from 'express';
import { CreatePlayer } from '../../application/use-cases/player/CreatePlayer';
import { UpdatePlayer } from '../../application/use-cases/player/UpdatePlayer';
import { DeletePlayer } from '../../application/use-cases/player/DeletePlayer';
import { GetPlayer } from '../../application/use-cases/player/GetPlayer';
import { GetPlayersByTeam } from '../../application/use-cases/player/GetPlayersByTeam';
import { IPlayerRepository } from '../../domain/repositories/PlayerRepository';

export class PlayerController {
  private createPlayer: CreatePlayer;
  private updatePlayer: UpdatePlayer;
  private deletePlayer: DeletePlayer;
  private getPlayer: GetPlayer;
  private getPlayersByTeam: GetPlayersByTeam;
  private playerRepository: IPlayerRepository;

  constructor(playerRepository: IPlayerRepository) {
    this.playerRepository = playerRepository;
    this.createPlayer = new CreatePlayer(playerRepository);
    this.updatePlayer = new UpdatePlayer(playerRepository);
    this.deletePlayer = new DeletePlayer(playerRepository);
    this.getPlayer = new GetPlayer(playerRepository);
    this.getPlayersByTeam = new GetPlayersByTeam(playerRepository);
  }

  /**
   * POST /api/players
   */
  async create(req: Request, res: Response): Promise<void> {
    const result = await this.createPlayer.execute(req.body);

    if (!result.success) {
      res.status(400).json({
        success: false,
        error: result.error
      });
      return;
    }

    res.status(201).json({
      success: true,
      player: result.player
    });
  }

  /**
   * GET /api/players/:id
   */
  async getById(req: Request, res: Response): Promise<void> {
    const result = await this.getPlayer.execute(req.params.id);

    if (!result.success) {
      res.status(404).json({
        success: false,
        error: result.error
      });
      return;
    }

    res.status(200).json({
      success: true,
      player: result.player
    });
  }

  /**
   * PUT /api/players/:id
   */
  async update(req: Request, res: Response): Promise<void> {
    const result = await this.updatePlayer.execute(req.params.id, req.body);

    if (!result.success) {
      res.status(404).json({
        success: false,
        error: result.error
      });
      return;
    }

    res.status(200).json({
      success: true,
      player: result.player
    });
  }

  /**
   * DELETE /api/players/:id
   */
  async delete(req: Request, res: Response): Promise<void> {
    const result = await this.deletePlayer.execute(req.params.id);

    if (!result.success) {
      res.status(404).json({
        success: false,
        error: result.error
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Player deleted successfully'
    });
  }

  /**
   * GET /api/players/team/:teamId
   */
  async getByTeam(req: Request, res: Response): Promise<void> {
    const result = await this.getPlayersByTeam.execute(req.params.teamId);

    if (!result.success) {
      res.status(400).json({
        success: false,
        error: result.error
      });
      return;
    }

    res.status(200).json({
      success: true,
      players: result.players
    });
  }

  /**
   * GET /api/players
   */
  async getAll(_req: Request, res: Response): Promise<void> {
    // Pour l'instant on retourne tous les joueurs via findAll du repository
    try {
      const players = await this.playerRepository.findAll();

      res.status(200).json({
        success: true,
        players
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
