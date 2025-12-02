import { RecordGameAction } from '../../../../../src/application/use-cases/stats/RecordGameAction';
import { GameStats } from '../../../../../src/domain/entities/GameStats';
import { Game } from '../../../../../src/domain/entities/Game';
import {
  IGameStatsRepository,
  PlayerAggregateStats,
} from '../../../../../src/domain/repositories/GameStatsRepository';
import { IGameRepository } from '../../../../../src/domain/repositories/GameRepository';
import { GameStatus } from '../../../../../src/domain/entities/Game';

// Mock repositories
class MockGameStatsRepository implements IGameStatsRepository {
  private stats: GameStats[] = [];

  async findByGameAndPlayer(
    gameId: string,
    playerId: string,
    userId: string
  ): Promise<GameStats | null> {
    return (
      this.stats.find(
        (s) => s.gameId === gameId && s.playerId === playerId && s.userId === userId
      ) || null
    );
  }

  async save(gameStats: GameStats): Promise<GameStats> {
    const existingIndex = this.stats.findIndex((s) => s.id === gameStats.id);
    if (existingIndex >= 0) {
      this.stats[existingIndex] = gameStats;
    } else {
      this.stats.push(gameStats);
    }
    return gameStats;
  }

  async findById(id: string, userId: string): Promise<GameStats | null> {
    return this.stats.find((s) => s.id === id && s.userId === userId) || null;
  }

  async findByGameId(gameId: string, userId: string): Promise<GameStats[]> {
    return this.stats.filter((s) => s.gameId === gameId && s.userId === userId);
  }

  async findByPlayerId(playerId: string, userId: string): Promise<GameStats[]> {
    return this.stats.filter((s) => s.playerId === playerId && s.userId === userId);
  }

  async findByUserId(userId: string): Promise<GameStats[]> {
    return this.stats.filter((s) => s.userId === userId);
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const index = this.stats.findIndex((s) => s.id === id && s.userId === userId);
    if (index >= 0) {
      this.stats.splice(index, 1);
      return true;
    }
    return false;
  }

  async deleteByUserId(userId: string): Promise<number> {
    const initialLength = this.stats.length;
    this.stats = this.stats.filter((s) => s.userId !== userId);
    return initialLength - this.stats.length;
  }

  async getPlayerAggregateStats(playerId: string, userId: string): Promise<PlayerAggregateStats> {
    const playerStats = this.stats.filter((s) => s.playerId === playerId && s.userId === userId);

    return {
      playerId,
      gamesPlayed: playerStats.length,
      totalPoints: playerStats.reduce((sum, s) => sum + s.getTotalPoints(), 0),
      totalRebounds: playerStats.reduce((sum, s) => sum + s.getTotalRebounds(), 0),
      totalAssists: playerStats.reduce((sum, s) => sum + s.assists, 0),
      totalSteals: playerStats.reduce((sum, s) => sum + s.steals, 0),
      totalBlocks: playerStats.reduce((sum, s) => sum + s.blocks, 0),
      totalTurnovers: playerStats.reduce((sum, s) => sum + s.turnovers, 0),
      averagePoints: 0,
      averageRebounds: 0,
      averageAssists: 0,
      fieldGoalPercentage: 0,
      freeThrowPercentage: 0,
      threePointPercentage: 0,
    };
  }
}

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

