import { Game } from '../../../domain/entities/Game';
import { IGameRepository } from '../../../domain/repositories/GameRepository';

export interface SetStartingLineupRequest {
  gameId: string;
  userId: string;
  playerIds: string[];
}

export interface SetStartingLineupResult {
  success: boolean;
  game?: Game;
  error?: string;
}

export class SetStartingLineup {
  constructor(private readonly gameRepository: IGameRepository) {}

  async execute(request: SetStartingLineupRequest): Promise<SetStartingLineupResult> {
    try {
      const { gameId, userId, playerIds } = request;

      // Récupérer le match
      const game = await this.gameRepository.findById(gameId, userId);
      if (!game) {
        return { success: false, error: 'Game not found' };
      }

      // Vérifier que le match n'a pas démarré
      if (game.status !== 'not_started') {
        return { success: false, error: 'Cannot modify lineup of a started game' };
      }

      // Vérifier que le roster a été défini
      if (game.roster.length === 0) {
        return {
          success: false,
          error: 'Roster must be set before defining starting lineup',
        };
      }

      // Définir la lineup de départ
      game.setStartingLineup(playerIds);
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
