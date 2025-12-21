import { UndoLastGameAction } from '../../../../../src/application/use-cases/stats/UndoLastGameAction';
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
    const existingIndex = this.stats.findIndex(
      (s) =>
        s.gameId === gameStats.gameId &&
        s.playerId === gameStats.playerId &&
        s.userId === gameStats.userId
    );
    if (existingIndex >= 0) {
      this.stats[existingIndex] = gameStats;
    } else {
      this.stats.push(gameStats);
    }
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

describe('UndoLastGameAction Use Case', () => {
  let mockRepository: MockGameStatsRepository;
  let undoLastGameAction: UndoLastGameAction;
  const userId = 'user-123';

  beforeEach(() => {
    mockRepository = new MockGameStatsRepository();
    undoLastGameAction = new UndoLastGameAction(mockRepository);
  });

  test('should undo last action successfully', async () => {
    const gameStats = new GameStats({
      userId,
      gameId: 'game-1',
      playerId: 'player-1',
    });
    gameStats.recordTwoPoint(true);
    gameStats.recordAssist();
    await mockRepository.save(gameStats);

    const result = await undoLastGameAction.execute('game-1', 'player-1', userId);

    expect(result.success).toBe(true);
    expect(result.gameStats?.assists).toBe(0); // Assist was undone
    expect(result.gameStats?.twoPointsMade).toBe(1); // Two-point still there
    expect(result.gameStats?.userId).toBe(userId);
  });

  test('should undo multiple actions in sequence', async () => {
    const gameStats = new GameStats({
      userId,
      gameId: 'game-2',
      playerId: 'player-2',
    });
    gameStats.recordTwoPoint(true);
    gameStats.recordThreePoint(true);
    gameStats.recordAssist();
    await mockRepository.save(gameStats);

    // Undo assist
    let result = await undoLastGameAction.execute('game-2', 'player-2', userId);
    expect(result.success).toBe(true);
    expect(result.gameStats?.assists).toBe(0);

    // Undo three-point
    result = await undoLastGameAction.execute('game-2', 'player-2', userId);
    expect(result.success).toBe(true);
    expect(result.gameStats?.threePointsMade).toBe(0);
    expect(result.gameStats?.twoPointsMade).toBe(1);
  });

  test('should undo shooting actions correctly', async () => {
    const gameStats = new GameStats({
      userId,
      gameId: 'game-3',
      playerId: 'player-3',
    });
    gameStats.recordTwoPoint(true);
    gameStats.recordTwoPoint(false); // Missed shot
    await mockRepository.save(gameStats);

    // Undo missed shot
    let result = await undoLastGameAction.execute('game-3', 'player-3', userId);
    expect(result.success).toBe(true);
    expect(result.gameStats?.twoPointsAttempted).toBe(1);
    expect(result.gameStats?.twoPointsMade).toBe(1);

    // Undo made shot
    result = await undoLastGameAction.execute('game-3', 'player-3', userId);
    expect(result.success).toBe(true);
    expect(result.gameStats?.twoPointsAttempted).toBe(0);
    expect(result.gameStats?.twoPointsMade).toBe(0);
  });

  test('should return error when game stats not found', async () => {
    const result = await undoLastGameAction.execute(
      'non-existent-game',
      'non-existent-player',
      userId
    );

    expect(result.success).toBe(false);
    expect(result.error).toBe('Game stats not found');
  });

  test('should return error when no actions to undo', async () => {
    const gameStats = new GameStats({
      userId,
      gameId: 'game-4',
      playerId: 'player-4',
    });
    await mockRepository.save(gameStats);

    const result = await undoLastGameAction.execute('game-4', 'player-4', userId);

    expect(result.success).toBe(false);
    expect(result.error).toContain('No actions to undo');
  });

  test('should persist changes to repository', async () => {
    const gameStats = new GameStats({
      userId,
      gameId: 'game-5',
      playerId: 'player-5',
    });
    gameStats.recordTwoPoint(true);
    gameStats.recordAssist();
    await mockRepository.save(gameStats);

    await undoLastGameAction.execute('game-5', 'player-5', userId);

    const updatedStats = await mockRepository.findByGameAndPlayer('game-5', 'player-5', userId);
    expect(updatedStats?.assists).toBe(0);
  });

  test('should not access stats from different user', async () => {
    const gameStats = new GameStats({
      userId,
      gameId: 'game-6',
      playerId: 'player-6',
    });
    gameStats.recordTwoPoint(true);
    await mockRepository.save(gameStats);

    const result = await undoLastGameAction.execute('game-6', 'player-6', 'different-user-id');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Game stats not found');
  });
});
