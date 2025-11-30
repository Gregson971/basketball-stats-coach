import request from 'supertest';
import { Application } from 'express';
import { createApp } from '../../src/presentation/app';
import {
  MockPlayerRepository,
  MockTeamRepository,
  MockGameRepository,
  MockGameStatsRepository,
} from './setup/mockRepositories';

describe('Player API Endpoints', () => {
  let app: Application;
  let playerRepository: MockPlayerRepository;

  beforeAll(() => {
    playerRepository = new MockPlayerRepository();
    const teamRepository = new MockTeamRepository();
    const gameRepository = new MockGameRepository();
    const gameStatsRepository = new MockGameStatsRepository();

    app = createApp({
      playerRepository,
      teamRepository,
      gameRepository,
      gameStatsRepository,
    });
  });

  beforeEach(() => {
    // Réinitialiser les données entre chaque test
    playerRepository.players = [];
  });

  describe('POST /api/players', () => {
    it('should create a new player', async () => {
      const playerData = {
        firstName: 'John',
        lastName: 'Doe',
        teamId: 'team-123',
      };

      const response = await request(app).post('/api/players').send(playerData).expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.player).toBeDefined();
      expect(response.body.player.firstName).toBe('John');
      expect(response.body.player.lastName).toBe('Doe');
    });

    it('should return 400 when required fields are missing', async () => {
      const response = await request(app)
        .post('/api/players')
        .send({ firstName: 'John' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('required');
    });

    it('should create a player with optional fields', async () => {
      const playerData = {
        firstName: 'Jane',
        lastName: 'Smith',
        teamId: 'team-456',
        position: 'Guard',
        height: 175,
        weight: 70,
      };

      const response = await request(app).post('/api/players').send(playerData).expect(201);

      expect(response.body.player.position).toBe('Guard');
      expect(response.body.player.height).toBe(175);
    });
  });

  describe('GET /api/players/:id', () => {
    it('should get a player by id', async () => {
      // Créer d'abord un joueur
      const createResponse = await request(app).post('/api/players').send({
        firstName: 'Test',
        lastName: 'Player',
        teamId: 'team-123',
      });

      const playerId = createResponse.body.player.id;

      const response = await request(app).get(`/api/players/${playerId}`).expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.player).toBeDefined();
      expect(response.body.player.firstName).toBe('Test');
    });

    it('should return 404 when player not found', async () => {
      const response = await request(app).get('/api/players/non-existent').expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/players/:id', () => {
    it('should update a player', async () => {
      // Créer d'abord un joueur
      const createResponse = await request(app).post('/api/players').send({
        firstName: 'John',
        lastName: 'Doe',
        teamId: 'team-123',
      });

      const playerId = createResponse.body.player.id;

      const updateData = {
        firstName: 'Johnny',
        position: 'Forward',
      };

      const response = await request(app)
        .put(`/api/players/${playerId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.player).toBeDefined();
      expect(response.body.player.firstName).toBe('Johnny');
    });

    it('should return 404 when updating non-existent player', async () => {
      const response = await request(app)
        .put('/api/players/non-existent')
        .send({ firstName: 'John' })
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/players/:id', () => {
    it('should delete a player', async () => {
      // Créer d'abord un joueur
      const createResponse = await request(app).post('/api/players').send({
        firstName: 'To',
        lastName: 'Delete',
        teamId: 'team-123',
      });

      const playerId = createResponse.body.player.id;

      const response = await request(app).delete(`/api/players/${playerId}`).expect(200);

      expect(response.body.success).toBe(true);

      // Vérifier que le joueur a bien été supprimé
      await request(app).get(`/api/players/${playerId}`).expect(404);
    });

    it('should return 404 when deleting non-existent player', async () => {
      const response = await request(app).delete('/api/players/non-existent').expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/players/team/:teamId', () => {
    it('should get all players of a team', async () => {
      const response = await request(app).get('/api/players/team/team-123').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.players).toBeDefined();
      expect(Array.isArray(response.body.players)).toBe(true);
    });

    it('should return empty array when team has no players', async () => {
      const response = await request(app).get('/api/players/team/empty-team').expect(200);

      expect(response.body.players).toEqual([]);
    });
  });

  describe('GET /api/players', () => {
    it('should get all players', async () => {
      const response = await request(app).get('/api/players').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.players).toBeDefined();
      expect(Array.isArray(response.body.players)).toBe(true);
    });
  });
});
