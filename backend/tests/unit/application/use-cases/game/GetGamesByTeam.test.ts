import { GetGamesByTeam } from '../../../../../src/application/use-cases/game/GetGamesByTeam';
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

  async findByTeamId(teamId: string): Promise<Game[]> {
    return this.games.filter(g => g.teamId === teamId);
  }

  async findAll(): Promise<Game[]> {
    return this.games;
  }

  async findByStatus(_status: GameStatus): Promise<Game[]> {
    return [];
  }

  async delete(_id: string): Promise<boolean> {
    return false;
  }
}

describe('GetGamesByTeam Use Case', () => {
  let mockRepository: MockGameRepository;
  let getGamesByTeam: GetGamesByTeam;

  beforeEach(() => {
    mockRepository = new MockGameRepository();
    getGamesByTeam = new GetGamesByTeam(mockRepository);
  });

  test('should get all games for a team', async () => {
    const game1 = new Game({ teamId: 'team-123', opponent: 'Tigers' });
    const game2 = new Game({ teamId: 'team-123', opponent: 'Panthers' });
    const game3 = new Game({ teamId: 'team-456', opponent: 'Lions' });
    mockRepository.games.push(game1, game2, game3);

    const result = await getGamesByTeam.execute('team-123');

    expect(result.success).toBe(true);
    expect(result.games?.length).toBe(2);
    expect(result.games?.[0].opponent).toBe('Tigers');
    expect(result.games?.[1].opponent).toBe('Panthers');
  });

  test('should return empty array when team has no games', async () => {
    const result = await getGamesByTeam.execute('team-no-games');

    expect(result.success).toBe(true);
    expect(result.games?.length).toBe(0);
  });

  test('should only return games for specified team', async () => {
    const game1 = new Game({ teamId: 'team-A', opponent: 'Team B' });
    const game2 = new Game({ teamId: 'team-B', opponent: 'Team C' });
    const game3 = new Game({ teamId: 'team-A', opponent: 'Team D' });
    mockRepository.games.push(game1, game2, game3);

    const result = await getGamesByTeam.execute('team-A');

    expect(result.success).toBe(true);
    expect(result.games?.length).toBe(2);
    expect(result.games?.every(g => g.teamId === 'team-A')).toBe(true);
  });
});
