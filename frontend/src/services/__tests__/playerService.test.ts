/**
 * Unit tests for playerService
 */

import { playerService } from '../playerService';
import { apiClient } from '@/api/client';
import type { Player } from '@/types';

// Mock API client
jest.mock('@/api/client');

describe('playerService', () => {
  const mockPlayer: Player = {
    id: 'player-1',
    firstName: 'John',
    lastName: 'Doe',
    teamId: 'team-1',
    nickname: 'JD',
    position: 'Guard',
    height: 185,
    weight: 80,
    age: 20,
    gender: 'M',
    grade: '12',
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
    it('should fetch all players', async () => {
      const mockPlayers = [
        mockPlayer,
        { ...mockPlayer, id: 'player-2', firstName: 'Jane', lastName: 'Smith' },
      ];
      mockApiClientGet.mockResolvedValue({ success: true, data: mockPlayers });

      const result = await playerService.getAll();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockPlayers);
      expect(mockApiClientGet).toHaveBeenCalledWith('/api/players');
    });

    it('should handle errors', async () => {
      mockApiClientGet.mockResolvedValue({ success: false, error: 'Failed to fetch players' });

      const result = await playerService.getAll();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to fetch players');
    });
  });

  describe('getById', () => {
    it('should fetch a player by ID', async () => {
      mockApiClientGet.mockResolvedValue({ success: true, data: mockPlayer });

      const result = await playerService.getById('player-1');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockPlayer);
      expect(mockApiClientGet).toHaveBeenCalledWith('/api/players/player-1');
    });

    it('should handle errors if player does not exist', async () => {
      mockApiClientGet.mockResolvedValue({ success: false, error: 'Player not found' });

      const result = await playerService.getById('invalid-id');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Player not found');
    });
  });

  describe('getByTeam', () => {
    it('should fetch players by team', async () => {
      const mockPlayers = [
        mockPlayer,
        { ...mockPlayer, id: 'player-2', firstName: 'Jane' },
      ];
      mockApiClientGet.mockResolvedValue({ success: true, data: mockPlayers });

      const result = await playerService.getByTeam('team-1');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockPlayers);
      expect(mockApiClientGet).toHaveBeenCalledWith('/api/players/team/team-1');
    });

    it('should return empty array if team has no players', async () => {
      mockApiClientGet.mockResolvedValue({ success: true, data: [] });

      const result = await playerService.getByTeam('team-1');

      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
    });
  });

  describe('create', () => {
    it('should create a new player', async () => {
      const newPlayerData = {
        firstName: 'New',
        lastName: 'Player',
        teamId: 'team-1',
        position: 'Forward' as const,
      };
      const createdPlayer = { ...mockPlayer, ...newPlayerData };
      mockApiClientPost.mockResolvedValue({ success: true, data: createdPlayer });

      const result = await playerService.create(newPlayerData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(createdPlayer);
      expect(mockApiClientPost).toHaveBeenCalledWith('/api/players', newPlayerData);
    });

    it('should create a player with only required fields', async () => {
      const minimalPlayerData = {
        firstName: 'Min',
        lastName: 'Player',
        teamId: 'team-1',
      };
      const createdPlayer = {
        ...mockPlayer,
        ...minimalPlayerData,
        nickname: undefined,
        position: undefined,
        height: undefined,
        weight: undefined,
        age: undefined,
        grade: undefined,
      };
      mockApiClientPost.mockResolvedValue({ success: true, data: createdPlayer });

      const result = await playerService.create(minimalPlayerData);

      expect(result.success).toBe(true);
      expect(mockApiClientPost).toHaveBeenCalledWith('/api/players', minimalPlayerData);
    });

    it('should handle validation errors', async () => {
      const invalidData = { firstName: '', lastName: '', teamId: '' };
      mockApiClientPost.mockResolvedValue({
        success: false,
        error: 'Validation failed',
      });

      const result = await playerService.create(invalidData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Validation failed');
    });
  });

  describe('update', () => {
    it('should update a player', async () => {
      const updateData = { nickname: 'The Beast', height: 190 };
      const updatedPlayer = { ...mockPlayer, ...updateData };
      mockApiClientPut.mockResolvedValue({ success: true, data: updatedPlayer });

      const result = await playerService.update('player-1', updateData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(updatedPlayer);
      expect(mockApiClientPut).toHaveBeenCalledWith('/api/players/player-1', updateData);
    });

    it('should handle update errors', async () => {
      mockApiClientPut.mockResolvedValue({
        success: false,
        error: 'Update failed',
      });

      const result = await playerService.update('player-1', { age: -1 });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Update failed');
    });
  });

  describe('delete', () => {
    it('should delete a player', async () => {
      mockApiClientDelete.mockResolvedValue({ success: true });

      const result = await playerService.delete('player-1');

      expect(result.success).toBe(true);
      expect(mockApiClientDelete).toHaveBeenCalledWith('/api/players/player-1');
    });

    it('should handle deletion errors', async () => {
      mockApiClientDelete.mockResolvedValue({
        success: false,
        error: 'Cannot delete player with existing stats',
      });

      const result = await playerService.delete('player-1');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Cannot delete player with existing stats');
    });
  });
});
