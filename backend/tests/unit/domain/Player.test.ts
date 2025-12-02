import { Player, PlayerData } from '../../../src/domain/entities/Player';

describe('Player Entity', () => {
  describe('Creation', () => {
    test('should create a valid player with required fields', () => {
      const playerData: PlayerData = {
        userId: 'user-123',
        firstName: 'John',
        lastName: 'Doe',
        teamId: 'team-123',
      };

      const player = new Player(playerData);

      expect(player.id).toBeDefined();
      expect(player.userId).toBe('user-123');
      expect(player.firstName).toBe('John');
      expect(player.lastName).toBe('Doe');
      expect(player.teamId).toBe('team-123');
      expect(player.createdAt).toBeInstanceOf(Date);
      expect(player.updatedAt).toBeInstanceOf(Date);
    });

    test('should create player with all optional fields', () => {
      const playerData: PlayerData = {
        userId: 'user-123',
        firstName: 'Ryan',
        lastName: 'Evans',
        teamId: 'team-123',
        nickname: 'The Rocket',
        height: 202.5,
        weight: 95.5,
        age: 24,
        gender: 'M',
        grade: '10',
        position: 'Power Forward',
      };

      const player = new Player(playerData);

      expect(player.nickname).toBe('The Rocket');
      expect(player.height).toBe(202.5);
      expect(player.weight).toBe(95.5);
      expect(player.age).toBe(24);
      expect(player.gender).toBe('M');
      expect(player.grade).toBe('10');
      expect(player.position).toBe('Power Forward');
    });

    test('should throw error if userId is missing', () => {
      const playerData = {
        firstName: 'John',
        lastName: 'Doe',
        teamId: 'team-123',
      } as PlayerData;

      expect(() => new Player(playerData)).toThrow('User ID is required');
    });

    test('should throw error if firstName is missing', () => {
      const playerData = {
        userId: 'user-123',
        lastName: 'Doe',
        teamId: 'team-123',
      } as PlayerData;

      expect(() => new Player(playerData)).toThrow('First name is required');
    });

    test('should throw error if lastName is missing', () => {
      const playerData = {
        userId: 'user-123',
        firstName: 'John',
        teamId: 'team-123',
      } as PlayerData;

      expect(() => new Player(playerData)).toThrow('Last name is required');
    });

    test('should throw error if teamId is missing', () => {
      const playerData = {
        userId: 'user-123',
        firstName: 'John',
        lastName: 'Doe',
      } as PlayerData;

      expect(() => new Player(playerData)).toThrow('Team ID is required');
    });

    test('should throw error if height is negative', () => {
      const playerData: PlayerData = {
        userId: 'user-123',
        firstName: 'John',
        lastName: 'Doe',
        teamId: 'team-123',
        height: -10,
      };

      expect(() => new Player(playerData)).toThrow('Height must be positive');
    });

    test('should throw error if weight is negative', () => {
      const playerData: PlayerData = {
        userId: 'user-123',
        firstName: 'John',
        lastName: 'Doe',
        teamId: 'team-123',
        weight: -10,
      };

      expect(() => new Player(playerData)).toThrow('Weight must be positive');
    });

    test('should throw error if age is not valid', () => {
      const playerData: PlayerData = {
        userId: 'user-123',
        firstName: 'John',
        lastName: 'Doe',
        teamId: 'team-123',
        age: -5,
      };

      expect(() => new Player(playerData)).toThrow('Age must be between 5 and 100');
    });

    test('should throw error if gender is not valid', () => {
      const playerData: PlayerData = {
        userId: 'user-123',
        firstName: 'John',
        lastName: 'Doe',
        teamId: 'team-123',
        gender: 'X' as any,
      };

      expect(() => new Player(playerData)).toThrow('Gender must be M or F');
    });
  });

  describe('Methods', () => {
    test('should get full name', () => {
      const player = new Player({
        userId: 'user-123',
        firstName: 'Ryan',
        lastName: 'Evans',
        teamId: 'team-123',
      });

      expect(player.getFullName()).toBe('Ryan Evans');
    });

    test('should get display name with nickname', () => {
      const player = new Player({
        userId: 'user-123',
        firstName: 'Ryan',
        lastName: 'Evans',
        teamId: 'team-123',
        nickname: 'The Rocket',
      });

      expect(player.getDisplayName()).toBe('The Rocket (Ryan Evans)');
    });

    test('should get display name without nickname', () => {
      const player = new Player({
        userId: 'user-123',
        firstName: 'Ryan',
        lastName: 'Evans',
        teamId: 'team-123',
      });

      expect(player.getDisplayName()).toBe('Ryan Evans');
    });

    test('should update player info', async () => {
      const player = new Player({
        userId: 'user-123',
        firstName: 'Ryan',
        lastName: 'Evans',
        teamId: 'team-123',
      });

      const originalUpdatedAt = player.updatedAt;

      // Wait a bit to ensure timestamp changes
      await new Promise((resolve) => setTimeout(resolve, 10));

      player.update({ nickname: 'The Rocket', age: 24 });

      expect(player.nickname).toBe('The Rocket');
      expect(player.age).toBe(24);
      expect(player.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });

    test('should not update immutable fields', () => {
      const player = new Player({
        userId: 'user-123',
        firstName: 'Ryan',
        lastName: 'Evans',
        teamId: 'team-123',
      });

      const originalId = player.id;
      const originalUserId = player.userId;
      const originalCreatedAt = player.createdAt;

      player.update({ id: 'new-id', userId: 'new-user-id', createdAt: new Date() } as any);

      expect(player.id).toBe(originalId);
      expect(player.userId).toBe(originalUserId);
      expect(player.createdAt).toEqual(originalCreatedAt);
    });

    test('should convert to JSON', () => {
      const player = new Player({
        userId: 'user-123',
        firstName: 'Ryan',
        lastName: 'Evans',
        teamId: 'team-123',
        nickname: 'The Rocket',
      });

      const json = player.toJSON();

      expect(json).toHaveProperty('id');
      expect(json).toHaveProperty('userId', 'user-123');
      expect(json).toHaveProperty('firstName', 'Ryan');
      expect(json).toHaveProperty('lastName', 'Evans');
      expect(json).toHaveProperty('nickname', 'The Rocket');
      expect(json).toHaveProperty('createdAt');
      expect(json).toHaveProperty('updatedAt');
    });
  });

  describe('Validation', () => {
    test('should validate player data', () => {
      const player = new Player({
        userId: 'user-123',
        firstName: 'Ryan',
        lastName: 'Evans',
        teamId: 'team-123',
        height: 202.5,
        weight: 95.5,
        age: 24,
        gender: 'M',
      });

      expect(player.isValid()).toBe(true);
    });

    test('should return false for invalid data', () => {
      const player = new Player({
        userId: 'user-123',
        firstName: 'Ryan',
        lastName: 'Evans',
        teamId: 'team-123',
      });

      // Manually set invalid data (bypassing constructor validation)
      (player as any).age = -5;

      expect(player.isValid()).toBe(false);
    });
  });
});
