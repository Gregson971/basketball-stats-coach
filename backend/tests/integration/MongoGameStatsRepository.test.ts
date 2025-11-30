import { MongoGameStatsRepository } from '../../src/infrastructure/database/repositories/MongoGameStatsRepository';
import { GameStats } from '../../src/domain/entities/GameStats';
import { setupDatabase, teardownDatabase, clearDatabase } from '../setup';

describe('MongoGameStatsRepository Integration Tests', () => {
  let repository: MongoGameStatsRepository;

  beforeAll(async () => {
    await setupDatabase();
  });

  afterAll(async () => {
    await teardownDatabase();
  });

  beforeEach(async () => {
    await clearDatabase();
    repository = new MongoGameStatsRepository();
  });

  describe('save and findById', () => {
    test('should save and retrieve game stats', async () => {
      const stats = new GameStats({
        gameId: 'game-123',
        playerId: 'player-456',
      });

      stats.recordTwoPoint(true);
      stats.recordAssist();

      const saved = await repository.save(stats);
      expect(saved.id).toBe(stats.id);

      const found = await repository.findById(stats.id);
      expect(found).not.toBeNull();
      expect(found?.twoPointsMade).toBe(1);
      expect(found?.assists).toBe(1);
    });

    test('should update existing game stats', async () => {
      const stats = new GameStats({
        gameId: 'game-123',
        playerId: 'player-456',
      });

      stats.recordTwoPoint(true);
      await repository.save(stats);

      stats.recordThreePoint(true);
      await repository.save(stats);

      const found = await repository.findById(stats.id);
      expect(found?.twoPointsMade).toBe(1);
      expect(found?.threePointsMade).toBe(1);
      expect(found?.getTotalPoints()).toBe(5);
    });
  });

  describe('findByGameAndPlayer', () => {
    test('should find stats by game and player', async () => {
      const stats = new GameStats({
        gameId: 'game-123',
        playerId: 'player-456',
      });

      stats.recordTwoPoint(true);
      await repository.save(stats);

      const found = await repository.findByGameAndPlayer('game-123', 'player-456');
      expect(found).not.toBeNull();
      expect(found?.twoPointsMade).toBe(1);
    });

    test('should return null for non-existent combination', async () => {
      const found = await repository.findByGameAndPlayer('game-999', 'player-999');
      expect(found).toBeNull();
    });
  });

  describe('findByGameId', () => {
    test('should find all stats for a game', async () => {
      const stats1 = new GameStats({
        gameId: 'game-123',
        playerId: 'player-1',
      });
      stats1.recordTwoPoint(true);

      const stats2 = new GameStats({
        gameId: 'game-123',
        playerId: 'player-2',
      });
      stats2.recordThreePoint(true);

      const stats3 = new GameStats({
        gameId: 'game-456',
        playerId: 'player-1',
      });

      await repository.save(stats1);
      await repository.save(stats2);
      await repository.save(stats3);

      const gameStats = await repository.findByGameId('game-123');
      expect(gameStats).toHaveLength(2);
    });
  });

  describe('findByPlayerId', () => {
    test('should find all stats for a player', async () => {
      const stats1 = new GameStats({
        gameId: 'game-1',
        playerId: 'player-123',
      });

      const stats2 = new GameStats({
        gameId: 'game-2',
        playerId: 'player-123',
      });

      const stats3 = new GameStats({
        gameId: 'game-3',
        playerId: 'player-456',
      });

      await repository.save(stats1);
      await repository.save(stats2);
      await repository.save(stats3);

      const playerStats = await repository.findByPlayerId('player-123');
      expect(playerStats).toHaveLength(2);
    });
  });

  describe('getPlayerAggregateStats', () => {
    test('should calculate aggregate stats for player', async () => {
      // Game 1
      const game1Stats = new GameStats({
        gameId: 'game-1',
        playerId: 'player-123',
      });
      game1Stats.recordTwoPoint(true); // 2 points
      game1Stats.recordThreePoint(true); // 3 points
      game1Stats.recordAssist();
      game1Stats.recordOffensiveRebound();
      await repository.save(game1Stats);

      // Game 2
      const game2Stats = new GameStats({
        gameId: 'game-2',
        playerId: 'player-123',
      });
      game2Stats.recordTwoPoint(true); // 2 points
      game2Stats.recordTwoPoint(true); // 2 points
      game2Stats.recordAssist();
      game2Stats.recordAssist();
      game2Stats.recordDefensiveRebound();
      await repository.save(game2Stats);

      const aggregate = await repository.getPlayerAggregateStats('player-123');

      expect(aggregate.playerId).toBe('player-123');
      expect(aggregate.gamesPlayed).toBe(2);
      expect(aggregate.totalPoints).toBe(9); // 5 + 4
      expect(aggregate.totalRebounds).toBe(2); // 1 + 1
      expect(aggregate.totalAssists).toBe(3); // 1 + 2
      expect(aggregate.averagePoints).toBe(4.5);
      expect(aggregate.averageRebounds).toBe(1);
      expect(aggregate.averageAssists).toBe(1.5);
    });

    test('should return zeros for player with no games', async () => {
      const aggregate = await repository.getPlayerAggregateStats('player-no-games');

      expect(aggregate.gamesPlayed).toBe(0);
      expect(aggregate.totalPoints).toBe(0);
      expect(aggregate.averagePoints).toBe(0);
    });

    test('should calculate shooting percentages correctly', async () => {
      const stats = new GameStats({
        gameId: 'game-1',
        playerId: 'player-123',
      });

      // 50% FG (1/2)
      stats.recordTwoPoint(true);
      stats.recordTwoPoint(false);

      // 66.7% FT (2/3)
      stats.recordFreeThrow(true);
      stats.recordFreeThrow(true);
      stats.recordFreeThrow(false);

      // 100% 3PT (1/1)
      stats.recordThreePoint(true);

      await repository.save(stats);

      const aggregate = await repository.getPlayerAggregateStats('player-123');

      expect(aggregate.fieldGoalPercentage).toBe(66.7); // 2/3 (two-point + three-point)
      expect(aggregate.freeThrowPercentage).toBe(66.7);
      expect(aggregate.threePointPercentage).toBe(100);
    });
  });

  describe('delete', () => {
    test('should delete game stats', async () => {
      const stats = new GameStats({
        gameId: 'game-123',
        playerId: 'player-456',
      });

      await repository.save(stats);

      const deleted = await repository.delete(stats.id);
      expect(deleted).toBe(true);

      const found = await repository.findById(stats.id);
      expect(found).toBeNull();
    });

    test('should return false when deleting non-existent stats', async () => {
      const deleted = await repository.delete('non-existent-id');
      expect(deleted).toBe(false);
    });
  });
});
