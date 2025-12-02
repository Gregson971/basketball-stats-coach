import { DeleteGame } from '../../../../../src/application/use-cases/game/DeleteGame';
import { Game, GameStatus } from '../../../../../src/domain/entities/Game';
import { IGameRepository } from '../../../../../src/domain/repositories/GameRepository';

class MockGameRepository implements IGameRepository {
  public games: Game[] = [];

  async findById(id: string, userId: string): Promise<Game | null> {
    return this.games.find((g) => g.id === id && g.userId === userId) || null;
  }

  async save(game: Game): Promise<Game> {
    this.games.push(game);
    return game;
  }

  async findByTeamId(teamId: string, userId: string): Promise<Game[]> {
    return this.games.filter((g) => g.teamId === teamId && g.userId === userId);
  }

  async findAll(userId: string): Promise<Game[]> {
    return this.games.filter((g) => g.userId === userId);
  }

  async findByStatus(status: GameStatus, userId: string): Promise<Game[]> {
    return this.games.filter((g) => g.status === status && g.userId === userId);
  }

  async findByUserId(userId: string): Promise<Game[]> {
    return this.games.filter((g) => g.userId === userId);
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const index = this.games.findIndex((g) => g.id === id && g.userId === userId);
    if (index >= 0) {
      this.games.splice(index, 1);
      return true;
    }
    return false;
  }

  async deleteByUserId(userId: string): Promise<number> {
    const initialLength = this.games.length;
    this.games = this.games.filter((g) => g.userId !== userId);
    return initialLength - this.games.length;
  }
}

describe('DeleteGame Use Case', () => {
  let mockRepository: MockGameRepository;
  let deleteGame: DeleteGame;
  const userId = 'user-123';

  beforeEach(() => {
    mockRepository = new MockGameRepository();
    deleteGame = new DeleteGame(mockRepository);
  });

  test('should delete a game successfully', async () => {
    const game = new Game({ userId, teamId: 'team-123', opponent: 'Tigers' });
    mockRepository.games.push(game);

    const result = await deleteGame.execute(game.id, userId);

    expect(result.success).toBe(true);
    expect(mockRepository.games.length).toBe(0);
  });

  test('should return error when game not found', async () => {
    const result = await deleteGame.execute('non-existent-id', userId);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Game not found');
  });

  test('should not delete game from different user', async () => {
    const game = new Game({ userId, teamId: 'team-123', opponent: 'Tigers' });
    mockRepository.games.push(game);

    const result = await deleteGame.execute(game.id, 'different-user-id');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Game not found');
    expect(mockRepository.games.length).toBe(1);
  });
});
