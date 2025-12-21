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

describe('Stats API Endpoints', () => {
  let app: Application;
  let gameRepository: MockGameRepository;
  let gameStatsRepository: MockGameStatsRepository;
  let playerRepository: MockPlayerRepository;

  // Helper to create and start a game properly
  const createAndStartGame = async () => {
    // Create players first
    await request(app).post('/api/players').send({ teamId: 'team-1', firstName: 'P1', lastName: 'Player', jerseyNumber: 1, position: 'Guard' });
    await request(app).post('/api/players').send({ teamId: 'team-1', firstName: 'P2', lastName: 'Player', jerseyNumber: 2, position: 'Guard' });
    await request(app).post('/api/players').send({ teamId: 'team-1', firstName: 'P3', lastName: 'Player', jerseyNumber: 3, position: 'Forward' });
    await request(app).post('/api/players').send({ teamId: 'team-1', firstName: 'P4', lastName: 'Player', jerseyNumber: 4, position: 'Forward' });
    await request(app).post('/api/players').send({ teamId: 'team-1', firstName: 'P5', lastName: 'Player', jerseyNumber: 5, position: 'Center' });

    // Get player IDs from repository
    const players = playerRepository.players;
    const playerIds = players.slice(0, 5).map(p => p.id);

    const gameResponse = await request(app)
      .post('/api/games')
      .send({ teamId: 'team-1', opponent: 'Test' });

    const gameId = gameResponse.body.game.id;

    // Set roster and lineup before starting
    await request(app)
      .put(`/api/games/${gameId}/roster`)
      .send({ playerIds });

    await request(app)
      .put(`/api/games/${gameId}/starting-lineup`)
      .send({ playerIds });

    await request(app).post(`/api/games/${gameId}/start`);

    return { gameId, playerIds };
  };

  beforeAll(() => {
    playerRepository = new MockPlayerRepository();
    const teamRepository = new MockTeamRepository();
    gameRepository = new MockGameRepository();
    gameStatsRepository = new MockGameStatsRepository();
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
    gameStatsRepository.stats = [];
    playerRepository.players = [];
  });

  describe('POST /api/stats/games/:gameId/actions', () => {
    it('should record a game action', async () => {
      const { gameId, playerIds } = await createAndStartGame();

      const actionData = {
        playerId: playerIds[0],
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
      const { gameId, playerIds } = await createAndStartGame();

      await request(app)
        .post(`/api/stats/games/${gameId}/actions`)
        .send({ playerId: playerIds[0], actionType: 'twoPoint', made: true });

      await request(app)
        .post(`/api/stats/games/${gameId}/actions`)
        .send({ playerId: playerIds[0], actionType: 'threePoint', made: true });

      const response = await request(app)
        .post(`/api/stats/games/${gameId}/actions`)
        .send({ playerId: playerIds[0], actionType: 'assist' })
        .expect(201);

      expect(response.body.gameStats.twoPointsMade).toBe(1);
      expect(response.body.gameStats.threePointsMade).toBe(1);
      expect(response.body.gameStats.assists).toBe(1);
    });

    it('should record missed shots', async () => {
      const { gameId, playerIds } = await createAndStartGame();

      const response = await request(app)
        .post(`/api/stats/games/${gameId}/actions`)
        .send({ playerId: playerIds[0], actionType: 'twoPoint', made: false })
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
      const { gameId, playerIds } = await createAndStartGame();

      await request(app)
        .post(`/api/stats/games/${gameId}/actions`)
        .send({ playerId: playerIds[0], actionType: 'twoPoint', made: true });

      await request(app)
        .post(`/api/stats/games/${gameId}/actions`)
        .send({ playerId: playerIds[0], actionType: 'assist' });

      const response = await request(app)
        .delete(`/api/stats/games/${gameId}/actions/${playerIds[0]}`)
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
      const { gameId, playerIds } = await createAndStartGame();

      // Créer les stats sans actions
      await request(app)
        .post(`/api/stats/games/${gameId}/actions`)
        .send({ playerId: playerIds[0], actionType: 'assist' });

      // Undo la seule action
      await request(app).delete(`/api/stats/games/${gameId}/actions/${playerIds[0]}`);

      // Essayer d'undo à nouveau
      const response = await request(app)
        .delete(`/api/stats/games/${gameId}/actions/${playerIds[0]}`)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/stats/games/:gameId/players/:playerId', () => {
    it('should get player game stats', async () => {
      const { gameId, playerIds } = await createAndStartGame();

      await request(app)
        .post(`/api/stats/games/${gameId}/actions`)
        .send({ playerId: playerIds[0], actionType: 'twoPoint', made: true });

      await request(app)
        .post(`/api/stats/games/${gameId}/actions`)
        .send({ playerId: playerIds[0], actionType: 'threePoint', made: true });

      const response = await request(app)
        .get(`/api/stats/games/${gameId}/players/${playerIds[0]}`)
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
      const { gameId, playerIds } = await createAndStartGame();

      await request(app)
        .post(`/api/stats/games/${gameId}/actions`)
        .send({ playerId: playerIds[0], actionType: 'freeThrow', made: true });

      await request(app)
        .post(`/api/stats/games/${gameId}/actions`)
        .send({ playerId: playerIds[0], actionType: 'twoPoint', made: true });

      await request(app)
        .post(`/api/stats/games/${gameId}/actions`)
        .send({ playerId: playerIds[0], actionType: 'threePoint', made: true });

      const response = await request(app)
        .get(`/api/stats/games/${gameId}/players/${playerIds[0]}`)
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
      const { gameId: game1Id, playerIds: playerIds1 } = await createAndStartGame();

      await request(app)
        .post(`/api/stats/games/${game1Id}/actions`)
        .send({ playerId: playerIds1[0], actionType: 'twoPoint', made: true });

      await request(app)
        .post(`/api/stats/games/${game1Id}/actions`)
        .send({ playerId: playerIds1[0], actionType: 'assist' });

      const { gameId: game2Id, playerIds: playerIds2 } = await createAndStartGame();

      await request(app)
        .post(`/api/stats/games/${game2Id}/actions`)
        .send({ playerId: playerIds2[0], actionType: 'threePoint', made: true });

      await request(app)
        .post(`/api/stats/games/${game2Id}/actions`)
        .send({ playerId: playerIds2[0], actionType: 'assist' });

      const response = await request(app).get(`/api/stats/players/${playerIds1[0]}/career`).expect(200);

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
