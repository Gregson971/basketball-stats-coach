import request from 'supertest';
import { Application } from 'express';
import { createApp } from '../../src/presentation/app';
import {
  MockPlayerRepository,
  MockTeamRepository,
  MockGameRepository,
  MockGameStatsRepository
} from './setup/mockRepositories';

describe('Team API Endpoints', () => {
  let app: Application;
  let teamRepository: MockTeamRepository;

  beforeAll(() => {
    const playerRepository = new MockPlayerRepository();
    teamRepository = new MockTeamRepository();
    const gameRepository = new MockGameRepository();
    const gameStatsRepository = new MockGameStatsRepository();

    app = createApp({
      playerRepository,
      teamRepository,
      gameRepository,
      gameStatsRepository
    });
  });

  beforeEach(() => {
    teamRepository.teams = [];
  });

  describe('POST /api/teams', () => {
    it('should create a new team', async () => {
      const teamData = {
        name: 'Wild Cats'
      };

      const response = await request(app)
        .post('/api/teams')
        .send(teamData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.team).toBeDefined();
      expect(response.body.team.name).toBe('Wild Cats');
      expect(response.body.team.id).toBeDefined();
    });

    it('should return 400 when name is missing', async () => {
      const response = await request(app)
        .post('/api/teams')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('required');
    });

    it('should create a team with optional fields', async () => {
      const teamData = {
        name: 'Tigers',
        coach: 'Coach Johnson',
        season: '2024-2025',
        league: 'Youth League'
      };

      const response = await request(app)
        .post('/api/teams')
        .send(teamData)
        .expect(201);

      expect(response.body.team.name).toBe('Tigers');
      expect(response.body.team.coach).toBe('Coach Johnson');
      expect(response.body.team.season).toBe('2024-2025');
      expect(response.body.team.league).toBe('Youth League');
    });
  });

  describe('GET /api/teams/:id', () => {
    it('should get a team by id', async () => {
      const createResponse = await request(app)
        .post('/api/teams')
        .send({ name: 'Panthers' });

      const teamId = createResponse.body.team.id;

      const response = await request(app)
        .get(`/api/teams/${teamId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.team).toBeDefined();
      expect(response.body.team.name).toBe('Panthers');
    });

    it('should return 404 when team not found', async () => {
      const response = await request(app)
        .get('/api/teams/non-existent')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/teams/:id', () => {
    it('should update a team', async () => {
      const createResponse = await request(app)
        .post('/api/teams')
        .send({ name: 'Lions' });

      const teamId = createResponse.body.team.id;

      const updateData = {
        name: 'Super Lions',
        coach: 'Coach Smith'
      };

      const response = await request(app)
        .put(`/api/teams/${teamId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.team.name).toBe('Super Lions');
      expect(response.body.team.coach).toBe('Coach Smith');
    });

    it('should return 404 when updating non-existent team', async () => {
      const response = await request(app)
        .put('/api/teams/non-existent')
        .send({ name: 'New Name' })
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should return error when trying to set empty name', async () => {
      const createResponse = await request(app)
        .post('/api/teams')
        .send({ name: 'Eagles' });

      const teamId = createResponse.body.team.id;

      const response = await request(app)
        .put(`/api/teams/${teamId}`)
        .send({ name: '' })
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/teams/:id', () => {
    it('should delete a team', async () => {
      const createResponse = await request(app)
        .post('/api/teams')
        .send({ name: 'To Delete Team' });

      const teamId = createResponse.body.team.id;

      const response = await request(app)
        .delete(`/api/teams/${teamId}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      await request(app)
        .get(`/api/teams/${teamId}`)
        .expect(404);
    });

    it('should return 404 when deleting non-existent team', async () => {
      const response = await request(app)
        .delete('/api/teams/non-existent')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/teams', () => {
    it('should get all teams', async () => {
      await request(app).post('/api/teams').send({ name: 'Team 1' });
      await request(app).post('/api/teams').send({ name: 'Team 2' });
      await request(app).post('/api/teams').send({ name: 'Team 3' });

      const response = await request(app)
        .get('/api/teams')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.teams).toBeDefined();
      expect(Array.isArray(response.body.teams)).toBe(true);
      expect(response.body.teams.length).toBe(3);
    });

    it('should return empty array when no teams exist', async () => {
      const response = await request(app)
        .get('/api/teams')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.teams).toEqual([]);
    });
  });
});
