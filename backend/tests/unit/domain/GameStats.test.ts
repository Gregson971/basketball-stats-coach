import { GameStats, GameStatsData } from '../../../src/domain/entities/GameStats';

describe('GameStats Entity', () => {
  describe('Creation', () => {
    test('should create valid game stats with required fields', () => {
      const statsData: GameStatsData = {
        userId: 'user-123',
        gameId: 'game-123',
        playerId: 'player-456',
      };

      const stats = new GameStats(statsData);

      expect(stats.id).toBeDefined();
      expect(stats.userId).toBe('user-123');
      expect(stats.gameId).toBe('game-123');
      expect(stats.playerId).toBe('player-456');
      expect(stats.createdAt).toBeInstanceOf(Date);
      expect(stats.updatedAt).toBeInstanceOf(Date);
    });

    test('should initialize all stats to zero', () => {
      const stats = new GameStats({
        userId: 'user-123',
        gameId: 'game-123',
        playerId: 'player-456',
      });

      expect(stats.freeThrowsMade).toBe(0);
      expect(stats.freeThrowsAttempted).toBe(0);
      expect(stats.twoPointsMade).toBe(0);
      expect(stats.twoPointsAttempted).toBe(0);
      expect(stats.threePointsMade).toBe(0);
      expect(stats.threePointsAttempted).toBe(0);
      expect(stats.offensiveRebounds).toBe(0);
      expect(stats.defensiveRebounds).toBe(0);
      expect(stats.assists).toBe(0);
      expect(stats.steals).toBe(0);
      expect(stats.blocks).toBe(0);
      expect(stats.turnovers).toBe(0);
      expect(stats.personalFouls).toBe(0);
      expect(stats.minutesPlayed).toBe(0);
    });

    test('should throw error if userId is missing', () => {
      const statsData = {
        gameId: 'game-123',
        playerId: 'player-456',
      } as GameStatsData;

      expect(() => new GameStats(statsData)).toThrow('User ID is required');
    });

    test('should throw error if gameId is missing', () => {
      const statsData = {
        userId: 'user-123',
        playerId: 'player-456',
      } as GameStatsData;

      expect(() => new GameStats(statsData)).toThrow('Game ID is required');
    });

    test('should throw error if playerId is missing', () => {
      const statsData = {
        userId: 'user-123',
        gameId: 'game-123',
      } as GameStatsData;

      expect(() => new GameStats(statsData)).toThrow('Player ID is required');
    });
  });

  describe('Recording Stats', () => {
    test('should record made free throw', () => {
      const stats = new GameStats({
        userId: 'user-123',
        gameId: 'game-123',
        playerId: 'player-456',
      });

      stats.recordFreeThrow(true);

      expect(stats.freeThrowsMade).toBe(1);
      expect(stats.freeThrowsAttempted).toBe(1);
    });

    test('should record missed free throw', () => {
      const stats = new GameStats({
        userId: 'user-123',
        gameId: 'game-123',
        playerId: 'player-456',
      });

      stats.recordFreeThrow(false);

      expect(stats.freeThrowsMade).toBe(0);
      expect(stats.freeThrowsAttempted).toBe(1);
    });

    test('should record made 2-point shot', () => {
      const stats = new GameStats({
        userId: 'user-123',
        gameId: 'game-123',
        playerId: 'player-456',
      });

      stats.recordTwoPoint(true);

      expect(stats.twoPointsMade).toBe(1);
      expect(stats.twoPointsAttempted).toBe(1);
    });

    test('should record missed 2-point shot', () => {
      const stats = new GameStats({
        userId: 'user-123',
        gameId: 'game-123',
        playerId: 'player-456',
      });

      stats.recordTwoPoint(false);

      expect(stats.twoPointsMade).toBe(0);
      expect(stats.twoPointsAttempted).toBe(1);
    });

    test('should record made 3-point shot', () => {
      const stats = new GameStats({
        userId: 'user-123',
        gameId: 'game-123',
        playerId: 'player-456',
      });

      stats.recordThreePoint(true);

      expect(stats.threePointsMade).toBe(1);
      expect(stats.threePointsAttempted).toBe(1);
    });

    test('should record missed 3-point shot', () => {
      const stats = new GameStats({
        userId: 'user-123',
        gameId: 'game-123',
        playerId: 'player-456',
      });

      stats.recordThreePoint(false);

      expect(stats.threePointsMade).toBe(0);
      expect(stats.threePointsAttempted).toBe(1);
    });

    test('should record offensive rebound', () => {
      const stats = new GameStats({
        userId: 'user-123',
        gameId: 'game-123',
        playerId: 'player-456',
      });

      stats.recordOffensiveRebound();

      expect(stats.offensiveRebounds).toBe(1);
    });

    test('should record defensive rebound', () => {
      const stats = new GameStats({
        userId: 'user-123',
        gameId: 'game-123',
        playerId: 'player-456',
      });

      stats.recordDefensiveRebound();

      expect(stats.defensiveRebounds).toBe(1);
    });

    test('should record assist', () => {
      const stats = new GameStats({
        userId: 'user-123',
        gameId: 'game-123',
        playerId: 'player-456',
      });

      stats.recordAssist();

      expect(stats.assists).toBe(1);
    });

    test('should record steal', () => {
      const stats = new GameStats({
        userId: 'user-123',
        gameId: 'game-123',
        playerId: 'player-456',
      });

      stats.recordSteal();

      expect(stats.steals).toBe(1);
    });

    test('should record block', () => {
      const stats = new GameStats({
        userId: 'user-123',
        gameId: 'game-123',
        playerId: 'player-456',
      });

      stats.recordBlock();

      expect(stats.blocks).toBe(1);
    });

    test('should record turnover', () => {
      const stats = new GameStats({
        userId: 'user-123',
        gameId: 'game-123',
        playerId: 'player-456',
      });

      stats.recordTurnover();

      expect(stats.turnovers).toBe(1);
    });

    test('should record personal foul', () => {
      const stats = new GameStats({
        userId: 'user-123',
        gameId: 'game-123',
        playerId: 'player-456',
      });

      stats.recordPersonalFoul();

      expect(stats.personalFouls).toBe(1);
    });

    test('should add minutes played', () => {
      const stats = new GameStats({
        userId: 'user-123',
        gameId: 'game-123',
        playerId: 'player-456',
      });

      stats.addMinutes(5);

      expect(stats.minutesPlayed).toBe(5);
    });
  });

  describe('Calculated Stats', () => {
    test('should calculate total points', () => {
      const stats = new GameStats({
        userId: 'user-123',
        gameId: 'game-123',
        playerId: 'player-456',
      });

      stats.recordFreeThrow(true);
      stats.recordTwoPoint(true);
      stats.recordTwoPoint(true);
      stats.recordThreePoint(true);

      expect(stats.getTotalPoints()).toBe(8); // 1 + 2 + 2 + 3
    });

    test('should calculate total rebounds', () => {
      const stats = new GameStats({
        userId: 'user-123',
        gameId: 'game-123',
        playerId: 'player-456',
      });

      stats.recordOffensiveRebound();
      stats.recordOffensiveRebound();
      stats.recordDefensiveRebound();
      stats.recordDefensiveRebound();
      stats.recordDefensiveRebound();

      expect(stats.getTotalRebounds()).toBe(5);
    });

    test('should calculate field goal percentage', () => {
      const stats = new GameStats({
        userId: 'user-123',
        gameId: 'game-123',
        playerId: 'player-456',
      });

      stats.recordTwoPoint(true);
      stats.recordTwoPoint(false);
      stats.recordThreePoint(true);
      stats.recordThreePoint(false);

      expect(stats.getFieldGoalPercentage()).toBe(50.0);
    });

    test('should return 0 for field goal percentage with no attempts', () => {
      const stats = new GameStats({
        userId: 'user-123',
        gameId: 'game-123',
        playerId: 'player-456',
      });

      expect(stats.getFieldGoalPercentage()).toBe(0);
    });

    test('should calculate free throw percentage', () => {
      const stats = new GameStats({
        userId: 'user-123',
        gameId: 'game-123',
        playerId: 'player-456',
      });

      stats.recordFreeThrow(true);
      stats.recordFreeThrow(true);
      stats.recordFreeThrow(false);
      stats.recordFreeThrow(false);

      expect(stats.getFreeThrowPercentage()).toBe(50.0);
    });

    test('should return 0 for free throw percentage with no attempts', () => {
      const stats = new GameStats({
        userId: 'user-123',
        gameId: 'game-123',
        playerId: 'player-456',
      });

      expect(stats.getFreeThrowPercentage()).toBe(0);
    });

    test('should calculate three point percentage', () => {
      const stats = new GameStats({
        userId: 'user-123',
        gameId: 'game-123',
        playerId: 'player-456',
      });

      stats.recordThreePoint(true);
      stats.recordThreePoint(true);
      stats.recordThreePoint(true);
      stats.recordThreePoint(false);

      expect(stats.getThreePointPercentage()).toBe(75.0);
    });

    test('should return 0 for three point percentage with no attempts', () => {
      const stats = new GameStats({
        userId: 'user-123',
        gameId: 'game-123',
        playerId: 'player-456',
      });

      expect(stats.getThreePointPercentage()).toBe(0);
    });
  });

  describe('Undo Last Action', () => {
    test('should undo last free throw made', () => {
      const stats = new GameStats({
        userId: 'user-123',
        gameId: 'game-123',
        playerId: 'player-456',
      });

      stats.recordFreeThrow(true);
      stats.undoLastAction();

      expect(stats.freeThrowsMade).toBe(0);
      expect(stats.freeThrowsAttempted).toBe(0);
    });

    test('should undo last assist', () => {
      const stats = new GameStats({
        userId: 'user-123',
        gameId: 'game-123',
        playerId: 'player-456',
      });

      stats.recordAssist();
      stats.undoLastAction();

      expect(stats.assists).toBe(0);
    });

    test('should not undo when no actions recorded', () => {
      const stats = new GameStats({
        userId: 'user-123',
        gameId: 'game-123',
        playerId: 'player-456',
      });

      expect(() => stats.undoLastAction()).toThrow('No actions to undo');
    });
  });

  describe('Methods', () => {
    test('should convert to JSON', () => {
      const stats = new GameStats({
        userId: 'user-123',
        gameId: 'game-123',
        playerId: 'player-456',
      });

      stats.recordTwoPoint(true);
      stats.recordAssist();

      const json = stats.toJSON();

      expect(json).toHaveProperty('id');
      expect(json).toHaveProperty('userId', 'user-123');
      expect(json).toHaveProperty('gameId', 'game-123');
      expect(json).toHaveProperty('playerId', 'player-456');
      expect(json).toHaveProperty('twoPointsMade', 1);
      expect(json).toHaveProperty('assists', 1);
      expect(json).toHaveProperty('totalPoints', 2);
      expect(json).toHaveProperty('totalRebounds', 0);
      expect(json).toHaveProperty('createdAt');
      expect(json).toHaveProperty('updatedAt');
    });
  });

  describe('Validation', () => {
    test('should validate stats data', () => {
      const stats = new GameStats({
        userId: 'user-123',
        gameId: 'game-123',
        playerId: 'player-456',
      });

      expect(stats.isValid()).toBe(true);
    });
  });
});