describe('RecordGameAction Use Case', () => {
  let mockStatsRepository: MockGameStatsRepository;
  let mockGameRepository: MockGameRepository;
  let recordGameAction: RecordGameAction;
  let game: Game;
  const userId = 'user-123';

  beforeEach(() => {
    mockStatsRepository = new MockGameStatsRepository();
    mockGameRepository = new MockGameRepository();
    recordGameAction = new RecordGameAction(mockStatsRepository, mockGameRepository);

    // Create and start a game
    game = new Game({
      userId,
      teamId: 'team-123',
      opponent: 'Tigers',
    });
    game.start();
    mockGameRepository.games.push(game);
  });

  test('should record a made 2-point shot', async () => {
    const actionData = {
      gameId: game.id,
      playerId: 'player-123',
      userId,
      actionType: 'twoPoint' as const,
      made: true,
    };

    const result = await recordGameAction.execute(actionData);

    expect(result.success).toBe(true);
    expect(result.gameStats?.userId).toBe(userId);
    expect(result.gameStats?.twoPointsMade).toBe(1);
    expect(result.gameStats?.twoPointsAttempted).toBe(1);
    expect(result.gameStats?.getTotalPoints()).toBe(2);
  });

  test('should record a missed 3-point shot', async () => {
    const actionData = {
      gameId: game.id,
      playerId: 'player-123',
      userId,
      actionType: 'threePoint' as const,
      made: false,
    };

    const result = await recordGameAction.execute(actionData);

    expect(result.success).toBe(true);
    expect(result.gameStats?.threePointsMade).toBe(0);
    expect(result.gameStats?.threePointsAttempted).toBe(1);
  });

  test('should record an assist', async () => {
    const actionData = {
      gameId: game.id,
      playerId: 'player-123',
      userId,
      actionType: 'assist' as const,
    };

    const result = await recordGameAction.execute(actionData);

    expect(result.success).toBe(true);
    expect(result.gameStats?.assists).toBe(1);
  });

  test('should record multiple actions for same player in same game', async () => {
    const player = 'player-123';

    await recordGameAction.execute({
      gameId: game.id,
      playerId: player,
      userId,
      actionType: 'twoPoint',
      made: true,
    });

    await recordGameAction.execute({
      gameId: game.id,
      playerId: player,
      userId,
      actionType: 'assist',
    });

    await recordGameAction.execute({
      gameId: game.id,
      playerId: player,
      userId,
      actionType: 'offensiveRebound',
    });

    const stats = await mockStatsRepository.findByGameAndPlayer(game.id, player, userId);
    expect(stats?.twoPointsMade).toBe(1);
    expect(stats?.assists).toBe(1);
    expect(stats?.offensiveRebounds).toBe(1);
    expect(stats?.getTotalPoints()).toBe(2);
  });

  test('should create new stats if none exist for player and game', async () => {
    const actionData = {
      gameId: game.id,
      playerId: 'player-new',
      userId,
      actionType: 'steal' as const,
    };

    const result = await recordGameAction.execute(actionData);

    expect(result.success).toBe(true);
    expect(result.gameStats).toBeInstanceOf(GameStats);
    expect(result.gameStats?.steals).toBe(1);
  });

  test('should return error if game not found', async () => {
    const actionData = {
      gameId: 'non-existent-game',
      playerId: 'player-123',
      userId,
      actionType: 'assist' as const,
    };

    const result = await recordGameAction.execute(actionData);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Game not found');
  });

  test('should return error if game is not in progress', async () => {
    const notStartedGame = new Game({
      userId,
      teamId: 'team-123',
      opponent: 'Lions',
    });
    mockGameRepository.games.push(notStartedGame);

    const actionData = {
      gameId: notStartedGame.id,
      playerId: 'player-123',
      userId,
      actionType: 'assist' as const,
    };

    const result = await recordGameAction.execute(actionData);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Game is not in progress');
  });

  test('should return error for invalid action type', async () => {
    const actionData = {
      gameId: game.id,
      playerId: 'player-123',
      userId,
      actionType: 'invalidAction' as any,
    };

    const result = await recordGameAction.execute(actionData);

    expect(result.success).toBe(false);
    expect(result.error).toContain('Invalid action type');
  });

  test('should handle all action types correctly', async () => {
    const player = 'player-123';
    const actions = [
      { type: 'freeThrow' as const, made: true },
      { type: 'twoPoint' as const, made: true },
      { type: 'threePoint' as const, made: true },
      { type: 'offensiveRebound' as const },
      { type: 'defensiveRebound' as const },
      { type: 'assist' as const },
      { type: 'steal' as const },
      { type: 'block' as const },
      { type: 'turnover' as const },
      { type: 'personalFoul' as const },
    ];

    for (const action of actions) {
      await recordGameAction.execute({
        gameId: game.id,
        playerId: player,
        userId,
        actionType: action.type,
        made: 'made' in action ? action.made : undefined,
      });
    }

    const stats = await mockStatsRepository.findByGameAndPlayer(game.id, player, userId);
    expect(stats?.freeThrowsMade).toBe(1);
    expect(stats?.twoPointsMade).toBe(1);
    expect(stats?.threePointsMade).toBe(1);
    expect(stats?.offensiveRebounds).toBe(1);
    expect(stats?.defensiveRebounds).toBe(1);
    expect(stats?.assists).toBe(1);
    expect(stats?.steals).toBe(1);
    expect(stats?.blocks).toBe(1);
    expect(stats?.turnovers).toBe(1);
    expect(stats?.personalFouls).toBe(1);
    expect(stats?.getTotalPoints()).toBe(6); // 1 + 2 + 3
  });

  test('should isolate data by userId - users cannot access other users data', async () => {
    const user2 = 'user-456';
    const player = 'player-123';

    // User 1 creates a game and records an action
    await recordGameAction.execute({
      gameId: game.id,
      playerId: player,
      userId,
      actionType: 'twoPoint',
      made: true,
    });

    // User 2 tries to record action on User 1's game - should fail
    const result = await recordGameAction.execute({
      gameId: game.id,
      playerId: player,
      userId: user2,
      actionType: 'assist',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Game not found');

    // Verify User 1's stats exist
    const user1Stats = await mockStatsRepository.findByGameAndPlayer(game.id, player, userId);
    expect(user1Stats?.twoPointsMade).toBe(1);

    // Verify User 2 cannot see User 1's stats
    const user2Stats = await mockStatsRepository.findByGameAndPlayer(game.id, player, user2);
    expect(user2Stats).toBeNull();
  });
});
