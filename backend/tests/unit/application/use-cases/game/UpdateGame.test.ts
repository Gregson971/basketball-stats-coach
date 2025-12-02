import { UpdateGame } from '../../../../../src/application/use-cases/game/UpdateGame';
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

describe('UpdateGame Use Case', () => {
  let mockRepository: MockGameRepository;
  let updateGame: UpdateGame;
  let game: Game;
  const userId = 'user-123';

  beforeEach(() => {
    mockRepository = new MockGameRepository();
    updateGame = new UpdateGame(mockRepository);

    game = new Game({
      userId,
      teamId: 'team-123',
      opponent: 'Tigers',
      location: 'Main Arena',
    });
    mockRepository.games.push(game);
  });

  test('should update game opponent', async () => {
    const result = await updateGame.execute(game.id, userId, { opponent: 'Panthers' });

    expect(result.success).toBe(true);
    expect(result.game?.opponent).toBe('Panthers');
    expect(result.game?.userId).toBe(userId);
  });

  test('should update game location', async () => {
    const result = await updateGame.execute(game.id, userId, { location: 'Sports Complex' });

    expect(result.success).toBe(true);
    expect(result.game?.location).toBe('Sports Complex');
  });

  test('should update game notes', async () => {
    const result = await updateGame.execute(game.id, userId, { notes: 'Championship game' });

    expect(result.success).toBe(true);
    expect(result.game?.notes).toBe('Championship game');
  });

  test('should update game date', async () => {
    const newDate = new Date('2024-12-25');
    const result = await updateGame.execute(game.id, userId, { gameDate: newDate });

    expect(result.success).toBe(true);
    expect(result.game?.gameDate).toEqual(newDate);
  });

  test('should update multiple fields at once', async () => {
    const result = await updateGame.execute(game.id, userId, {
      opponent: 'Lions',
      location: 'Arena 2',
      notes: 'Final game',
    });

    expect(result.success).toBe(true);
    expect(result.game?.opponent).toBe('Lions');
    expect(result.game?.location).toBe('Arena 2');
    expect(result.game?.notes).toBe('Final game');
  });

  test('should return error when game not found', async () => {
    const result = await updateGame.execute('non-existent-id', userId, { opponent: 'New Team' });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Game not found');
  });

  test('should return error when trying to set empty opponent', async () => {
    const result = await updateGame.execute(game.id, userId, { opponent: '' });

    expect(result.success).toBe(false);
    expect(result.error).toContain('Opponent');
  });

  test('should not allow updating immutable fields', async () => {
    const updateData: any = { id: 'new-id', teamId: 'new-team' };
    const result = await updateGame.execute(game.id, userId, updateData);

    expect(result.success).toBe(true);
    expect(result.game?.id).toBe(game.id); // ID unchanged
    expect(result.game?.teamId).toBe('team-123'); // teamId unchanged
  });

  test('should not update game from different user', async () => {
    const result = await updateGame.execute(game.id, 'different-user-id', { opponent: 'New Team' });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Game not found');
  });
});
