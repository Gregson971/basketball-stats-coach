import { CompleteGame } from '../../../../../src/application/use-cases/game/CompleteGame';
import { Game } from '../../../../../src/domain/entities/Game';
import { IGameRepository } from '../../../../../src/domain/repositories/GameRepository';
import { GameStatus } from '../../../../../src/domain/entities/Game';

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

describe('CompleteGame Use Case', () => {
  let mockRepository: MockGameRepository;
  let completeGame: CompleteGame;
  let game: Game;
  const userId = 'user-123';

  // Helper to prepare a game for starting
  const prepareGameForStart = (game: Game) => {
    game.setRoster(['p1', 'p2', 'p3', 'p4', 'p5']);
    game.setStartingLineup(['p1', 'p2', 'p3', 'p4', 'p5']);
  };

  beforeEach(() => {
    mockRepository = new MockGameRepository();
    completeGame = new CompleteGame(mockRepository);

    game = new Game({
      userId,
      teamId: 'team-123',
      opponent: 'Tigers',
    });
    prepareGameForStart(game);
    game.start();
    mockRepository.games.push(game);
  });

  test('should complete a game successfully', async () => {
    const result = await completeGame.execute(game.id, userId);

    expect(result.success).toBe(true);
    expect(result.game?.status).toBe('completed');
    expect(result.game?.completedAt).toBeInstanceOf(Date);
    expect(result.game?.userId).toBe(userId);
  });

  test('should return error when game not found', async () => {
    const result = await completeGame.execute('non-existent-id', userId);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Game not found');
  });

  test('should return error when game not in progress', async () => {
    const notStartedGame = new Game({
      userId,
      teamId: 'team-123',
      opponent: 'Lions',
    });
    mockRepository.games.push(notStartedGame);

    const result = await completeGame.execute(notStartedGame.id, userId);

    expect(result.success).toBe(false);
    expect(result.error).toContain('must be in progress');
  });

  test('should not complete game from different user', async () => {
    const result = await completeGame.execute(game.id, 'different-user-id');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Game not found');
  });
});
