import { Game } from '../../../domain/entities/Game';
import { IGameRepository } from '../../../domain/repositories/GameRepository';
import { IPlayerRepository } from '../../../domain/repositories/PlayerRepository';

export interface SetGameRosterRequest {
  gameId: string;
  userId: string;
  playerIds: string[];
}

export interface SetGameRosterResult {
  success: boolean;
  game?: Game;
  error?: string;
}

export class SetGameRoster {
  constructor(
    private readonly gameRepository: IGameRepository,
    private readonly playerRepository: IPlayerRepository
  ) {}

  async execute(request: SetGameRosterRequest): Promise<SetGameRosterResult> {
    try {
      const { gameId, userId, playerIds } = request;

      // Récupérer le match
      const game = await this.gameRepository.findById(gameId, userId);
      if (!game) {
        return { success: false, error: 'Game not found' };
      }

      // Vérifier que le match n'a pas démarré
      if (game.status !== 'not_started') {
        return { success: false, error: 'Cannot modify roster of a started game' };
      }

      // Vérifier que tous les joueurs appartiennent à l'équipe du match
      const teamPlayers = await this.playerRepository.findByTeamId(game.teamId, userId);
      const teamPlayerIds = teamPlayers.map((p) => p.id);

      const invalidPlayers = playerIds.filter((id) => !teamPlayerIds.includes(id));
      if (invalidPlayers.length > 0) {
        return {
          success: false,
          error: 'Some players do not belong to this team',
        };
      }

      // Définir le roster
      game.setRoster(playerIds);
      const updatedGame = await this.gameRepository.save(game);

      return { success: true, game: updatedGame };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
