import request from 'supertest';
import { Application } from 'express';
import { createApp } from '../../src/presentation/app';
import {
  MockPlayerRepository,
  MockTeamRepository,
  MockGameRepository,
  MockGameStatsRepository,
  MockUserRepository,
  MockSubstitutionRepository,
} from './setup/mockRepositories';

describe('Game API Endpoints', () => {
  let app: Application;
  let gameRepository: MockGameRepository;
  let playerRepository: MockPlayerRepository;

  // Helper to prepare a game for starting
  const prepareGameForStart = async (gameId: string, teamId: string = 'team-1') => {
    // Create players first
    const p1 = await request(app).post('/api/players').send({ teamId, firstName: 'P1', lastName: 'Player', jerseyNumber: 1, position: 'Guard' });
    const p2 = await request(app).post('/api/players').send({ teamId, firstName: 'P2', lastName: 'Player', jerseyNumber: 2, position: 'Guard' });
    const p3 = await request(app).post('/api/players').send({ teamId, firstName: 'P3', lastName: 'Player', jerseyNumber: 3, position: 'Forward' });
    const p4 = await request(app).post('/api/players').send({ teamId, firstName: 'P4', lastName: 'Player', jerseyNumber: 4, position: 'Forward' });
    const p5 = await request(app).post('/api/players').send({ teamId, firstName: 'P5', lastName: 'Player', jerseyNumber: 5, position: 'Center' });

    const playerIds = [p1.body.player.id, p2.body.player.id, p3.body.player.id, p4.body.player.id, p5.body.player.id];

    await request(app)
      .put(`/api/games/${gameId}/roster`)
      .send({ playerIds });

    await request(app)
      .put(`/api/games/${gameId}/starting-lineup`)
      .send({ playerIds });
  };

  beforeAll(() => {
    playerRepository = new MockPlayerRepository();
    const teamRepository = new MockTeamRepository();
    gameRepository = new MockGameRepository();
    const gameStatsRepository = new MockGameStatsRepository();
    const substitutionRepository = new MockSubstitutionRepository();
    const userRepository = new MockUserRepository();

    app = createApp(
      {
        playerRepository,
        teamRepository,
        gameRepository,
        gameStatsRepository,
        substitutionRepository,
        userRepository,
      },
      { disableAuth: true }
    );
  });

  beforeEach(() => {
    gameRepository.games = [];
    playerRepository.players = [];
  });

  describe('POST /api/games', () => {
    it('should create a new game', async () => {
      const gameData = {
        teamId: 'team-123',
        opponent: 'Tigers',
      };

      const response = await request(app).post('/api/games').send(gameData).expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.game).toBeDefined();
      expect(response.body.game.teamId).toBe('team-123');
      expect(response.body.game.opponent).toBe('Tigers');
      expect(response.body.game.status).toBe('not_started');
    });

    it('should return 400 when required fields are missing', async () => {
      const response = await request(app)
        .post('/api/games')
        .send({ teamId: 'team-123' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('required');
    });

    it('should create a game with optional fields', async () => {
      const gameData = {
        teamId: 'team-456',
        opponent: 'Panthers',
        location: 'Main Arena',
        notes: 'Championship game',
      };

      const response = await request(app).post('/api/games').send(gameData).expect(201);

      expect(response.body.game.location).toBe('Main Arena');
      expect(response.body.game.notes).toBe('Championship game');
    });
  });

  describe('GET /api/games/:id', () => {
    it('should get a game by id', async () => {
      const createResponse = await request(app).post('/api/games').send({
        teamId: 'team-123',
        opponent: 'Lions',
      });

      const gameId = createResponse.body.game.id;

      const response = await request(app).get(`/api/games/${gameId}`).expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.game).toBeDefined();
      expect(response.body.game.opponent).toBe('Lions');
    });

    it('should return 404 when game not found', async () => {
      const response = await request(app).get('/api/games/non-existent').expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/games/:id', () => {
    it('should update a game', async () => {
      const createResponse = await request(app).post('/api/games').send({
        teamId: 'team-123',
        opponent: 'Eagles',
      });

      const gameId = createResponse.body.game.id;

      const updateData = {
        opponent: 'Super Eagles',
        location: 'Arena 2',
      };

      const response = await request(app).put(`/api/games/${gameId}`).send(updateData).expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.game.opponent).toBe('Super Eagles');
      expect(response.body.game.location).toBe('Arena 2');
    });

    it('should return 404 when updating non-existent game', async () => {
      const response = await request(app)
        .put('/api/games/non-existent')
        .send({ opponent: 'New Team' })
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/games/:id', () => {
    it('should delete a game', async () => {
      const createResponse = await request(app).post('/api/games').send({
        teamId: 'team-123',
        opponent: 'To Delete',
      });

      const gameId = createResponse.body.game.id;

      const response = await request(app).delete(`/api/games/${gameId}`).expect(200);

      expect(response.body.success).toBe(true);

      await request(app).get(`/api/games/${gameId}`).expect(404);
    });

    it('should return 404 when deleting non-existent game', async () => {
      const response = await request(app).delete('/api/games/non-existent').expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/games/team/:teamId', () => {
    it('should get all games for a team', async () => {
      await request(app).post('/api/games').send({ teamId: 'team-A', opponent: 'Team 1' });
      await request(app).post('/api/games').send({ teamId: 'team-A', opponent: 'Team 2' });
      await request(app).post('/api/games').send({ teamId: 'team-B', opponent: 'Team 3' });

      const response = await request(app).get('/api/games/team/team-A').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.games).toBeDefined();
      expect(Array.isArray(response.body.games)).toBe(true);
      expect(response.body.games.length).toBe(2);
      expect(response.body.games.every((g: any) => g.teamId === 'team-A')).toBe(true);
    });

    it('should return empty array when team has no games', async () => {
      const response = await request(app).get('/api/games/team/empty-team').expect(200);

      expect(response.body.games).toEqual([]);
    });
  });

  describe('GET /api/games/status/:status', () => {
    it('should get all games with not_started status', async () => {
      await request(app).post('/api/games').send({ teamId: 'team-1', opponent: 'A' });
      await request(app).post('/api/games').send({ teamId: 'team-1', opponent: 'B' });

      const response = await request(app).get('/api/games/status/not_started').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.games.length).toBe(2);
      expect(response.body.games.every((g: any) => g.status === 'not_started')).toBe(true);
    });

    it('should get all games with in_progress status', async () => {
      const createResponse = await request(app)
        .post('/api/games')
        .send({ teamId: 'team-1', opponent: 'Test' });

      const gameId = createResponse.body.game.id;

      await prepareGameForStart(gameId);
      await request(app).post(`/api/games/${gameId}/start`);

      const response = await request(app).get('/api/games/status/in_progress').expect(200);

      expect(response.body.games.length).toBe(1);
      expect(response.body.games[0].status).toBe('in_progress');
    });

    it('should return empty array when no games match status', async () => {
      await request(app).post('/api/games').send({ teamId: 'team-1', opponent: 'Test' });

      const response = await request(app).get('/api/games/status/completed').expect(200);

      expect(response.body.games).toEqual([]);
    });
  });

  describe('POST /api/games/:id/start', () => {
    it('should start a game', async () => {
      const createResponse = await request(app)
        .post('/api/games')
        .send({ teamId: 'team-1', opponent: 'Test' });

      const gameId = createResponse.body.game.id;

      await prepareGameForStart(gameId);
      const response = await request(app).post(`/api/games/${gameId}/start`).expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.game.status).toBe('in_progress');
      expect(response.body.game.startedAt).toBeDefined();
    });

    it('should return error when game not found', async () => {
      const response = await request(app).post('/api/games/non-existent/start').expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return error when game already started', async () => {
      const createResponse = await request(app)
        .post('/api/games')
        .send({ teamId: 'team-1', opponent: 'Test' });

      const gameId = createResponse.body.game.id;

      await prepareGameForStart(gameId);
      await request(app).post(`/api/games/${gameId}/start`);

      const response = await request(app).post(`/api/games/${gameId}/start`).expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/games/:id/complete', () => {
    it('should complete a game', async () => {
      const createResponse = await request(app)
        .post('/api/games')
        .send({ teamId: 'team-1', opponent: 'Test' });

      const gameId = createResponse.body.game.id;

      await prepareGameForStart(gameId);
      await request(app).post(`/api/games/${gameId}/start`);

      const response = await request(app).post(`/api/games/${gameId}/complete`).expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.game.status).toBe('completed');
      expect(response.body.game.completedAt).toBeDefined();
    });

    it('should return error when game not in progress', async () => {
      const createResponse = await request(app)
        .post('/api/games')
        .send({ teamId: 'team-1', opponent: 'Test' });

      const gameId = createResponse.body.game.id;

      const response = await request(app).post(`/api/games/${gameId}/complete`).expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
