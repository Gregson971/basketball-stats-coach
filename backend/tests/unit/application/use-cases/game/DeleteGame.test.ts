import { DeleteGame } from '../../../../../src/application/use-cases/game/DeleteGame';
import { Game, GameStatus } from '../../../../../src/domain/entities/Game';
import { IGameRepository } from '../../../../../src/domain/repositories/GameRepository';

class MockGameRepository implements IGameRepository {
  public games: Game[] = [];

  async findById(id: string): Promise<Game | null> {
    return this.games.find(g => g.id === id) || null;
  }

  async save(game: Game): Promise<Game> {
    this.games.push(game);
    return game;
  }

  async findByTeamId(_teamId: string): Promise<Game[]> {
    return [];
  }

  async findAll(): Promise<Game[]> {
    return this.games;
  }

  async findByStatus(_status: GameStatus): Promise<Game[]> {
    return [];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.games.findIndex(g => g.id === id);
    if (index >= 0) {
      this.games.splice(index, 1);
      return true;
    }
    return false;
  }
}

describe('DeleteGame Use Case', () => {
  let mockRepository: MockGameRepository;
  let deleteGame: DeleteGame;

  beforeEach(() => {
    mockRepository = new MockGameRepository();
    deleteGame = new DeleteGame(mockRepository);
  });

  test('should delete a game successfully', async () => {
    const game = new Game({ teamId: 'team-123', opponent: 'Tigers' });
    mockRepository.games.push(game);

    const result = await deleteGame.execute(game.id);

    expect(result.success).toBe(true);
    expect(mockRepository.games.length).toBe(0);
  });

  test('should return error when game not found', async () => {
    const result = await deleteGame.execute('non-existent-id');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Game not found');
  });
});
