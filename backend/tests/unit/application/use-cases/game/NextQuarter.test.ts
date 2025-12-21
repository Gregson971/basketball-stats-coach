import { NextQuarter } from '../../../../../src/application/use-cases/game/NextQuarter';
import { Game } from '../../../../../src/domain/entities/Game';
import { IGameRepository } from '../../../../../src/domain/repositories/GameRepository';
import { GameStatus } from '../../../../../src/domain/entities/Game';

// Mock repository
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

  async findByUserId(userId: string): Promise<Game[]> {
    return this.games.filter((g) => g.userId === userId);
  }

  async findAll(): Promise<Game[]> {
    return this.games;
  }

  async findByStatus(status: GameStatus, userId: string): Promise<Game[]> {
    return this.games.filter((g) => g.status === status && g.userId === userId);
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

describe('NextQuarter Use Case', () => {
  let mockGameRepository: MockGameRepository;
  let nextQuarter: NextQuarter;
  let game: Game;
  const userId = 'user-123';
  const teamId = 'team-456';
  const playerIds = ['p1', 'p2', 'p3', 'p4', 'p5'];

  // Helper to create and start a game
  const createAndStartGame = () => {
    const newGame = new Game({
      userId,
      teamId,
      opponent: 'Panthers',
    });
    newGame.setRoster(playerIds);
    newGame.setStartingLineup(playerIds);
    newGame.start();
    return newGame;
  };

  beforeEach(() => {
    mockGameRepository = new MockGameRepository();
    nextQuarter = new NextQuarter(mockGameRepository);

    // Create and start a game
    game = createAndStartGame();
    mockGameRepository.games.push(game);
  });

  test('should move to next quarter successfully', async () => {
    expect(game.currentQuarter).toBe(1);

    const result = await nextQuarter.execute({
      gameId: game.id,
      userId,
    });

    expect(result.success).toBe(true);
    expect(result.game).toBeDefined();
    expect(result.game?.currentQuarter).toBe(2);
  });

  test('should return error when game not found', async () => {
    const result = await nextQuarter.execute({
      gameId: 'non-existent',
      userId,
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Game not found');
  });

  test('should return error when game is not in progress', async () => {
    // Create a new game that hasn't started
    const notStartedGame = new Game({
      userId,
      teamId,
      opponent: 'Tigers',
    });
    mockGameRepository.games.push(notStartedGame);

    const result = await nextQuarter.execute({
      gameId: notStartedGame.id,
      userId,
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Le match doit être en cours');
  });

  test('should return error when game is completed', async () => {
    // Complete the game
    game.complete();

    const result = await nextQuarter.execute({
      gameId: game.id,
      userId,
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Le match doit être en cours');
  });

  test('should return error when already at quarter 4', async () => {
    // Move to quarter 4
    game.nextQuarter(); // Q2
    game.nextQuarter(); // Q3
    game.nextQuarter(); // Q4

    expect(game.currentQuarter).toBe(4);

    const result = await nextQuarter.execute({
      gameId: game.id,
      userId,
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Le match est au dernier quart-temps');
  });

  test('should allow all quarter transitions from 1 to 4', async () => {
    // Quarter 1 → 2
    let result = await nextQuarter.execute({
      gameId: game.id,
      userId,
    });
    expect(result.success).toBe(true);
    expect(result.game?.currentQuarter).toBe(2);

    // Quarter 2 → 3
    result = await nextQuarter.execute({
      gameId: game.id,
      userId,
    });
    expect(result.success).toBe(true);
    expect(result.game?.currentQuarter).toBe(3);

    // Quarter 3 → 4
    result = await nextQuarter.execute({
      gameId: game.id,
      userId,
    });
    expect(result.success).toBe(true);
    expect(result.game?.currentQuarter).toBe(4);
  });

  test('should isolate data by userId - user cannot modify other users games', async () => {
    const user2 = 'user-789';

    const result = await nextQuarter.execute({
      gameId: game.id,
      userId: user2,
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Game not found');

    // Verify original game quarter was not modified
    const originalGame = await mockGameRepository.findById(game.id, userId);
    expect(originalGame?.currentQuarter).toBe(1);
  });

  test('should preserve game data when moving to next quarter', async () => {
    const result = await nextQuarter.execute({
      gameId: game.id,
      userId,
    });

    expect(result.success).toBe(true);
    expect(result.game?.id).toBe(game.id);
    expect(result.game?.userId).toBe(userId);
    expect(result.game?.teamId).toBe(teamId);
    expect(result.game?.opponent).toBe('Panthers');
    expect(result.game?.status).toBe('in_progress');
    expect(result.game?.roster).toEqual(playerIds);
    expect(result.game?.startingLineup).toEqual(playerIds);
    expect(result.game?.currentLineup).toEqual(playerIds);
  });

  test('should update timestamp when moving to next quarter', async () => {
    const originalUpdatedAt = game.updatedAt;

    // Wait a bit to ensure timestamp changes
    await new Promise((resolve) => setTimeout(resolve, 10));

    const result = await nextQuarter.execute({
      gameId: game.id,
      userId,
    });

    expect(result.success).toBe(true);
    expect(result.game?.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
  });
});
