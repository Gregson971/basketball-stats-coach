import { RecordSubstitution } from '../../../../../src/application/use-cases/game/RecordSubstitution';
import { Game } from '../../../../../src/domain/entities/Game';
import { Substitution } from '../../../../../src/domain/entities/Substitution';
import { IGameRepository } from '../../../../../src/domain/repositories/GameRepository';
import { ISubstitutionRepository } from '../../../../../src/domain/repositories/SubstitutionRepository';
import { GameStatus } from '../../../../../src/domain/entities/Game';

// Mock repositories
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

class MockSubstitutionRepository implements ISubstitutionRepository {
  public substitutions: Substitution[] = [];

  async findById(id: string, _userId: string): Promise<Substitution | null> {
    return this.substitutions.find((s) => s.id === id) || null;
  }

  async save(substitution: Substitution): Promise<Substitution> {
    this.substitutions.push(substitution);
    return substitution;
  }

  async findByGameId(gameId: string, _userId: string): Promise<Substitution[]> {
    return this.substitutions.filter((s) => s.gameId === gameId);
  }

  async findByUserId(_userId: string): Promise<Substitution[]> {
    return this.substitutions;
  }

  async delete(id: string, _userId: string): Promise<boolean> {
    const index = this.substitutions.findIndex((s) => s.id === id);
    if (index >= 0) {
      this.substitutions.splice(index, 1);
      return true;
    }
    return false;
  }

  async deleteByUserId(_userId: string): Promise<number> {
    const initialLength = this.substitutions.length;
    this.substitutions = [];
    return initialLength;
  }

  async deleteByGameId(gameId: string, _userId: string): Promise<number> {
    const initialLength = this.substitutions.length;
    this.substitutions = this.substitutions.filter((s) => s.gameId !== gameId);
    return initialLength - this.substitutions.length;
  }
}

