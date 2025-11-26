import { MongoPlayerRepository } from '../../src/infrastructure/database/repositories/MongoPlayerRepository';
import { Player } from '../../src/domain/entities/Player';
import { setupDatabase, teardownDatabase, clearDatabase } from '../setup';

describe('MongoPlayerRepository Integration Tests', () => {
  let repository: MongoPlayerRepository;

  beforeAll(async () => {
    await setupDatabase();
  });

  afterAll(async () => {
    await teardownDatabase();
  });

  beforeEach(async () => {
    await clearDatabase();
    repository = new MongoPlayerRepository();
  });

  describe('save and findById', () => {
    test('should save and retrieve a player', async () => {
      const player = new Player({
        firstName: 'John',
        lastName: 'Doe',
        teamId: 'team-123'
      });

      const saved = await repository.save(player);
      expect(saved.id).toBe(player.id);

      const found = await repository.findById(player.id);
      expect(found).not.toBeNull();
      expect(found?.firstName).toBe('John');
      expect(found?.lastName).toBe('Doe');
      expect(found?.teamId).toBe('team-123');
    });

    test('should update existing player', async () => {
      const player = new Player({
        firstName: 'John',
        lastName: 'Doe',
        teamId: 'team-123'
      });

      await repository.save(player);

      player.update({ nickname: 'Johnny' });
      const updated = await repository.save(player);

      expect(updated.nickname).toBe('Johnny');

      const found = await repository.findById(player.id);
      expect(found?.nickname).toBe('Johnny');
    });

    test('should return null for non-existent player', async () => {
      const found = await repository.findById('non-existent-id');
      expect(found).toBeNull();
    });
  });

  describe('findByTeamId', () => {
    test('should find all players in a team', async () => {
      const player1 = new Player({
        firstName: 'John',
        lastName: 'Doe',
        teamId: 'team-123'
      });

      const player2 = new Player({
        firstName: 'Jane',
        lastName: 'Smith',
        teamId: 'team-123'
      });

      const player3 = new Player({
        firstName: 'Bob',
        lastName: 'Jones',
        teamId: 'team-456'
      });

      await repository.save(player1);
      await repository.save(player2);
      await repository.save(player3);

      const team123Players = await repository.findByTeamId('team-123');
      expect(team123Players).toHaveLength(2);
      expect(team123Players.map(p => p.id)).toContain(player1.id);
      expect(team123Players.map(p => p.id)).toContain(player2.id);
    });

    test('should return empty array for team with no players', async () => {
      const players = await repository.findByTeamId('empty-team');
      expect(players).toEqual([]);
    });

    test('should return players sorted by last name', async () => {
      await repository.save(new Player({
        firstName: 'Charlie',
        lastName: 'Zulu',
        teamId: 'team-123'
      }));

      await repository.save(new Player({
        firstName: 'Alice',
        lastName: 'Alpha',
        teamId: 'team-123'
      }));

      await repository.save(new Player({
        firstName: 'Bob',
        lastName: 'Bravo',
        teamId: 'team-123'
      }));

      const players = await repository.findByTeamId('team-123');
      expect(players[0].lastName).toBe('Alpha');
      expect(players[1].lastName).toBe('Bravo');
      expect(players[2].lastName).toBe('Zulu');
    });
  });

  describe('findAll', () => {
    test('should find all players', async () => {
      await repository.save(new Player({
        firstName: 'John',
        lastName: 'Doe',
        teamId: 'team-123'
      }));

      await repository.save(new Player({
        firstName: 'Jane',
        lastName: 'Smith',
        teamId: 'team-456'
      }));

      const all = await repository.findAll();
      expect(all).toHaveLength(2);
    });

    test('should return empty array when no players exist', async () => {
      const all = await repository.findAll();
      expect(all).toEqual([]);
    });
  });

  describe('delete', () => {
    test('should delete a player', async () => {
      const player = new Player({
        firstName: 'John',
        lastName: 'Doe',
        teamId: 'team-123'
      });

      await repository.save(player);

      const deleted = await repository.delete(player.id);
      expect(deleted).toBe(true);

      const found = await repository.findById(player.id);
      expect(found).toBeNull();
    });

    test('should return false when deleting non-existent player', async () => {
      const deleted = await repository.delete('non-existent-id');
      expect(deleted).toBe(false);
    });
  });

  describe('searchByName', () => {
    beforeEach(async () => {
      await repository.save(new Player({
        firstName: 'Ryan',
        lastName: 'Evans',
        teamId: 'team-123',
        nickname: 'The Rocket'
      }));

      await repository.save(new Player({
        firstName: 'Lilly',
        lastName: 'Evans',
        teamId: 'team-123'
      }));

      await repository.save(new Player({
        firstName: 'Reed',
        lastName: 'Smith',
        teamId: 'team-123'
      }));
    });

    test('should search by first name', async () => {
      const results = await repository.searchByName('Ryan');
      expect(results).toHaveLength(1);
      expect(results[0].firstName).toBe('Ryan');
    });

    test('should search by last name', async () => {
      const results = await repository.searchByName('Evans');
      expect(results).toHaveLength(2);
    });

    test('should search by nickname', async () => {
      const results = await repository.searchByName('Rocket');
      expect(results).toHaveLength(1);
      expect(results[0].nickname).toBe('The Rocket');
    });

    test('should be case insensitive', async () => {
      const results = await repository.searchByName('ryan');
      expect(results).toHaveLength(1);
    });

    test('should return empty array for no matches', async () => {
      const results = await repository.searchByName('NonExistent');
      expect(results).toEqual([]);
    });
  });
});
