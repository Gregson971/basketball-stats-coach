import { UndoLastGameAction } from '../../../../../src/application/use-cases/stats/UndoLastGameAction';
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

  async findByPlayerId(_playerId: string): Promise<GameStats[]> {
    return [];
  }

  async findByGameAndPlayer(gameId: string, playerId: string): Promise<GameStats | null> {
    return this.stats.find((s) => s.gameId === gameId && s.playerId === playerId) || null;
  }

  async save(gameStats: GameStats): Promise<GameStats> {
    const existingIndex = this.stats.findIndex(
      (s) => s.gameId === gameStats.gameId && s.playerId === gameStats.playerId
    );
    if (existingIndex >= 0) {
      this.stats[existingIndex] = gameStats;
    } else {
      this.stats.push(gameStats);
    }
    return gameStats;
  }

  async delete(_id: string): Promise<boolean> {
    return false;
  }

  async getPlayerAggregateStats(_playerId: string): Promise<PlayerAggregateStats> {
    return {
      playerId: _playerId,
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

describe('UndoLastGameAction Use Case', () => {
  let mockRepository: MockGameStatsRepository;
  let undoLastGameAction: UndoLastGameAction;

  beforeEach(() => {
    mockRepository = new MockGameStatsRepository();
    undoLastGameAction = new UndoLastGameAction(mockRepository);
  });

  test('should undo last action successfully', async () => {
    const gameStats = new GameStats({
      gameId: 'game-1',
      playerId: 'player-1',
    });
    gameStats.recordTwoPoint(true);
    gameStats.recordAssist();
    await mockRepository.save(gameStats);

    const result = await undoLastGameAction.execute('game-1', 'player-1');

    expect(result.success).toBe(true);
    expect(result.gameStats?.assists).toBe(0); // Assist was undone
    expect(result.gameStats?.twoPointsMade).toBe(1); // Two-point still there
  });

  test('should undo multiple actions in sequence', async () => {
    const gameStats = new GameStats({
      gameId: 'game-2',
      playerId: 'player-2',
    });
    gameStats.recordTwoPoint(true);
    gameStats.recordThreePoint(true);
    gameStats.recordAssist();
    await mockRepository.save(gameStats);

    // Undo assist
    let result = await undoLastGameAction.execute('game-2', 'player-2');
    expect(result.success).toBe(true);
    expect(result.gameStats?.assists).toBe(0);

    // Undo three-point
    result = await undoLastGameAction.execute('game-2', 'player-2');
    expect(result.success).toBe(true);
    expect(result.gameStats?.threePointsMade).toBe(0);
    expect(result.gameStats?.twoPointsMade).toBe(1);
  });

  test('should undo shooting actions correctly', async () => {
    const gameStats = new GameStats({
      gameId: 'game-3',
      playerId: 'player-3',
    });
    gameStats.recordTwoPoint(true);
    gameStats.recordTwoPoint(false); // Missed shot
    await mockRepository.save(gameStats);

    // Undo missed shot
    let result = await undoLastGameAction.execute('game-3', 'player-3');
    expect(result.success).toBe(true);
    expect(result.gameStats?.twoPointsAttempted).toBe(1);
    expect(result.gameStats?.twoPointsMade).toBe(1);

    // Undo made shot
    result = await undoLastGameAction.execute('game-3', 'player-3');
    expect(result.success).toBe(true);
    expect(result.gameStats?.twoPointsAttempted).toBe(0);
    expect(result.gameStats?.twoPointsMade).toBe(0);
  });

  test('should return error when game stats not found', async () => {
    const result = await undoLastGameAction.execute('non-existent-game', 'non-existent-player');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Game stats not found');
  });

  test('should return error when no actions to undo', async () => {
    const gameStats = new GameStats({
      gameId: 'game-4',
      playerId: 'player-4',
    });
    await mockRepository.save(gameStats);

    const result = await undoLastGameAction.execute('game-4', 'player-4');

    expect(result.success).toBe(false);
    expect(result.error).toContain('No actions to undo');
  });

  test('should persist changes to repository', async () => {
    const gameStats = new GameStats({
      gameId: 'game-5',
      playerId: 'player-5',
    });
    gameStats.recordTwoPoint(true);
    gameStats.recordAssist();
    await mockRepository.save(gameStats);

    await undoLastGameAction.execute('game-5', 'player-5');

    const updatedStats = await mockRepository.findByGameAndPlayer('game-5', 'player-5');
    expect(updatedStats?.assists).toBe(0);
  });
});
