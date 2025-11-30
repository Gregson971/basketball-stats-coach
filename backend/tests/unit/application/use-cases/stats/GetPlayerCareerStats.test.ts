import { GetPlayerCareerStats } from '../../../../../src/application/use-cases/stats/GetPlayerCareerStats';
import { GameStats } from '../../../../../src/domain/entities/GameStats';
import {
  IGameStatsRepository,
  PlayerAggregateStats,
} from '../../../../../src/domain/repositories/GameStatsRepository';

class MockGameStatsRepository implements IGameStatsRepository {
  private stats: GameStats[] = [];

  async findById(_id: string): Promise<GameStats | null> {
    return null;
  }

  async findByGameId(_gameId: string): Promise<GameStats[]> {
    return [];
  }

  async findByPlayerId(playerId: string): Promise<GameStats[]> {
    return this.stats.filter((s) => s.playerId === playerId);
  }

  async findByGameAndPlayer(_gameId: string, _playerId: string): Promise<GameStats | null> {
    return null;
  }

  async save(gameStats: GameStats): Promise<GameStats> {
    this.stats.push(gameStats);
    return gameStats;
  }

  async delete(_id: string): Promise<boolean> {
    return false;
  }

  async getPlayerAggregateStats(playerId: string): Promise<PlayerAggregateStats> {
    const playerStats = this.stats.filter((s) => s.playerId === playerId);

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

  beforeEach(async () => {
    mockRepository = new MockGameStatsRepository();
    getPlayerCareerStats = new GetPlayerCareerStats(mockRepository);

    // Game 1
    const game1Stats = new GameStats({
      gameId: 'game-1',
      playerId: 'player-123',
    });
    game1Stats.recordTwoPoint(true);
    game1Stats.recordThreePoint(true);
    game1Stats.recordAssist();
    await mockRepository.save(game1Stats);

    // Game 2
    const game2Stats = new GameStats({
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
    const result = await getPlayerCareerStats.execute('player-123');

    expect(result.success).toBe(true);
    expect(result.stats?.playerId).toBe('player-123');
    expect(result.stats?.gamesPlayed).toBe(2);
    expect(result.stats?.totalPoints).toBe(9); // 5 + 4
    expect(result.stats?.totalAssists).toBe(3); // 1 + 2
    expect(result.stats?.averagePoints).toBe(4.5);
    expect(result.stats?.averageAssists).toBe(1.5);
  });

  test('should return zero stats for player with no games', async () => {
    const result = await getPlayerCareerStats.execute('player-no-games');

    expect(result.success).toBe(true);
    expect(result.stats?.gamesPlayed).toBe(0);
    expect(result.stats?.totalPoints).toBe(0);
  });
});