describe('RecordSubstitution Use Case', () => {
  let mockGameRepository: MockGameRepository;
  let mockSubstitutionRepository: MockSubstitutionRepository;
  let recordSubstitution: RecordSubstitution;
  let game: Game;
  const userId = 'user-123';
  const teamId = 'team-456';
  const rosterPlayerIds = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'];
  const startingPlayerIds = ['p1', 'p2', 'p3', 'p4', 'p5'];

  // Helper to create and start a game
  const createAndStartGame = () => {
    const newGame = new Game({
      userId,
      teamId,
      opponent: 'Eagles',
    });
    newGame.setRoster(rosterPlayerIds);
    newGame.setStartingLineup(startingPlayerIds);
    newGame.start();
    return newGame;
  };

  beforeEach(() => {
    mockGameRepository = new MockGameRepository();
    mockSubstitutionRepository = new MockSubstitutionRepository();
    recordSubstitution = new RecordSubstitution(
      mockGameRepository,
      mockSubstitutionRepository
    );

    // Create and start a game
    game = createAndStartGame();
    mockGameRepository.games.push(game);
  });

  test('should record substitution successfully', async () => {
    const result = await recordSubstitution.execute({
      gameId: game.id,
      userId,
      playerOut: 'p1',
      playerIn: 'p6',
    });

    expect(result.success).toBe(true);
    expect(result.game).toBeDefined();
    expect(result.substitution).toBeDefined();
    expect(result.substitution?.playerOut).toBe('p1');
    expect(result.substitution?.playerIn).toBe('p6');
    expect(result.substitution?.quarter).toBe(1);
    expect(result.substitution?.gameId).toBe(game.id);
  });

  test('should return error when game not found', async () => {
    const result = await recordSubstitution.execute({
      gameId: 'non-existent',
      userId,
      playerOut: 'p1',
      playerIn: 'p6',
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

    const result = await recordSubstitution.execute({
      gameId: notStartedGame.id,
      userId,
      playerOut: 'p1',
      playerIn: 'p6',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe(
      'Les changements ne peuvent être effectués que pendant un match en cours'
    );
  });

  test('should return error when game is completed', async () => {
    // Complete the game
    game.complete();

    const result = await recordSubstitution.execute({
      gameId: game.id,
      userId,
      playerOut: 'p1',
      playerIn: 'p6',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe(
      'Les changements ne peuvent être effectués que pendant un match en cours'
    );
  });

  test('should return error when playerOut is not on the field', async () => {
    const result = await recordSubstitution.execute({
      gameId: game.id,
      userId,
      playerOut: 'p6', // Not in current lineup
      playerIn: 'p7',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Le joueur sortant doit être sur le terrain');
  });

  test('should return error when playerIn is not in roster', async () => {
    const result = await recordSubstitution.execute({
      gameId: game.id,
      userId,
      playerOut: 'p1',
      playerIn: 'p99', // Not in roster
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Le joueur entrant doit faire partie des joueurs convoqués');
  });

  test('should return error when playerIn is already on the field', async () => {
    const result = await recordSubstitution.execute({
      gameId: game.id,
      userId,
      playerOut: 'p1',
      playerIn: 'p2', // Already in current lineup
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Le joueur entrant est déjà sur le terrain');
  });

  test('should update currentLineup correctly', async () => {
    expect(game.currentLineup).toEqual(['p1', 'p2', 'p3', 'p4', 'p5']);

    const result = await recordSubstitution.execute({
      gameId: game.id,
      userId,
      playerOut: 'p1',
      playerIn: 'p6',
    });

    expect(result.success).toBe(true);
    expect(result.game?.currentLineup).toEqual(['p6', 'p2', 'p3', 'p4', 'p5']);
    expect(result.game?.currentLineup).toHaveLength(5);
  });

  test('should record substitution with correct quarter', async () => {
    // Move to quarter 3
    game.nextQuarter(); // Q2
    game.nextQuarter(); // Q3

    const result = await recordSubstitution.execute({
      gameId: game.id,
      userId,
      playerOut: 'p1',
      playerIn: 'p6',
    });

    expect(result.success).toBe(true);
    expect(result.substitution?.quarter).toBe(3);
  });

  test('should allow multiple substitutions in same game', async () => {
    // First substitution: p1 out, p6 in
    const result1 = await recordSubstitution.execute({
      gameId: game.id,
      userId,
      playerOut: 'p1',
      playerIn: 'p6',
    });

    expect(result1.success).toBe(true);
    expect(result1.game?.currentLineup).toEqual(['p6', 'p2', 'p3', 'p4', 'p5']);

    // Second substitution: p2 out, p7 in
    const result2 = await recordSubstitution.execute({
      gameId: game.id,
      userId,
      playerOut: 'p2',
      playerIn: 'p7',
    });

    expect(result2.success).toBe(true);
    expect(result2.game?.currentLineup).toEqual(['p6', 'p7', 'p3', 'p4', 'p5']);

    // Check that both substitutions were saved
    expect(mockSubstitutionRepository.substitutions).toHaveLength(2);
  });

  test('should allow player to return after being substituted out', async () => {
    // p1 out, p6 in
    await recordSubstitution.execute({
      gameId: game.id,
      userId,
      playerOut: 'p1',
      playerIn: 'p6',
    });

    expect(game.currentLineup).toEqual(['p6', 'p2', 'p3', 'p4', 'p5']);

    // p6 out, p1 in (p1 returns)
    const result = await recordSubstitution.execute({
      gameId: game.id,
      userId,
      playerOut: 'p6',
      playerIn: 'p1',
    });

    expect(result.success).toBe(true);
    expect(result.game?.currentLineup).toEqual(['p1', 'p2', 'p3', 'p4', 'p5']);
  });

  test('should isolate data by userId - user cannot modify other users games', async () => {
    const user2 = 'user-789';

    const result = await recordSubstitution.execute({
      gameId: game.id,
      userId: user2,
      playerOut: 'p1',
      playerIn: 'p6',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Game not found');

    // Verify original game lineup was not modified
    const originalGame = await mockGameRepository.findById(game.id, userId);
    expect(originalGame?.currentLineup).toEqual(startingPlayerIds);

    // Verify no substitution was saved
    expect(mockSubstitutionRepository.substitutions).toHaveLength(0);
  });

  test('should preserve game data when recording substitution', async () => {
    const result = await recordSubstitution.execute({
      gameId: game.id,
      userId,
      playerOut: 'p1',
      playerIn: 'p6',
    });

    expect(result.success).toBe(true);
    expect(result.game?.id).toBe(game.id);
    expect(result.game?.userId).toBe(userId);
    expect(result.game?.teamId).toBe(teamId);
    expect(result.game?.opponent).toBe('Eagles');
    expect(result.game?.status).toBe('in_progress');
    expect(result.game?.roster).toEqual(rosterPlayerIds);
    expect(result.game?.startingLineup).toEqual(startingPlayerIds);
  });

  test('should maintain lineup position when substituting', async () => {
    // Substitute player at position 2
    const result = await recordSubstitution.execute({
      gameId: game.id,
      userId,
      playerOut: 'p3', // Position 2 (0-indexed)
      playerIn: 'p6',
    });

    expect(result.success).toBe(true);
    expect(result.game?.currentLineup[2]).toBe('p6');
    expect(result.game?.currentLineup).toEqual(['p1', 'p2', 'p6', 'p4', 'p5']);
  });
});
