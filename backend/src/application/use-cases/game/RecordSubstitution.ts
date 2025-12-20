import { Game } from '../../../domain/entities/Game';
import { Substitution } from '../../../domain/entities/Substitution';
import { IGameRepository } from '../../../domain/repositories/GameRepository';
import { ISubstitutionRepository } from '../../../domain/repositories/SubstitutionRepository';

export interface RecordSubstitutionRequest {
  gameId: string;
  userId: string;
  playerOut: string;
  playerIn: string;
}

export interface RecordSubstitutionResult {
  success: boolean;
  game?: Game;
  substitution?: Substitution;
  error?: string;
}

export class RecordSubstitution {
  constructor(
    private readonly gameRepository: IGameRepository,
    private readonly substitutionRepository: ISubstitutionRepository
  ) {}

  async execute(request: RecordSubstitutionRequest): Promise<RecordSubstitutionResult> {
    try {
      const { gameId, userId, playerOut, playerIn } = request;

      // Récupérer le match
      const game = await this.gameRepository.findById(gameId, userId);
      if (!game) {
        return { success: false, error: 'Game not found' };
      }

      // Effectuer le changement dans l'entité Game
      game.substitutePlayer(playerOut, playerIn);

      // Créer l'enregistrement du changement
      const substitution = new Substitution({
        gameId,
        quarter: game.currentQuarter,
        playerOut,
        playerIn,
      });

      // Sauvegarder le tout
      const [updatedGame, savedSubstitution] = await Promise.all([
        this.gameRepository.save(game),
        this.substitutionRepository.save(substitution),
      ]);

      return {
        success: true,
        game: updatedGame,
        substitution: savedSubstitution,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
