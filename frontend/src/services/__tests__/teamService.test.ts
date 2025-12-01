/**
 * Unit tests for teamService
 */

import { teamService } from '../teamService';
import { apiClient } from '@/api/client';
import type { Team } from '@/types';

// Mock API client
jest.mock('@/api/client');

describe('teamService', () => {
  const mockTeam: Team = {
    id: 'team-1',
    name: 'Test Team',
    coach: 'Coach Name',
    season: '2023-2024',
    league: 'Test League',
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
    it('should fetch all teams', async () => {
      const mockTeams = [mockTeam, { ...mockTeam, id: 'team-2', name: 'Another Team' }];
      mockApiClientGet.mockResolvedValue({ success: true, data: mockTeams });

      const result = await teamService.getAll();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockTeams);
      expect(mockApiClientGet).toHaveBeenCalledWith('/api/teams');
    });

    it('should handle errors', async () => {
      mockApiClientGet.mockResolvedValue({ success: false, error: 'Failed to fetch teams' });

      const result = await teamService.getAll();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to fetch teams');
    });

    it('should return empty array if no teams', async () => {
      mockApiClientGet.mockResolvedValue({ success: true, data: [] });

      const result = await teamService.getAll();

      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
    });
  });

  describe('getById', () => {
    it('should fetch a team by ID', async () => {
      mockApiClientGet.mockResolvedValue({ success: true, data: mockTeam });

      const result = await teamService.getById('team-1');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockTeam);
      expect(mockApiClientGet).toHaveBeenCalledWith('/api/teams/team-1');
    });

    it('should handle errors if team does not exist', async () => {
      mockApiClientGet.mockResolvedValue({ success: false, error: 'Team not found' });

      const result = await teamService.getById('invalid-id');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Team not found');
    });
  });

  describe('create', () => {
    it('should create a new team', async () => {
      const newTeamData = {
        name: 'New Team',
        coach: 'New Coach',
        season: '2024-2025',
      };
      const createdTeam = { ...mockTeam, ...newTeamData };
      mockApiClientPost.mockResolvedValue({ success: true, data: createdTeam });

      const result = await teamService.create(newTeamData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(createdTeam);
      expect(mockApiClientPost).toHaveBeenCalledWith('/api/teams', newTeamData);
    });

    it('should handle validation errors', async () => {
      const invalidData = { name: '' };
      mockApiClientPost.mockResolvedValue({
        success: false,
        error: 'Name is required',
      });

      const result = await teamService.create(invalidData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Name is required');
    });
  });

  describe('update', () => {
    it('should update a team', async () => {
      const updateData = { coach: 'Updated Coach' };
      const updatedTeam = { ...mockTeam, ...updateData };
      mockApiClientPut.mockResolvedValue({ success: true, data: updatedTeam });

      const result = await teamService.update('team-1', updateData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(updatedTeam);
      expect(mockApiClientPut).toHaveBeenCalledWith('/api/teams/team-1', updateData);
    });

    it('should handle update errors', async () => {
      mockApiClientPut.mockResolvedValue({
        success: false,
        error: 'Update failed',
      });

      const result = await teamService.update('team-1', { name: '' });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Update failed');
    });
  });

  describe('delete', () => {
    it('should delete a team', async () => {
      mockApiClientDelete.mockResolvedValue({ success: true });

      const result = await teamService.delete('team-1');

      expect(result.success).toBe(true);
      expect(mockApiClientDelete).toHaveBeenCalledWith('/api/teams/team-1');
    });

    it('should handle deletion errors', async () => {
      mockApiClientDelete.mockResolvedValue({
        success: false,
        error: 'Cannot delete team with players',
      });

      const result = await teamService.delete('team-1');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Cannot delete team with players');
    });
  });
});
