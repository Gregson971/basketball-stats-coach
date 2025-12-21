import { SetStartingLineup } from '../../../../../src/application/use-cases/game/SetStartingLineup';
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

describe('SetStartingLineup Use Case', () => {
  let mockGameRepository: MockGameRepository;
  let setStartingLineup: SetStartingLineup;
  let game: Game;
  const userId = 'user-123';
  const teamId = 'team-456';
  const playerIds = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'];

  beforeEach(() => {
    mockGameRepository = new MockGameRepository();
    setStartingLineup = new SetStartingLineup(mockGameRepository);

    // Create a game with roster set
    game = new Game({
      userId,
      teamId,
      opponent: 'Tigers',
    });
    game.setRoster(playerIds);
    mockGameRepository.games.push(game);
  });

  test('should set starting lineup successfully with 5 valid players from roster', async () => {
    const lineup = playerIds.slice(0, 5);

    const result = await setStartingLineup.execute({
      gameId: game.id,
      userId,
      playerIds: lineup,
    });

    expect(result.success).toBe(true);
    expect(result.game).toBeDefined();
    expect(result.game?.startingLineup).toEqual(lineup);
    expect(result.game?.currentLineup).toEqual(lineup);
  });

  test('should return error when game not found', async () => {
    const result = await setStartingLineup.execute({
      gameId: 'non-existent',
      userId,
      playerIds: playerIds.slice(0, 5),
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Game not found');
  });

  test('should return error when game has already started', async () => {
    // Set lineup and start the game
    game.setStartingLineup(playerIds.slice(0, 5));
    game.start();

    const result = await setStartingLineup.execute({
      gameId: game.id,
      userId,
      playerIds: playerIds.slice(0, 5),
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Cannot modify lineup of a started game');
  });

  test('should return error when game is completed', async () => {
    // Set lineup, start and complete the game
    game.setStartingLineup(playerIds.slice(0, 5));
    game.start();
    game.complete();

    const result = await setStartingLineup.execute({
      gameId: game.id,
      userId,
      playerIds: playerIds.slice(0, 5),
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Cannot modify lineup of a started game');
  });

  test('should return error when roster is not set', async () => {
    // Create a new game without roster
    const gameWithoutRoster = new Game({
      userId,
      teamId,
      opponent: 'Panthers',
    });
    mockGameRepository.games.push(gameWithoutRoster);

    const result = await setStartingLineup.execute({
      gameId: gameWithoutRoster.id,
      userId,
      playerIds: ['p1', 'p2', 'p3', 'p4', 'p5'],
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Roster must be set before defining starting lineup');
  });

  test('should return error when lineup has less than 5 players', async () => {
    const result = await setStartingLineup.execute({
      gameId: game.id,
      userId,
      playerIds: playerIds.slice(0, 3), // Only 3 players
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('La composition de départ doit contenir exactement 5 joueurs');
  });

  test('should return error when lineup has more than 5 players', async () => {
    const result = await setStartingLineup.execute({
      gameId: game.id,
      userId,
      playerIds: playerIds, // 6 players
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('La composition de départ doit contenir exactement 5 joueurs');
  });

  test('should return error when players are not in roster', async () => {
    const invalidPlayerIds = ['invalid-1', 'invalid-2', 'invalid-3', 'invalid-4', 'invalid-5'];

    const result = await setStartingLineup.execute({
      gameId: game.id,
      userId,
      playerIds: invalidPlayerIds,
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Les titulaires doivent faire partie des joueurs convoqués');
  });

  test('should return error when some players are not in roster', async () => {
    const mixedPlayerIds = [playerIds[0], playerIds[1], 'invalid-1', 'invalid-2', 'invalid-3'];

    const result = await setStartingLineup.execute({
      gameId: game.id,
      userId,
      playerIds: mixedPlayerIds,
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Les titulaires doivent faire partie des joueurs convoqués');
  });

  test('should return error when lineup contains duplicate players', async () => {
    const duplicatePlayerIds = [
      playerIds[0],
      playerIds[1],
      playerIds[2],
      playerIds[3],
      playerIds[0],
    ];

    const result = await setStartingLineup.execute({
      gameId: game.id,
      userId,
      playerIds: duplicatePlayerIds,
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Starting lineup contains duplicate players');
  });

  test('should update lineup when called multiple times', async () => {
    // First lineup
    const firstLineup = playerIds.slice(0, 5);
    await setStartingLineup.execute({
      gameId: game.id,
      userId,
      playerIds: firstLineup,
    });

    // Second lineup (different players from roster)
    const secondLineup = [playerIds[1], playerIds[2], playerIds[3], playerIds[4], playerIds[5]];
    const result = await setStartingLineup.execute({
      gameId: game.id,
      userId,
      playerIds: secondLineup,
    });

    expect(result.success).toBe(true);
    expect(result.game?.startingLineup).toEqual(secondLineup);
    expect(result.game?.currentLineup).toEqual(secondLineup);
    expect(result.game?.startingLineup).not.toEqual(firstLineup);
  });

  test('should isolate data by userId - user cannot modify other users games', async () => {
    const user2 = 'user-789';

    const result = await setStartingLineup.execute({
      gameId: game.id,
      userId: user2,
      playerIds: playerIds.slice(0, 5),
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Game not found');

    // Verify original game lineup was not modified
    const originalGame = await mockGameRepository.findById(game.id, userId);
    expect(originalGame?.startingLineup).toEqual([]);
    expect(originalGame?.currentLineup).toEqual([]);
  });

  test('should preserve game data when setting lineup', async () => {
    const lineup = playerIds.slice(0, 5);

    const result = await setStartingLineup.execute({
      gameId: game.id,
      userId,
      playerIds: lineup,
    });

    expect(result.success).toBe(true);
    expect(result.game?.id).toBe(game.id);
    expect(result.game?.userId).toBe(userId);
    expect(result.game?.teamId).toBe(teamId);
    expect(result.game?.opponent).toBe('Tigers');
    expect(result.game?.status).toBe('not_started');
    expect(result.game?.roster).toEqual(playerIds);
  });

  test('should allow any 5 players from the roster', async () => {
    // Different combinations of 5 players from the roster
    const lineup1 = [playerIds[0], playerIds[1], playerIds[2], playerIds[3], playerIds[4]];
    const lineup2 = [playerIds[1], playerIds[2], playerIds[3], playerIds[4], playerIds[5]];
    const lineup3 = [playerIds[0], playerIds[2], playerIds[3], playerIds[4], playerIds[5]];

    for (const lineup of [lineup1, lineup2, lineup3]) {
      const result = await setStartingLineup.execute({
        gameId: game.id,
        userId,
        playerIds: lineup,
      });

      expect(result.success).toBe(true);
      expect(result.game?.startingLineup).toEqual(lineup);
    }
  });
});
