import { Team, TeamData } from '../../../src/domain/entities/Team';

describe('Team Entity', () => {
  describe('Creation', () => {
    test('should create a valid team with required fields', () => {
      const teamData: TeamData = {
        userId: 'user-123',
        name: 'Wild Cats',
      };

      const team = new Team(teamData);

      expect(team.id).toBeDefined();
      expect(team.userId).toBe('user-123');
      expect(team.name).toBe('Wild Cats');
      expect(team.createdAt).toBeInstanceOf(Date);
      expect(team.updatedAt).toBeInstanceOf(Date);
    });

    test('should create team with optional fields', () => {
      const teamData: TeamData = {
        userId: 'user-123',
        name: 'Wild Cats',
        coach: 'Coach Smith',
        season: '2023-2024',
        league: 'High School League',
      };

      const team = new Team(teamData);

      expect(team.coach).toBe('Coach Smith');
      expect(team.season).toBe('2023-2024');
      expect(team.league).toBe('High School League');
    });

    test('should throw error if userId is missing', () => {
      const teamData = {
        name: 'Wild Cats',
      } as TeamData;

      expect(() => new Team(teamData)).toThrow('User ID is required');
    });

    test('should throw error if name is missing', () => {
      const teamData = {
        userId: 'user-123',
      } as TeamData;

      expect(() => new Team(teamData)).toThrow('Team name is required');
    });

    test('should throw error if name is empty string', () => {
      const teamData: TeamData = {
        userId: 'user-123',
        name: '   ',
      };

      expect(() => new Team(teamData)).toThrow('Team name is required');
    });
  });

  describe('Methods', () => {
    test('should update team info', async () => {
      const team = new Team({
        userId: 'user-123',
        name: 'Wild Cats',
      });

      const originalUpdatedAt = team.updatedAt;

      await new Promise((resolve) => setTimeout(resolve, 10));

      team.update({ coach: 'Coach Johnson', league: 'Pro League' });

      expect(team.coach).toBe('Coach Johnson');
      expect(team.league).toBe('Pro League');
      expect(team.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });

    test('should not update immutable fields', () => {
      const team = new Team({
        userId: 'user-123',
        name: 'Wild Cats',
      });

      const originalId = team.id;
      const originalUserId = team.userId;
      const originalCreatedAt = team.createdAt;

      team.update({ id: 'new-id', userId: 'new-user-id', createdAt: new Date() } as any);

      expect(team.id).toBe(originalId);
      expect(team.userId).toBe(originalUserId);
      expect(team.createdAt).toEqual(originalCreatedAt);
    });

    test('should convert to JSON', () => {
      const team = new Team({
        userId: 'user-123',
        name: 'Wild Cats',
        coach: 'Coach Smith',
      });

      const json = team.toJSON();

      expect(json).toHaveProperty('id');
      expect(json).toHaveProperty('userId', 'user-123');
      expect(json).toHaveProperty('name', 'Wild Cats');
      expect(json).toHaveProperty('coach', 'Coach Smith');
      expect(json).toHaveProperty('createdAt');
      expect(json).toHaveProperty('updatedAt');
    });
  });

  describe('Validation', () => {
    test('should validate team data', () => {
      const team = new Team({
        userId: 'user-123',
        name: 'Wild Cats',
        coach: 'Coach Smith',
      });

      expect(team.isValid()).toBe(true);
    });
  });
});
