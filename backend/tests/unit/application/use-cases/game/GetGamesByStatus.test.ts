import { GetGamesByStatus } from '../../../../../src/application/use-cases/game/GetGamesByStatus';
import { Game, GameStatus } from '../../../../../src/domain/entities/Game';
import { IGameRepository } from '../../../../../src/domain/repositories/GameRepository';

class MockGameRepository implements IGameRepository {
  public games: Game[] = [];

  async findById(id: string, userId: string): Promise<Game | null> {
    return this.games.find((g) => g.id === id && g.userId === userId) || null;
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

describe('GetGamesByStatus Use Case', () => {
  let mockRepository: MockGameRepository;
  let getGamesByStatus: GetGamesByStatus;
  const userId = 'user-123';

  // Helper to prepare a game for starting
  const prepareGameForStart = (game: Game) => {
    game.setRoster(['p1', 'p2', 'p3', 'p4', 'p5']);
    game.setStartingLineup(['p1', 'p2', 'p3', 'p4', 'p5']);
  };

  beforeEach(() => {
    mockRepository = new MockGameRepository();
    getGamesByStatus = new GetGamesByStatus(mockRepository);
  });

  test('should get all games with not_started status', async () => {
    const game1 = new Game({ userId, teamId: 'team-123', opponent: 'Tigers' });
    const game2 = new Game({ userId, teamId: 'team-123', opponent: 'Panthers' });
    const game3 = new Game({ userId, teamId: 'team-123', opponent: 'Lions' });
    prepareGameForStart(game3);
    game3.start();
    mockRepository.games.push(game1, game2, game3);

    const result = await getGamesByStatus.execute('not_started', userId);

    expect(result.success).toBe(true);
    expect(result.games?.length).toBe(2);
    expect(result.games?.every((g) => g.status === 'not_started')).toBe(true);
  });

  test('should get all games with in_progress status', async () => {
    const game1 = new Game({ userId, teamId: 'team-123', opponent: 'Tigers' });
    const game2 = new Game({ userId, teamId: 'team-123', opponent: 'Panthers' });
    const game3 = new Game({ userId, teamId: 'team-123', opponent: 'Lions' });
    prepareGameForStart(game1);
    game1.start();
    prepareGameForStart(game2);
    game2.start();
    mockRepository.games.push(game1, game2, game3);

    const result = await getGamesByStatus.execute('in_progress', userId);

    expect(result.success).toBe(true);
    expect(result.games?.length).toBe(2);
    expect(result.games?.every((g) => g.status === 'in_progress')).toBe(true);
  });

  test('should get all games with completed status', async () => {
    const game1 = new Game({ userId, teamId: 'team-123', opponent: 'Tigers' });
    const game2 = new Game({ userId, teamId: 'team-123', opponent: 'Panthers' });
    const game3 = new Game({ userId, teamId: 'team-123', opponent: 'Lions' });
    prepareGameForStart(game1);
    game1.start();
    game1.complete();
    prepareGameForStart(game2);
    game2.start();
    mockRepository.games.push(game1, game2, game3);

    const result = await getGamesByStatus.execute('completed', userId);

    expect(result.success).toBe(true);
    expect(result.games?.length).toBe(1);
    expect(result.games?.[0].opponent).toBe('Tigers');
    expect(result.games?.[0].status).toBe('completed');
  });

  test('should return empty array when no games match status', async () => {
    const game1 = new Game({ userId, teamId: 'team-123', opponent: 'Tigers' });
    mockRepository.games.push(game1);

    const result = await getGamesByStatus.execute('completed', userId);

    expect(result.success).toBe(true);
    expect(result.games?.length).toBe(0);
  });

  test('should not return games from different user', async () => {
    const game1 = new Game({ userId, teamId: 'team-123', opponent: 'Tigers' });
    const game2 = new Game({ userId: 'user-456', teamId: 'team-123', opponent: 'Panthers' });
    mockRepository.games.push(game1, game2);

    const result = await getGamesByStatus.execute('not_started', userId);

    expect(result.success).toBe(true);
    expect(result.games?.length).toBe(1);
    expect(result.games?.[0].userId).toBe(userId);
  });
});
