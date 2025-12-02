import { CreateGame } from '../../../../../src/application/use-cases/game/CreateGame';
import { Game, GameData, GameStatus } from '../../../../../src/domain/entities/Game';
import { IGameRepository } from '../../../../../src/domain/repositories/GameRepository';

class MockGameRepository implements IGameRepository {
  private games: Game[] = [];

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

describe('CreateGame Use Case', () => {
  let mockRepository: MockGameRepository;
  let createGame: CreateGame;

  beforeEach(() => {
    mockRepository = new MockGameRepository();
    createGame = new CreateGame(mockRepository);
  });

  test('should create a game with required fields only', async () => {
    const gameData: GameData = {
      userId: 'user-123',
      teamId: 'team-123',
      opponent: 'Tigers',
    };

    const result = await createGame.execute(gameData);

    expect(result.success).toBe(true);
    expect(result.game?.userId).toBe('user-123');
    expect(result.game?.teamId).toBe('team-123');
    expect(result.game?.opponent).toBe('Tigers');
    expect(result.game?.status).toBe('not_started');
    expect(result.game?.id).toBeDefined();
  });

  test('should create a game with all optional fields', async () => {
    const gameDate = new Date('2024-12-01');
    const gameData: GameData = {
      userId: 'user-123',
      teamId: 'team-456',
      opponent: 'Panthers',
      gameDate,
      location: 'Main Arena',
      notes: 'Championship game',
    };

    const result = await createGame.execute(gameData);

    expect(result.success).toBe(true);
    expect(result.game?.userId).toBe('user-123');
    expect(result.game?.teamId).toBe('team-456');
    expect(result.game?.opponent).toBe('Panthers');
    expect(result.game?.gameDate).toEqual(gameDate);
    expect(result.game?.location).toBe('Main Arena');
    expect(result.game?.notes).toBe('Championship game');
  });

  test('should return error when userId is missing', async () => {
    const gameData: GameData = {
      userId: '',
      teamId: 'team-123',
      opponent: 'Tigers',
    };

    const result = await createGame.execute(gameData);

    expect(result.success).toBe(false);
    expect(result.error).toContain('User ID');
  });

  test('should return error when teamId is missing', async () => {
    const gameData: GameData = {
      userId: 'user-123',
      teamId: '',
      opponent: 'Tigers',
    };

    const result = await createGame.execute(gameData);

    expect(result.success).toBe(false);
    expect(result.error).toContain('Team ID');
  });

  test('should return error when opponent is missing', async () => {
    const gameData: GameData = {
      userId: 'user-123',
      teamId: 'team-123',
      opponent: '',
    };

    const result = await createGame.execute(gameData);

    expect(result.success).toBe(false);
    expect(result.error).toContain('Opponent');
  });

  test('should return error when opponent is only whitespace', async () => {
    const gameData: GameData = {
      userId: 'user-123',
      teamId: 'team-123',
      opponent: '   ',
    };

    const result = await createGame.execute(gameData);

    expect(result.success).toBe(false);
    expect(result.error).toContain('Opponent');
  });

  test('should save game to repository', async () => {
    const gameData: GameData = {
      userId: 'user-123',
      teamId: 'team-789',
      opponent: 'Lions',
      location: 'Sports Complex',
    };

    await createGame.execute(gameData);

    const allGames = await mockRepository.findAll('user-123');
    expect(allGames.length).toBe(1);
    expect(allGames[0].opponent).toBe('Lions');
    expect(allGames[0].userId).toBe('user-123');
  });

  test('should set initial status to not_started', async () => {
    const gameData: GameData = {
      userId: 'user-123',
      teamId: 'team-123',
      opponent: 'Eagles',
    };

    const result = await createGame.execute(gameData);

    expect(result.success).toBe(true);
    expect(result.game?.status).toBe('not_started');
    expect(result.game?.startedAt).toBeNull();
    expect(result.game?.completedAt).toBeNull();
  });

  test('should isolate games by userId', async () => {
    const user1GameData: GameData = {
      userId: 'user-1',
      teamId: 'team-123',
      opponent: 'Tigers',
    };
    const user2GameData: GameData = {
      userId: 'user-2',
      teamId: 'team-123',
      opponent: 'Panthers',
    };

    await createGame.execute(user1GameData);
    await createGame.execute(user2GameData);

    const user1Games = await mockRepository.findAll('user-1');
    const user2Games = await mockRepository.findAll('user-2');

    expect(user1Games.length).toBe(1);
    expect(user1Games[0].opponent).toBe('Tigers');
    expect(user2Games.length).toBe(1);
    expect(user2Games[0].opponent).toBe('Panthers');
  });
});
