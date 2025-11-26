import { GetGame } from '../../../../../src/application/use-cases/game/GetGame';
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

  async delete(_id: string): Promise<boolean> {
    return false;
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
      teamId: 'team-123',
      opponent: 'Tigers',
      location: 'Main Arena'
    });
    mockRepository.games.push(game);

    const result = await getGame.execute(game.id);

    expect(result.success).toBe(true);
    expect(result.game?.id).toBe(game.id);
    expect(result.game?.teamId).toBe('team-123');
    expect(result.game?.opponent).toBe('Tigers');
    expect(result.game?.location).toBe('Main Arena');
  });

  test('should return error when game not found', async () => {
    const result = await getGame.execute('non-existent-id');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Game not found');
  });
});
