import { GetPlayerGameStats } from '../../../../../src/application/use-cases/stats/GetPlayerGameStats';
import { GameStats } from '../../../../../src/domain/entities/GameStats';
import {
  IGameStatsRepository,
  PlayerAggregateStats,
} from '../../../../../src/domain/repositories/GameStatsRepository';

class MockGameStatsRepository implements IGameStatsRepository {
  private stats: GameStats[] = [];

  async findById(id: string, userId: string): Promise<GameStats | null> {
    return this.stats.find((s) => s.id === id && s.userId === userId) || null;
  }

  async findByGameId(gameId: string, userId: string): Promise<GameStats[]> {
    return this.stats.filter((s) => s.gameId === gameId && s.userId === userId);
  }

  async findByPlayerId(playerId: string, userId: string): Promise<GameStats[]> {
    return this.stats.filter((s) => s.playerId === playerId && s.userId === userId);
  }

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

  async findByUserId(userId: string): Promise<GameStats[]> {
    return this.stats.filter((s) => s.userId === userId);
  }

  async save(gameStats: GameStats): Promise<GameStats> {
    this.stats.push(gameStats);
    return gameStats;
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

  async getPlayerAggregateStats(playerId: string, _userId: string): Promise<PlayerAggregateStats> {
    return {
      playerId,
      gamesPlayed: 0,
      totalPoints: 0,
      totalRebounds: 0,
      totalAssists: 0,
      totalSteals: 0,
      totalBlocks: 0,
      totalTurnovers: 0,
      averagePoints: 0,
      averageRebounds: 0,
      averageAssists: 0,
      fieldGoalPercentage: 0,
      freeThrowPercentage: 0,
      threePointPercentage: 0,
    };
  }
}

describe('GetPlayerGameStats Use Case', () => {
  let mockRepository: MockGameStatsRepository;
  let getPlayerGameStats: GetPlayerGameStats;
  const userId = 'user-123';

  beforeEach(() => {
    mockRepository = new MockGameStatsRepository();
    getPlayerGameStats = new GetPlayerGameStats(mockRepository);
  });

  test('should get player game stats successfully', async () => {
    const gameStats = new GameStats({
      userId,
      gameId: 'game-1',
      playerId: 'player-1',
    });
    gameStats.recordTwoPoint(true);
    gameStats.recordThreePoint(true);
    gameStats.recordAssist();
    await mockRepository.save(gameStats);

    const result = await getPlayerGameStats.execute('game-1', 'player-1', userId);

    expect(result.success).toBe(true);
    expect(result.gameStats?.gameId).toBe('game-1');
    expect(result.gameStats?.playerId).toBe('player-1');
    expect(result.gameStats?.userId).toBe(userId);
    expect(result.gameStats?.twoPointsMade).toBe(1);
    expect(result.gameStats?.threePointsMade).toBe(1);
    expect(result.gameStats?.assists).toBe(1);
  });

  test('should return calculated stats', async () => {
    const gameStats = new GameStats({
      userId,
      gameId: 'game-2',
      playerId: 'player-2',
    });
    gameStats.recordTwoPoint(true);
    gameStats.recordThreePoint(true);
    gameStats.recordFreeThrow(true);
    await mockRepository.save(gameStats);

    const result = await getPlayerGameStats.execute('game-2', 'player-2', userId);

    expect(result.success).toBe(true);
    expect(result.gameStats?.getTotalPoints()).toBe(6); // 2 + 3 + 1
    expect(result.gameStats?.getFieldGoalPercentage()).toBe(100); // 2/2 made
  });

  test('should return stats with shooting percentages', async () => {
    const gameStats = new GameStats({
      userId,
      gameId: 'game-3',
      playerId: 'player-3',
    });
    gameStats.recordTwoPoint(true);
    gameStats.recordTwoPoint(false);
    gameStats.recordTwoPoint(true);
    await mockRepository.save(gameStats);

    const result = await getPlayerGameStats.execute('game-3', 'player-3', userId);

    expect(result.success).toBe(true);
    expect(result.gameStats?.twoPointsMade).toBe(2);
    expect(result.gameStats?.twoPointsAttempted).toBe(3);
    expect(result.gameStats?.getFieldGoalPercentage()).toBeCloseTo(66.67, 1);
  });

  test('should return stats with rebounds', async () => {
    const gameStats = new GameStats({
      userId,
      gameId: 'game-4',
      playerId: 'player-4',
    });
    gameStats.recordOffensiveRebound();
    gameStats.recordOffensiveRebound();
    gameStats.recordDefensiveRebound();
    await mockRepository.save(gameStats);

    const result = await getPlayerGameStats.execute('game-4', 'player-4', userId);

    expect(result.success).toBe(true);
    expect(result.gameStats?.offensiveRebounds).toBe(2);
    expect(result.gameStats?.defensiveRebounds).toBe(1);
    expect(result.gameStats?.getTotalRebounds()).toBe(3);
  });

  test('should return stats with defensive actions', async () => {
    const gameStats = new GameStats({
      userId,
      gameId: 'game-5',
      playerId: 'player-5',
    });
    gameStats.recordSteal();
    gameStats.recordSteal();
    gameStats.recordBlock();
    await mockRepository.save(gameStats);

    const result = await getPlayerGameStats.execute('game-5', 'player-5', userId);

    expect(result.success).toBe(true);
    expect(result.gameStats?.steals).toBe(2);
    expect(result.gameStats?.blocks).toBe(1);
  });

  test('should return stats with turnovers and fouls', async () => {
    const gameStats = new GameStats({
      userId,
      gameId: 'game-6',
      playerId: 'player-6',
    });
    gameStats.recordTurnover();
    gameStats.recordPersonalFoul();
    gameStats.recordPersonalFoul();
    await mockRepository.save(gameStats);

    const result = await getPlayerGameStats.execute('game-6', 'player-6', userId);

    expect(result.success).toBe(true);
    expect(result.gameStats?.turnovers).toBe(1);
    expect(result.gameStats?.personalFouls).toBe(2);
  });

  test('should return error when game stats not found', async () => {
    const result = await getPlayerGameStats.execute(
      'non-existent-game',
      'non-existent-player',
      userId
    );

    expect(result.success).toBe(false);
    expect(result.error).toBe('Game stats not found');
  });

  test('should return empty stats when no actions recorded', async () => {
    const gameStats = new GameStats({
      userId,
      gameId: 'game-7',
      playerId: 'player-7',
    });
    await mockRepository.save(gameStats);

    const result = await getPlayerGameStats.execute('game-7', 'player-7', userId);

    expect(result.success).toBe(true);
    expect(result.gameStats?.getTotalPoints()).toBe(0);
    expect(result.gameStats?.assists).toBe(0);
    expect(result.gameStats?.getTotalRebounds()).toBe(0);
  });

  test('should not return stats from different user', async () => {
    const gameStats = new GameStats({
      userId,
      gameId: 'game-8',
      playerId: 'player-8',
    });
    gameStats.recordTwoPoint(true);
    await mockRepository.save(gameStats);

    const result = await getPlayerGameStats.execute('game-8', 'player-8', 'different-user-id');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Game stats not found');
  });
});
