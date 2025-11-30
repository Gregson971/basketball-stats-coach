import { GetGamesByStatus } from '../../../../../src/application/use-cases/game/GetGamesByStatus';
import { Game, GameStatus } from '../../../../../src/domain/entities/Game';
import { IGameRepository } from '../../../../../src/domain/repositories/GameRepository';

class MockGameRepository implements IGameRepository {
  public games: Game[] = [];

  async findById(id: string): Promise<Game | null> {
    return this.games.find((g) => g.id === id) || null;
  }

  async save(game: Game): Promise<Game> {
    const existingIndex = this.games.findIndex((g) => g.id === game.id);
    if (existingIndex >= 0) {
      this.games[existingIndex] = game;
    } else {
      this.games.push(game);
    }
    return game;
  }

  async findByTeamId(_teamId: string): Promise<Game[]> {
    return [];
  }

  async findAll(): Promise<Game[]> {
    return this.games;
  }

  async findByStatus(status: GameStatus): Promise<Game[]> {
    return this.games.filter((g) => g.status === status);
  }

  async delete(_id: string): Promise<boolean> {
    return false;
  }
}

describe('GetGamesByStatus Use Case', () => {
  let mockRepository: MockGameRepository;
  let getGamesByStatus: GetGamesByStatus;

  beforeEach(() => {
    mockRepository = new MockGameRepository();
    getGamesByStatus = new GetGamesByStatus(mockRepository);
  });

  test('should get all games with not_started status', async () => {
    const game1 = new Game({ teamId: 'team-123', opponent: 'Tigers' });
    const game2 = new Game({ teamId: 'team-123', opponent: 'Panthers' });
    const game3 = new Game({ teamId: 'team-123', opponent: 'Lions' });
    game3.start();
    mockRepository.games.push(game1, game2, game3);

    const result = await getGamesByStatus.execute('not_started');

    expect(result.success).toBe(true);
    expect(result.games?.length).toBe(2);
    expect(result.games?.every((g) => g.status === 'not_started')).toBe(true);
  });

  test('should get all games with in_progress status', async () => {
    const game1 = new Game({ teamId: 'team-123', opponent: 'Tigers' });
    const game2 = new Game({ teamId: 'team-123', opponent: 'Panthers' });
    const game3 = new Game({ teamId: 'team-123', opponent: 'Lions' });
    game1.start();
    game2.start();
    mockRepository.games.push(game1, game2, game3);

    const result = await getGamesByStatus.execute('in_progress');

    expect(result.success).toBe(true);
    expect(result.games?.length).toBe(2);
    expect(result.games?.every((g) => g.status === 'in_progress')).toBe(true);
  });

  test('should get all games with completed status', async () => {
    const game1 = new Game({ teamId: 'team-123', opponent: 'Tigers' });
    const game2 = new Game({ teamId: 'team-123', opponent: 'Panthers' });
    const game3 = new Game({ teamId: 'team-123', opponent: 'Lions' });
    game1.start();
    game1.complete();
    game2.start();
    mockRepository.games.push(game1, game2, game3);

    const result = await getGamesByStatus.execute('completed');

    expect(result.success).toBe(true);
    expect(result.games?.length).toBe(1);
    expect(result.games?.[0].opponent).toBe('Tigers');
    expect(result.games?.[0].status).toBe('completed');
  });

  test('should return empty array when no games match status', async () => {
    const game1 = new Game({ teamId: 'team-123', opponent: 'Tigers' });
    mockRepository.games.push(game1);

    const result = await getGamesByStatus.execute('completed');

    expect(result.success).toBe(true);
    expect(result.games?.length).toBe(0);
  });
});
