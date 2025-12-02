import { GetGamesByTeam } from '../../../../../src/application/use-cases/game/GetGamesByTeam';
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

describe('GetGamesByTeam Use Case', () => {
  let mockRepository: MockGameRepository;
  let getGamesByTeam: GetGamesByTeam;
  const userId = 'user-123';

  beforeEach(() => {
    mockRepository = new MockGameRepository();
    getGamesByTeam = new GetGamesByTeam(mockRepository);
  });

  test('should get all games for a team', async () => {
    const game1 = new Game({ userId, teamId: 'team-123', opponent: 'Tigers' });
    const game2 = new Game({ userId, teamId: 'team-123', opponent: 'Panthers' });
    const game3 = new Game({ userId, teamId: 'team-456', opponent: 'Lions' });
    mockRepository.games.push(game1, game2, game3);

    const result = await getGamesByTeam.execute('team-123', userId);

    expect(result.success).toBe(true);
    expect(result.games?.length).toBe(2);
    expect(result.games?.[0].opponent).toBe('Tigers');
    expect(result.games?.[1].opponent).toBe('Panthers');
  });

  test('should return empty array when team has no games', async () => {
    const result = await getGamesByTeam.execute('team-no-games', userId);

    expect(result.success).toBe(true);
    expect(result.games?.length).toBe(0);
  });

  test('should only return games for specified team', async () => {
    const game1 = new Game({ userId, teamId: 'team-A', opponent: 'Team B' });
    const game2 = new Game({ userId, teamId: 'team-B', opponent: 'Team C' });
    const game3 = new Game({ userId, teamId: 'team-A', opponent: 'Team D' });
    mockRepository.games.push(game1, game2, game3);

    const result = await getGamesByTeam.execute('team-A', userId);

    expect(result.success).toBe(true);
    expect(result.games?.length).toBe(2);
    expect(result.games?.every((g) => g.teamId === 'team-A')).toBe(true);
  });

  test('should not return games from different user', async () => {
    const game1 = new Game({ userId, teamId: 'team-123', opponent: 'Tigers' });
    const game2 = new Game({ userId: 'user-456', teamId: 'team-123', opponent: 'Panthers' });
    mockRepository.games.push(game1, game2);

    const result = await getGamesByTeam.execute('team-123', userId);

    expect(result.success).toBe(true);
    expect(result.games?.length).toBe(1);
    expect(result.games?.[0].opponent).toBe('Tigers');
    expect(result.games?.[0].userId).toBe(userId);
  });
});
