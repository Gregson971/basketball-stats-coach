/**
 * Unit tests for statsService
 */

import { statsService } from '../statsService';
import { apiClient } from '@/api/client';
import type { GameStats, CareerStats, RecordActionPayload } from '@/types';

// Mock API client
jest.mock('@/api/client');

describe('statsService', () => {
  const mockGameStats: GameStats = {
    gameId: 'game-1',
    playerId: 'player-1',
    freeThrowsMade: 5,
    freeThrowsAttempted: 6,
    twoPointsMade: 4,
    twoPointsAttempted: 8,
    threePointsMade: 2,
    threePointsAttempted: 5,
    offensiveRebounds: 2,
    defensiveRebounds: 5,
    assists: 3,
    steals: 2,
    blocks: 1,
    turnovers: 2,
    personalFouls: 3,
  };

  const mockCareerStats: CareerStats = {
    playerId: 'player-1',
    gamesPlayed: 10,
    totalPoints: 150,
    totalRebounds: 50,
    totalAssists: 30,
    averagePoints: 15,
    averageRebounds: 5,
    averageAssists: 3,
    fieldGoalPercentage: 45.5,
    freeThrowPercentage: 80.0,
    threePointPercentage: 35.0,
  };

  const mockApiClientGet = apiClient.get as jest.MockedFunction<typeof apiClient.get>;
  const mockApiClientPost = apiClient.post as jest.MockedFunction<typeof apiClient.post>;
  const mockApiClientDelete = apiClient.delete as jest.MockedFunction<typeof apiClient.delete>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('recordAction', () => {
    it('should record a successful action', async () => {
      const payload: RecordActionPayload = {
        gameId: 'game-1',
        playerId: 'player-1',
        actionType: 'twoPoint',
        made: true,
      };

      mockApiClientPost.mockResolvedValue({ success: true, data: mockGameStats });

      const result = await statsService.recordAction(payload);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockGameStats);
      expect(mockApiClientPost).toHaveBeenCalledWith('/api/stats/games/game-1/actions', payload);
    });

    it('should record a missed shot', async () => {
      const payload: RecordActionPayload = {
        gameId: 'game-1',
        playerId: 'player-1',
        actionType: 'threePoint',
        made: false,
      };

      mockApiClientPost.mockResolvedValue({ success: true, data: mockGameStats });

      const result = await statsService.recordAction(payload);

      expect(result.success).toBe(true);
      expect(mockApiClientPost).toHaveBeenCalledWith('/api/stats/games/game-1/actions', payload);
    });

    it('should record an action without result (rebound, assist, etc.)', async () => {
      const payload: RecordActionPayload = {
        gameId: 'game-1',
        playerId: 'player-1',
        actionType: 'assist',
      };

      mockApiClientPost.mockResolvedValue({ success: true, data: mockGameStats });

      const result = await statsService.recordAction(payload);

      expect(result.success).toBe(true);
      expect(mockApiClientPost).toHaveBeenCalledWith('/api/stats/games/game-1/actions', payload);
    });

    it('should handle errors', async () => {
      const payload: RecordActionPayload = {
        gameId: 'game-1',
        playerId: 'player-1',
        actionType: 'freeThrow',
        made: true,
      };

      mockApiClientPost.mockResolvedValue({ success: false, error: 'Failed to record action' });

      const result = await statsService.recordAction(payload);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to record action');
    });
  });

  describe('undoLastAction', () => {
    it('should undo the last action', async () => {
      mockApiClientDelete.mockResolvedValue({ success: true, data: mockGameStats });

      const result = await statsService.undoLastAction('game-1', 'player-1');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockGameStats);
      expect(mockApiClientDelete).toHaveBeenCalledWith('/api/stats/games/game-1/actions/player-1');
    });

    it('should handle errors when undoing', async () => {
      mockApiClientDelete.mockResolvedValue({
        success: false,
        error: 'No action to undo',
      });

      const result = await statsService.undoLastAction('game-1', 'player-1');

      expect(result.success).toBe(false);
      expect(result.error).toBe('No action to undo');
    });
  });

  describe('getPlayerGameStats', () => {
    it('should fetch player stats for a game', async () => {
      mockApiClientGet.mockResolvedValue({ success: true, data: mockGameStats });

      const result = await statsService.getPlayerGameStats('game-1', 'player-1');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockGameStats);
      expect(mockApiClientGet).toHaveBeenCalledWith('/api/stats/games/game-1/players/player-1');
    });

    it('should handle case when no stats exist', async () => {
      mockApiClientGet.mockResolvedValue({
        success: false,
        error: 'Stats not found',
      });

      const result = await statsService.getPlayerGameStats('game-1', 'player-999');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Stats not found');
    });
  });

  describe('getPlayerCareerStats', () => {
    it('should fetch player career stats', async () => {
      mockApiClientGet.mockResolvedValue({ success: true, data: mockCareerStats });

      const result = await statsService.getPlayerCareerStats('player-1');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockCareerStats);
      expect(mockApiClientGet).toHaveBeenCalledWith('/api/stats/players/player-1/career');
    });

    it('should handle errors', async () => {
      mockApiClientGet.mockResolvedValue({
        success: false,
        error: 'Player not found',
      });

      const result = await statsService.getPlayerCareerStats('invalid-player');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Player not found');
    });
  });
});
