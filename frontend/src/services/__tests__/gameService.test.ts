/**
 * Unit tests for gameService
 */

import { gameService } from '../gameService';
import { apiClient } from '@/api/client';
import type { Game } from '@/types';

// Mock API client
jest.mock('@/api/client');

describe('gameService', () => {
  const mockGame: Game = {
    id: 'game-1',
    teamId: 'team-1',
    opponent: 'Test Opponent',
    status: 'not_started',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockApiClientGet = apiClient.get as jest.MockedFunction<typeof apiClient.get>;
  const mockApiClientPost = apiClient.post as jest.MockedFunction<typeof apiClient.post>;
  const mockApiClientPut = apiClient.put as jest.MockedFunction<typeof apiClient.put>;
  const mockApiClientDelete = apiClient.delete as jest.MockedFunction<typeof apiClient.delete>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all games from all statuses', async () => {
      const mockNotStarted = [{ ...mockGame, id: 'game-1', status: 'not_started' as const }];
      const mockInProgress = [{ ...mockGame, id: 'game-2', status: 'in_progress' as const }];
      const mockCompleted = [{ ...mockGame, id: 'game-3', status: 'completed' as const }];

      mockApiClientGet
        .mockResolvedValueOnce({ success: true, data: mockNotStarted })
        .mockResolvedValueOnce({ success: true, data: mockInProgress })
        .mockResolvedValueOnce({ success: true, data: mockCompleted });

      const result = await gameService.getAll();

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(3);
      expect(result.data).toEqual([...mockNotStarted, ...mockInProgress, ...mockCompleted]);
    });

    it('should handle errors during fetch', async () => {
      mockApiClientGet.mockRejectedValue(new Error('Network error'));

      const result = await gameService.getAll();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error');
    });

    it('should combine results even if some statuses fail', async () => {
      const mockNotStarted = [{ ...mockGame, id: 'game-1' }];

      mockApiClientGet
        .mockResolvedValueOnce({ success: true, data: mockNotStarted })
        .mockResolvedValueOnce({ success: false, error: 'Error' })
        .mockResolvedValueOnce({ success: false, error: 'Error' });

      const result = await gameService.getAll();

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data).toEqual(mockNotStarted);
    });
  });

  describe('getById', () => {
    it('should fetch a game by ID', async () => {
      mockApiClientGet.mockResolvedValue({ success: true, data: mockGame });

      const result = await gameService.getById('game-1');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockGame);
      expect(mockApiClientGet).toHaveBeenCalledWith('/api/games/game-1');
    });

    it('should handle errors', async () => {
      mockApiClientGet.mockResolvedValue({ success: false, error: 'Not found' });

      const result = await gameService.getById('invalid-id');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Not found');
    });
  });

  describe('getByTeam', () => {
    it('should fetch games by team', async () => {
      const mockGames = [mockGame, { ...mockGame, id: 'game-2' }];
      mockApiClientGet.mockResolvedValue({ success: true, data: mockGames });

      const result = await gameService.getByTeam('team-1');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockGames);
      expect(mockApiClientGet).toHaveBeenCalledWith('/api/games/team/team-1');
    });
  });

  describe('getByStatus', () => {
    it('should fetch games by status', async () => {
      const mockGames = [mockGame];
      mockApiClientGet.mockResolvedValue({ success: true, data: mockGames });

      const result = await gameService.getByStatus('not_started');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockGames);
      expect(mockApiClientGet).toHaveBeenCalledWith('/api/games/status/not_started');
    });
  });

  describe('create', () => {
    it('should create a new game', async () => {
      const newGameData = {
        teamId: 'team-1',
        opponent: 'New Opponent',
        status: 'not_started' as const,
      };
      mockApiClientPost.mockResolvedValue({ success: true, data: mockGame });

      const result = await gameService.create(newGameData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockGame);
      expect(mockApiClientPost).toHaveBeenCalledWith('/api/games', newGameData);
    });
  });

  describe('update', () => {
    it('should update a game', async () => {
      const updateData = { opponent: 'Updated Opponent' };
      const updatedGame = { ...mockGame, ...updateData };
      mockApiClientPut.mockResolvedValue({ success: true, data: updatedGame });

      const result = await gameService.update('game-1', updateData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(updatedGame);
      expect(mockApiClientPut).toHaveBeenCalledWith('/api/games/game-1', updateData);
    });
  });

  describe('delete', () => {
    it('should delete a game', async () => {
      mockApiClientDelete.mockResolvedValue({ success: true });

      const result = await gameService.delete('game-1');

      expect(result.success).toBe(true);
      expect(mockApiClientDelete).toHaveBeenCalledWith('/api/games/game-1');
    });
  });

  describe('start', () => {
    it('should start a game', async () => {
      const startedGame = { ...mockGame, status: 'in_progress' as const };
      mockApiClientPost.mockResolvedValue({ success: true, data: startedGame });

      const result = await gameService.start('game-1');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(startedGame);
      expect(mockApiClientPost).toHaveBeenCalledWith('/api/games/game-1/start', {});
    });
  });

  describe('complete', () => {
    it('should complete a game', async () => {
      const completedGame = { ...mockGame, status: 'completed' as const };
      mockApiClientPost.mockResolvedValue({ success: true, data: completedGame });

      const result = await gameService.complete('game-1');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(completedGame);
      expect(mockApiClientPost).toHaveBeenCalledWith('/api/games/game-1/complete', {});
    });
  });
});
