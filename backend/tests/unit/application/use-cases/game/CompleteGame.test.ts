import { CompleteGame } from '../../../../../src/application/use-cases/game/CompleteGame';
import { Game } from '../../../../../src/domain/entities/Game';
import { IGameRepository } from '../../../../../src/domain/repositories/GameRepository';
import { GameStatus } from '../../../../../src/domain/entities/Game';

class MockGameRepository implements IGameRepository {
  public games: Game[] = [];

  async findById(id: string): Promise<Game | null> {
    return this.games.find(g => g.id === id) || null;
  }

  async save(game: Game): Promise<Game> {
    const existingIndex = this.games.findIndex(g => g.id === game.id);
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

  async findByStatus(_status: GameStatus): Promise<Game[]> {
    return [];
  }

  async delete(_id: string): Promise<boolean> {
    return false;
  }
}

describe('CompleteGame Use Case', () => {
  let mockRepository: MockGameRepository;
  let completeGame: CompleteGame;
  let game: Game;

  beforeEach(() => {
    mockRepository = new MockGameRepository();
    completeGame = new CompleteGame(mockRepository);

    game = new Game({
      teamId: 'team-123',
      opponent: 'Tigers'
    });
    game.start();
    mockRepository.games.push(game);
  });

  test('should complete a game successfully', async () => {
    const result = await completeGame.execute(game.id);

    expect(result.success).toBe(true);
    expect(result.game?.status).toBe('completed');
    expect(result.game?.completedAt).toBeInstanceOf(Date);
  });

  test('should return error when game not found', async () => {
    const result = await completeGame.execute('non-existent-id');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Game not found');
  });

  test('should return error when game not in progress', async () => {
    const notStartedGame = new Game({
      teamId: 'team-123',
      opponent: 'Lions'
    });
    mockRepository.games.push(notStartedGame);

    const result = await completeGame.execute(notStartedGame.id);

    expect(result.success).toBe(false);
    expect(result.error).toContain('must be in progress');
  });
});
