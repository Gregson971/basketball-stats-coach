import { Substitution, SubstitutionData } from '../../../src/domain/entities/Substitution';

describe('Substitution Entity', () => {
  describe('Creation', () => {
    test('should create a valid substitution with required fields', () => {
      const substitutionData: SubstitutionData = {
        gameId: 'game-123',
        quarter: 1,
        playerOut: 'player-1',
        playerIn: 'player-2',
      };

      const substitution = new Substitution(substitutionData);

      expect(substitution.id).toBeDefined();
      expect(substitution.gameId).toBe('game-123');
      expect(substitution.quarter).toBe(1);
      expect(substitution.playerOut).toBe('player-1');
      expect(substitution.playerIn).toBe('player-2');
      expect(substitution.timestamp).toBeInstanceOf(Date);
      expect(substitution.createdAt).toBeInstanceOf(Date);
      expect(substitution.updatedAt).toBeInstanceOf(Date);
    });

    test('should create substitution with all optional fields', () => {
      const timestamp = new Date('2024-01-15T10:30:00Z');
      const createdAt = new Date('2024-01-15T10:00:00Z');
      const updatedAt = new Date('2024-01-15T10:00:00Z');

      const substitutionData: SubstitutionData = {
        id: 'sub-123',
        gameId: 'game-456',
        quarter: 2,
        playerOut: 'player-3',
        playerIn: 'player-4',
        timestamp,
        createdAt,
        updatedAt,
      };

      const substitution = new Substitution(substitutionData);

      expect(substitution.id).toBe('sub-123');
      expect(substitution.timestamp).toBe(timestamp);
      expect(substitution.createdAt).toBe(createdAt);
      expect(substitution.updatedAt).toBe(updatedAt);
    });

    test('should throw error if gameId is missing', () => {
      const substitutionData = {
        quarter: 1,
        playerOut: 'player-1',
        playerIn: 'player-2',
      } as SubstitutionData;

      expect(() => new Substitution(substitutionData)).toThrow('Game ID is required');
    });

    test('should throw error if gameId is empty', () => {
      const substitutionData: SubstitutionData = {
        gameId: '   ',
        quarter: 1,
        playerOut: 'player-1',
        playerIn: 'player-2',
      };

      expect(() => new Substitution(substitutionData)).toThrow('Game ID is required');
    });

    test('should throw error if quarter is less than 1', () => {
      const substitutionData: SubstitutionData = {
        gameId: 'game-123',
        quarter: 0,
        playerOut: 'player-1',
        playerIn: 'player-2',
      };

      expect(() => new Substitution(substitutionData)).toThrow('Quarter must be between 1 and 4');
    });

    test('should throw error if quarter is greater than 4', () => {
      const substitutionData: SubstitutionData = {
        gameId: 'game-123',
        quarter: 5,
        playerOut: 'player-1',
        playerIn: 'player-2',
      };

      expect(() => new Substitution(substitutionData)).toThrow('Quarter must be between 1 and 4');
    });

    test('should throw error if playerOut is missing', () => {
      const substitutionData = {
        gameId: 'game-123',
        quarter: 1,
        playerIn: 'player-2',
      } as SubstitutionData;

      expect(() => new Substitution(substitutionData)).toThrow('Player out is required');
    });

    test('should throw error if playerOut is empty', () => {
      const substitutionData: SubstitutionData = {
        gameId: 'game-123',
        quarter: 1,
        playerOut: '   ',
        playerIn: 'player-2',
      };

      expect(() => new Substitution(substitutionData)).toThrow('Player out is required');
    });

    test('should throw error if playerIn is missing', () => {
      const substitutionData = {
        gameId: 'game-123',
        quarter: 1,
        playerOut: 'player-1',
      } as SubstitutionData;

      expect(() => new Substitution(substitutionData)).toThrow('Player in is required');
    });

    test('should throw error if playerIn is empty', () => {
      const substitutionData: SubstitutionData = {
        gameId: 'game-123',
        quarter: 1,
        playerOut: 'player-1',
        playerIn: '   ',
      };

      expect(() => new Substitution(substitutionData)).toThrow('Player in is required');
    });

    test('should throw error if playerOut and playerIn are the same', () => {
      const substitutionData: SubstitutionData = {
        gameId: 'game-123',
        quarter: 1,
        playerOut: 'player-1',
        playerIn: 'player-1',
      };

      expect(() => new Substitution(substitutionData)).toThrow(
        'Player out and player in must be different'
      );
    });

    test('should allow substitution in all quarters (1-4)', () => {
      for (let quarter = 1; quarter <= 4; quarter++) {
        const substitutionData: SubstitutionData = {
          gameId: 'game-123',
          quarter,
          playerOut: 'player-1',
          playerIn: 'player-2',
        };

        const substitution = new Substitution(substitutionData);
        expect(substitution.quarter).toBe(quarter);
      }
    });
  });

  describe('Methods', () => {
    test('should convert to JSON', () => {
      const substitution = new Substitution({
        gameId: 'game-123',
        quarter: 3,
        playerOut: 'player-5',
        playerIn: 'player-6',
      });

      const json = substitution.toJSON();

      expect(json).toHaveProperty('id');
      expect(json).toHaveProperty('gameId', 'game-123');
      expect(json).toHaveProperty('quarter', 3);
      expect(json).toHaveProperty('playerOut', 'player-5');
      expect(json).toHaveProperty('playerIn', 'player-6');
      expect(json).toHaveProperty('timestamp');
      expect(json).toHaveProperty('createdAt');
      expect(json).toHaveProperty('updatedAt');
    });

    test('should preserve all data in JSON conversion', () => {
      const timestamp = new Date('2024-01-15T14:30:00Z');
      const createdAt = new Date('2024-01-15T14:00:00Z');
      const updatedAt = new Date('2024-01-15T14:15:00Z');

      const substitution = new Substitution({
        id: 'sub-999',
        gameId: 'game-789',
        quarter: 4,
        playerOut: 'player-10',
        playerIn: 'player-11',
        timestamp,
        createdAt,
        updatedAt,
      });

      const json = substitution.toJSON();

      expect(json.id).toBe('sub-999');
      expect(json.gameId).toBe('game-789');
      expect(json.quarter).toBe(4);
      expect(json.playerOut).toBe('player-10');
      expect(json.playerIn).toBe('player-11');
      expect(json.timestamp).toBe(timestamp);
      expect(json.createdAt).toBe(createdAt);
      expect(json.updatedAt).toBe(updatedAt);
    });
  });
});
