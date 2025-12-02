import { GetPlayerCareerStats } from '../../../../../src/application/use-cases/stats/GetPlayerCareerStats';
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

  async findByGameAndPlayer(gameId: string, playerId: string, userId: string): Promise<GameStats | null> {
    return this.stats.find((s) => s.gameId === gameId && s.playerId === playerId && s.userId === userId) || null;
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

  async getPlayerAggregateStats(playerId: string, userId: string): Promise<PlayerAggregateStats> {
    const playerStats = this.stats.filter((s) => s.playerId === playerId && s.userId === userId);

    if (playerStats.length === 0) {
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

    const totals = playerStats.reduce(
      (acc, stats) => ({
        points: acc.points + stats.getTotalPoints(),
        rebounds: acc.rebounds + stats.getTotalRebounds(),
        assists: acc.assists + stats.assists,
      }),
      {
        points: 0,
        rebounds: 0,
        assists: 0,
      }
    );

    return {
      playerId,
      gamesPlayed: playerStats.length,
      totalPoints: totals.points,
      totalRebounds: totals.rebounds,
      totalAssists: totals.assists,
      totalSteals: 0,
      totalBlocks: 0,
      totalTurnovers: 0,
      averagePoints: Math.round((totals.points / playerStats.length) * 10) / 10,
      averageRebounds: Math.round((totals.rebounds / playerStats.length) * 10) / 10,
      averageAssists: Math.round((totals.assists / playerStats.length) * 10) / 10,
      fieldGoalPercentage: 0,
      freeThrowPercentage: 0,
      threePointPercentage: 0,
    };
  }
}

describe('GetPlayerCareerStats Use Case', () => {
  let mockRepository: MockGameStatsRepository;
  let getPlayerCareerStats: GetPlayerCareerStats;
  const userId = 'user-123';

  beforeEach(async () => {
    mockRepository = new MockGameStatsRepository();
    getPlayerCareerStats = new GetPlayerCareerStats(mockRepository);

    // Game 1
    const game1Stats = new GameStats({
      userId,
      gameId: 'game-1',
      playerId: 'player-123',
    });
    game1Stats.recordTwoPoint(true);
    game1Stats.recordThreePoint(true);
    game1Stats.recordAssist();
    await mockRepository.save(game1Stats);

    // Game 2
    const game2Stats = new GameStats({
      userId,
      gameId: 'game-2',
      playerId: 'player-123',
    });
    game2Stats.recordTwoPoint(true);
    game2Stats.recordTwoPoint(true);
    game2Stats.recordAssist();
    game2Stats.recordAssist();
    await mockRepository.save(game2Stats);
  });

  test('should get career stats for player', async () => {
    const result = await getPlayerCareerStats.execute('player-123', userId);

    expect(result.success).toBe(true);
    expect(result.stats?.playerId).toBe('player-123');
    expect(result.stats?.gamesPlayed).toBe(2);
    expect(result.stats?.totalPoints).toBe(9); // 5 + 4
    expect(result.stats?.totalAssists).toBe(3); // 1 + 2
    expect(result.stats?.averagePoints).toBe(4.5);
    expect(result.stats?.averageAssists).toBe(1.5);
  });

  test('should return zero stats for player with no games', async () => {
    const result = await getPlayerCareerStats.execute('player-no-games', userId);

    expect(result.success).toBe(true);
    expect(result.stats?.gamesPlayed).toBe(0);
    expect(result.stats?.totalPoints).toBe(0);
  });

  test('should only return stats for specified user', async () => {
    // Add stats for a different user
    const otherUserStats = new GameStats({
      userId: 'user-456',
      gameId: 'game-3',
      playerId: 'player-123',
    });
    otherUserStats.recordThreePoint(true);
    otherUserStats.recordThreePoint(true);
    await mockRepository.save(otherUserStats);

    const result = await getPlayerCareerStats.execute('player-123', userId);

    // Should only include the 2 games from user-123, not the one from user-456
    expect(result.success).toBe(true);
    expect(result.stats?.gamesPlayed).toBe(2);
    expect(result.stats?.totalPoints).toBe(9); // Still 9, not 15
  });

  test('should not return stats from different user', async () => {
    const result = await getPlayerCareerStats.execute('player-123', 'different-user-id');

    expect(result.success).toBe(true);
    expect(result.stats?.gamesPlayed).toBe(0);
    expect(result.stats?.totalPoints).toBe(0);
  });
});
