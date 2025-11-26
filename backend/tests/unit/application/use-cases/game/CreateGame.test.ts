import { CreateGame } from '../../../../../src/application/use-cases/game/CreateGame';
import { Game, GameData, GameStatus } from '../../../../../src/domain/entities/Game';
import { IGameRepository } from '../../../../../src/domain/repositories/GameRepository';

class MockGameRepository implements IGameRepository {
  private games: Game[] = [];

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

describe('CreateGame Use Case', () => {
  let mockRepository: MockGameRepository;
  let createGame: CreateGame;

  beforeEach(() => {
    mockRepository = new MockGameRepository();
    createGame = new CreateGame(mockRepository);
  });

  test('should create a game with required fields only', async () => {
    const gameData: GameData = {
      teamId: 'team-123',
      opponent: 'Tigers'
    };

    const result = await createGame.execute(gameData);

    expect(result.success).toBe(true);
    expect(result.game?.teamId).toBe('team-123');
    expect(result.game?.opponent).toBe('Tigers');
    expect(result.game?.status).toBe('not_started');
    expect(result.game?.id).toBeDefined();
  });

  test('should create a game with all optional fields', async () => {
    const gameDate = new Date('2024-12-01');
    const gameData: GameData = {
      teamId: 'team-456',
      opponent: 'Panthers',
      gameDate,
      location: 'Main Arena',
      notes: 'Championship game'
    };

    const result = await createGame.execute(gameData);

    expect(result.success).toBe(true);
    expect(result.game?.teamId).toBe('team-456');
    expect(result.game?.opponent).toBe('Panthers');
    expect(result.game?.gameDate).toEqual(gameDate);
    expect(result.game?.location).toBe('Main Arena');
    expect(result.game?.notes).toBe('Championship game');
  });

  test('should return error when teamId is missing', async () => {
    const gameData: GameData = {
      teamId: '',
      opponent: 'Tigers'
    };

    const result = await createGame.execute(gameData);

    expect(result.success).toBe(false);
    expect(result.error).toContain('Team ID');
  });

  test('should return error when opponent is missing', async () => {
    const gameData: GameData = {
      teamId: 'team-123',
      opponent: ''
    };

    const result = await createGame.execute(gameData);

    expect(result.success).toBe(false);
    expect(result.error).toContain('Opponent');
  });

  test('should return error when opponent is only whitespace', async () => {
    const gameData: GameData = {
      teamId: 'team-123',
      opponent: '   '
    };

    const result = await createGame.execute(gameData);

    expect(result.success).toBe(false);
    expect(result.error).toContain('Opponent');
  });

  test('should save game to repository', async () => {
    const gameData: GameData = {
      teamId: 'team-789',
      opponent: 'Lions',
      location: 'Sports Complex'
    };

    await createGame.execute(gameData);

    const allGames = await mockRepository.findAll();
    expect(allGames.length).toBe(1);
    expect(allGames[0].opponent).toBe('Lions');
  });

  test('should set initial status to not_started', async () => {
    const gameData: GameData = {
      teamId: 'team-123',
      opponent: 'Eagles'
    };

    const result = await createGame.execute(gameData);

    expect(result.success).toBe(true);
    expect(result.game?.status).toBe('not_started');
    expect(result.game?.startedAt).toBeNull();
    expect(result.game?.completedAt).toBeNull();
  });
});
