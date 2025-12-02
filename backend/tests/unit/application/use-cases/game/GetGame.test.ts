import { GetGame } from '../../../../../src/application/use-cases/game/GetGame';
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

describe('GetGame Use Case', () => {
  let mockRepository: MockGameRepository;
  let getGame: GetGame;

  beforeEach(() => {
    mockRepository = new MockGameRepository();
    getGame = new GetGame(mockRepository);
  });

  test('should get a game by id', async () => {
    const game = new Game({
      userId: 'user-123',
      teamId: 'team-123',
      opponent: 'Tigers',
      location: 'Main Arena',
    });
    mockRepository.games.push(game);

    const result = await getGame.execute(game.id, 'user-123');

    expect(result.success).toBe(true);
    expect(result.game?.id).toBe(game.id);
    expect(result.game?.userId).toBe('user-123');
    expect(result.game?.teamId).toBe('team-123');
    expect(result.game?.opponent).toBe('Tigers');
    expect(result.game?.location).toBe('Main Arena');
  });

  test('should return error when game not found', async () => {
    const result = await getGame.execute('non-existent-id', 'user-123');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Game not found');
  });

  test('should not return game for different userId', async () => {
    const game = new Game({
      userId: 'user-1',
      teamId: 'team-123',
      opponent: 'Tigers',
    });
    mockRepository.games.push(game);

    const result = await getGame.execute(game.id, 'user-2');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Game not found');
  });
});
