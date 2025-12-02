import { StartGame } from '../../../../../src/application/use-cases/game/StartGame';
import { Game } from '../../../../../src/domain/entities/Game';
import { IGameRepository } from '../../../../../src/domain/repositories/GameRepository';
import { GameStatus } from '../../../../../src/domain/entities/Game';

// Mock repository
class MockGameRepository implements IGameRepository {
  private games: Game[] = [];

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

describe('StartGame Use Case', () => {
  let mockRepository: MockGameRepository;
  let startGame: StartGame;
  const userId = 'user-123';

  beforeEach(() => {
    mockRepository = new MockGameRepository();
    startGame = new StartGame(mockRepository);
  });

  test('should start a game successfully', async () => {
    const game = new Game({
      userId,
      teamId: 'team-123',
      opponent: 'Tigers',
    });
    await mockRepository.save(game);

    const result = await startGame.execute(game.id, userId);

    expect(result.success).toBe(true);
    expect(result.game?.status).toBe('in_progress');
    expect(result.game?.startedAt).toBeInstanceOf(Date);
    expect(result.game?.userId).toBe(userId);
  });

  test('should return error when game not found', async () => {
    const result = await startGame.execute('non-existent-id', userId);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Game not found');
  });

  test('should return error when game is already started', async () => {
    const game = new Game({
      userId,
      teamId: 'team-123',
      opponent: 'Tigers',
    });
    game.start();
    await mockRepository.save(game);

    const result = await startGame.execute(game.id, userId);

    expect(result.success).toBe(false);
    expect(result.error).toContain('already in progress or completed');
  });

  test('should update game in repository', async () => {
    const game = new Game({
      userId,
      teamId: 'team-123',
      opponent: 'Tigers',
    });
    await mockRepository.save(game);

    await startGame.execute(game.id, userId);

    const updatedGame = await mockRepository.findById(game.id, userId);
    expect(updatedGame?.status).toBe('in_progress');
    expect(updatedGame?.startedAt).toBeInstanceOf(Date);
  });

  test('should not start game from different user', async () => {
    const game = new Game({
      userId,
      teamId: 'team-123',
      opponent: 'Tigers',
    });
    await mockRepository.save(game);

    const result = await startGame.execute(game.id, 'different-user-id');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Game not found');
  });
});
