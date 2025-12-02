import { Game, GameData } from '../../../src/domain/entities/Game';

describe('Game Entity', () => {
  describe('Creation', () => {
    test('should create a valid game with required fields', () => {
      const gameData: GameData = {
        userId: 'user-123',
        teamId: 'team-123',
        opponent: 'Tigers',
      };

      const game = new Game(gameData);

      expect(game.id).toBeDefined();
      expect(game.userId).toBe('user-123');
      expect(game.teamId).toBe('team-123');
      expect(game.opponent).toBe('Tigers');
      expect(game.status).toBe('not_started');
      expect(game.createdAt).toBeInstanceOf(Date);
      expect(game.updatedAt).toBeInstanceOf(Date);
    });

    test('should create game with optional fields', () => {
      const gameDate = new Date('2024-01-15');
      const gameData: GameData = {
        userId: 'user-123',
        teamId: 'team-123',
        opponent: 'Tigers',
        gameDate: gameDate,
        location: 'Home Court',
        notes: 'Championship game',
      };

      const game = new Game(gameData);

      expect(game.gameDate).toEqual(gameDate);
      expect(game.location).toBe('Home Court');
      expect(game.notes).toBe('Championship game');
    });

    test('should throw error if userId is missing', () => {
      const gameData = {
        teamId: 'team-123',
        opponent: 'Tigers',
      } as GameData;

      expect(() => new Game(gameData)).toThrow('User ID is required');
    });

    test('should throw error if teamId is missing', () => {
      const gameData = {
        userId: 'user-123',
        opponent: 'Tigers',
      } as GameData;

      expect(() => new Game(gameData)).toThrow('Team ID is required');
    });

    test('should throw error if opponent is missing', () => {
      const gameData = {
        userId: 'user-123',
        teamId: 'team-123',
      } as GameData;

      expect(() => new Game(gameData)).toThrow('Opponent is required');
    });

    test('should throw error if status is invalid', () => {
      const gameData: GameData = {
        userId: 'user-123',
        teamId: 'team-123',
        opponent: 'Tigers',
        status: 'invalid_status' as any,
      };

      expect(() => new Game(gameData)).toThrow('Invalid game status');
    });
  });

  describe('Status Management', () => {
    test('should start a game', () => {
      const game = new Game({
        userId: 'user-123',
        teamId: 'team-123',
        opponent: 'Tigers',
      });

      game.start();

      expect(game.status).toBe('in_progress');
      expect(game.startedAt).toBeInstanceOf(Date);
    });

    test('should not start an already started game', () => {
      const game = new Game({
        userId: 'user-123',
        teamId: 'team-123',
        opponent: 'Tigers',
      });

      game.start();

      expect(() => game.start()).toThrow('Game is already in progress or completed');
    });

    test('should complete a game', () => {
      const game = new Game({
        userId: 'user-123',
        teamId: 'team-123',
        opponent: 'Tigers',
      });

      game.start();
      game.complete();

      expect(game.status).toBe('completed');
      expect(game.completedAt).toBeInstanceOf(Date);
    });

    test('should not complete a game that has not started', () => {
      const game = new Game({
        userId: 'user-123',
        teamId: 'team-123',
        opponent: 'Tigers',
      });

      expect(() => game.complete()).toThrow('Game must be in progress to complete');
    });

    test('should check if game is in progress', () => {
      const game = new Game({
        userId: 'user-123',
        teamId: 'team-123',
        opponent: 'Tigers',
      });

      expect(game.isInProgress()).toBe(false);

      game.start();
      expect(game.isInProgress()).toBe(true);

      game.complete();
      expect(game.isInProgress()).toBe(false);
    });

    test('should check if game is completed', () => {
      const game = new Game({
        userId: 'user-123',
        teamId: 'team-123',
        opponent: 'Tigers',
      });

      expect(game.isCompleted()).toBe(false);

      game.start();
      expect(game.isCompleted()).toBe(false);

      game.complete();
      expect(game.isCompleted()).toBe(true);
    });
  });

  describe('Methods', () => {
    test('should update game info', () => {
      const game = new Game({
        userId: 'user-123',
        teamId: 'team-123',
        opponent: 'Tigers',
      });

      const newDate = new Date('2024-01-20');
      game.update({
        gameDate: newDate,
        location: 'Away Court',
        notes: 'Important match',
      });

      expect(game.gameDate).toEqual(newDate);
      expect(game.location).toBe('Away Court');
      expect(game.notes).toBe('Important match');
    });

    test('should not update immutable fields', () => {
      const game = new Game({
        userId: 'user-123',
        teamId: 'team-123',
        opponent: 'Tigers',
      });

      const originalId = game.id;
      const originalUserId = game.userId;
      const originalCreatedAt = game.createdAt;
      const originalTeamId = game.teamId;

      game.update({
        id: 'new-id',
        userId: 'new-user-id',
        createdAt: new Date(),
        teamId: 'new-team-id',
      } as any);

      expect(game.id).toBe(originalId);
      expect(game.userId).toBe(originalUserId);
      expect(game.createdAt).toEqual(originalCreatedAt);
      expect(game.teamId).toBe(originalTeamId);
    });

    test('should convert to JSON', () => {
      const game = new Game({
        userId: 'user-123',
        teamId: 'team-123',
        opponent: 'Tigers',
        location: 'Home Court',
      });

      const json = game.toJSON();

      expect(json).toHaveProperty('id');
      expect(json).toHaveProperty('userId', 'user-123');
      expect(json).toHaveProperty('teamId', 'team-123');
      expect(json).toHaveProperty('opponent', 'Tigers');
      expect(json).toHaveProperty('location', 'Home Court');
      expect(json).toHaveProperty('status', 'not_started');
      expect(json).toHaveProperty('createdAt');
      expect(json).toHaveProperty('updatedAt');
    });
  });

  describe('Validation', () => {
    test('should validate game data', () => {
      const game = new Game({
        userId: 'user-123',
        teamId: 'team-123',
        opponent: 'Tigers',
      });

      expect(game.isValid()).toBe(true);
    });
  });
});
