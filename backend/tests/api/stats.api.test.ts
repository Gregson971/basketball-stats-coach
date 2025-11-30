import request from 'supertest';
import { Application } from 'express';
import { createApp } from '../../src/presentation/app';
import {
  MockPlayerRepository,
  MockTeamRepository,
  MockGameRepository,
  MockGameStatsRepository,
} from './setup/mockRepositories';

describe('Stats API Endpoints', () => {
  let app: Application;
  let gameRepository: MockGameRepository;
  let gameStatsRepository: MockGameStatsRepository;

  beforeAll(() => {
    const playerRepository = new MockPlayerRepository();
    const teamRepository = new MockTeamRepository();
    gameRepository = new MockGameRepository();
    gameStatsRepository = new MockGameStatsRepository();

    app = createApp({
      playerRepository,
      teamRepository,
      gameRepository,
      gameStatsRepository,
    });
  });

  beforeEach(() => {
    gameRepository.games = [];
    gameStatsRepository.stats = [];
  });

  describe('POST /api/stats/games/:gameId/actions', () => {
    it('should record a game action', async () => {
      // Créer et démarrer un match
      const gameResponse = await request(app)
        .post('/api/games')
        .send({ teamId: 'team-1', opponent: 'Test' });

      const gameId = gameResponse.body.game.id;
      await request(app).post(`/api/games/${gameId}/start`);

      const actionData = {
        playerId: 'player-1',
        actionType: 'twoPoint',
        made: true,
      };

      const response = await request(app)
        .post(`/api/stats/games/${gameId}/actions`)
        .send(actionData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.gameStats).toBeDefined();
      expect(response.body.gameStats.twoPointsMade).toBe(1);
      expect(response.body.gameStats.twoPointsAttempted).toBe(1);
    });

    it('should return 400 when required fields are missing', async () => {
      const response = await request(app)
        .post('/api/stats/games/game-1/actions')
        .send({ playerId: 'player-1' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('required');
    });

    it('should record multiple actions for same player', async () => {
      const gameResponse = await request(app)
        .post('/api/games')
        .send({ teamId: 'team-1', opponent: 'Test' });

      const gameId = gameResponse.body.game.id;
      await request(app).post(`/api/games/${gameId}/start`);

      await request(app)
        .post(`/api/stats/games/${gameId}/actions`)
        .send({ playerId: 'player-1', actionType: 'twoPoint', made: true });

      await request(app)
        .post(`/api/stats/games/${gameId}/actions`)
        .send({ playerId: 'player-1', actionType: 'threePoint', made: true });

      const response = await request(app)
        .post(`/api/stats/games/${gameId}/actions`)
        .send({ playerId: 'player-1', actionType: 'assist' })
        .expect(201);

      expect(response.body.gameStats.twoPointsMade).toBe(1);
      expect(response.body.gameStats.threePointsMade).toBe(1);
      expect(response.body.gameStats.assists).toBe(1);
    });

    it('should record missed shots', async () => {
      const gameResponse = await request(app)
        .post('/api/games')
        .send({ teamId: 'team-1', opponent: 'Test' });

      const gameId = gameResponse.body.game.id;
      await request(app).post(`/api/games/${gameId}/start`);

      const response = await request(app)
        .post(`/api/stats/games/${gameId}/actions`)
        .send({ playerId: 'player-1', actionType: 'twoPoint', made: false })
        .expect(201);

      expect(response.body.gameStats.twoPointsMade).toBe(0);
      expect(response.body.gameStats.twoPointsAttempted).toBe(1);
    });

    it('should return error when game not in progress', async () => {
      const gameResponse = await request(app)
        .post('/api/games')
        .send({ teamId: 'team-1', opponent: 'Test' });

      const gameId = gameResponse.body.game.id;

      const response = await request(app)
        .post(`/api/stats/games/${gameId}/actions`)
        .send({ playerId: 'player-1', actionType: 'twoPoint', made: true })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/stats/games/:gameId/actions/:playerId', () => {
    it('should undo last game action', async () => {
      const gameResponse = await request(app)
        .post('/api/games')
        .send({ teamId: 'team-1', opponent: 'Test' });

      const gameId = gameResponse.body.game.id;
      await request(app).post(`/api/games/${gameId}/start`);

      await request(app)
        .post(`/api/stats/games/${gameId}/actions`)
        .send({ playerId: 'player-1', actionType: 'twoPoint', made: true });

      await request(app)
        .post(`/api/stats/games/${gameId}/actions`)
        .send({ playerId: 'player-1', actionType: 'assist' });

      const response = await request(app)
        .delete(`/api/stats/games/${gameId}/actions/player-1`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.gameStats.assists).toBe(0);
      expect(response.body.gameStats.twoPointsMade).toBe(1);
    });

    it('should return error when game stats not found', async () => {
      const response = await request(app)
        .delete('/api/stats/games/non-existent/actions/player-1')
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return error when no actions to undo', async () => {
      const gameResponse = await request(app)
        .post('/api/games')
        .send({ teamId: 'team-1', opponent: 'Test' });

      const gameId = gameResponse.body.game.id;
      await request(app).post(`/api/games/${gameId}/start`);

      // Créer les stats sans actions
      await request(app)
        .post(`/api/stats/games/${gameId}/actions`)
        .send({ playerId: 'player-1', actionType: 'assist' });

      // Undo la seule action
      await request(app).delete(`/api/stats/games/${gameId}/actions/player-1`);

      // Essayer d'undo à nouveau
      const response = await request(app)
        .delete(`/api/stats/games/${gameId}/actions/player-1`)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/stats/games/:gameId/players/:playerId', () => {
    it('should get player game stats', async () => {
      const gameResponse = await request(app)
        .post('/api/games')
        .send({ teamId: 'team-1', opponent: 'Test' });

      const gameId = gameResponse.body.game.id;
      await request(app).post(`/api/games/${gameId}/start`);

      await request(app)
        .post(`/api/stats/games/${gameId}/actions`)
        .send({ playerId: 'player-1', actionType: 'twoPoint', made: true });

      await request(app)
        .post(`/api/stats/games/${gameId}/actions`)
        .send({ playerId: 'player-1', actionType: 'threePoint', made: true });

      const response = await request(app)
        .get(`/api/stats/games/${gameId}/players/player-1`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.gameStats).toBeDefined();
      expect(response.body.gameStats.twoPointsMade).toBe(1);
      expect(response.body.gameStats.threePointsMade).toBe(1);
    });

    it('should return 404 when game stats not found', async () => {
      const response = await request(app)
        .get('/api/stats/games/non-existent/players/player-1')
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should calculate total points correctly', async () => {
      const gameResponse = await request(app)
        .post('/api/games')
        .send({ teamId: 'team-1', opponent: 'Test' });

      const gameId = gameResponse.body.game.id;
      await request(app).post(`/api/games/${gameId}/start`);

      await request(app)
        .post(`/api/stats/games/${gameId}/actions`)
        .send({ playerId: 'player-1', actionType: 'freeThrow', made: true });

      await request(app)
        .post(`/api/stats/games/${gameId}/actions`)
        .send({ playerId: 'player-1', actionType: 'twoPoint', made: true });

      await request(app)
        .post(`/api/stats/games/${gameId}/actions`)
        .send({ playerId: 'player-1', actionType: 'threePoint', made: true });

      const response = await request(app)
        .get(`/api/stats/games/${gameId}/players/player-1`)
        .expect(200);

      expect(response.body.gameStats.freeThrowsMade).toBe(1);
      expect(response.body.gameStats.twoPointsMade).toBe(1);
      expect(response.body.gameStats.threePointsMade).toBe(1);
      // Total: 1 + 2 + 3 = 6 points
    });
  });

  describe('GET /api/stats/players/:playerId/career', () => {
    it('should get player career stats', async () => {
      // Créer 2 matchs avec des stats
      const game1Response = await request(app)
        .post('/api/games')
        .send({ teamId: 'team-1', opponent: 'Test 1' });

      const game1Id = game1Response.body.game.id;
      await request(app).post(`/api/games/${game1Id}/start`);

      await request(app)
        .post(`/api/stats/games/${game1Id}/actions`)
        .send({ playerId: 'player-1', actionType: 'twoPoint', made: true });

      await request(app)
        .post(`/api/stats/games/${game1Id}/actions`)
        .send({ playerId: 'player-1', actionType: 'assist' });

      const game2Response = await request(app)
        .post('/api/games')
        .send({ teamId: 'team-1', opponent: 'Test 2' });

      const game2Id = game2Response.body.game.id;
      await request(app).post(`/api/games/${game2Id}/start`);

      await request(app)
        .post(`/api/stats/games/${game2Id}/actions`)
        .send({ playerId: 'player-1', actionType: 'threePoint', made: true });

      await request(app)
        .post(`/api/stats/games/${game2Id}/actions`)
        .send({ playerId: 'player-1', actionType: 'assist' });

      const response = await request(app).get('/api/stats/players/player-1/career').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.stats).toBeDefined();
      expect(response.body.stats.gamesPlayed).toBe(2);
      expect(response.body.stats.totalPoints).toBe(5); // 2 + 3
      expect(response.body.stats.totalAssists).toBe(2);
      expect(response.body.stats.averagePoints).toBe(2.5);
    });

    it('should return zero stats for player with no games', async () => {
      const response = await request(app)
        .get('/api/stats/players/player-no-games/career')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.stats.gamesPlayed).toBe(0);
      expect(response.body.stats.totalPoints).toBe(0);
    });
  });
});
