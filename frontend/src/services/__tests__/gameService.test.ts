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
    roster: [],
    startingLineup: [],
    currentLineup: [],
    currentQuarter: 1,
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

  describe('setRoster', () => {
    it('should set roster for a game', async () => {
      const playerIds = ['player-1', 'player-2', 'player-3', 'player-4', 'player-5'];
      const gameWithRoster = { ...mockGame, roster: playerIds };
      mockApiClientPut.mockResolvedValue({ success: true, data: gameWithRoster });

      const result = await gameService.setRoster('game-1', playerIds);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(gameWithRoster);
      expect(mockApiClientPut).toHaveBeenCalledWith('/api/games/game-1/roster', { playerIds });
    });

    it('should handle errors when setting roster', async () => {
      const playerIds = ['player-1', 'player-2'];
      mockApiClientPut.mockResolvedValue({ success: false, error: 'Invalid roster size' });

      const result = await gameService.setRoster('game-1', playerIds);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid roster size');
    });
  });

  describe('setStartingLineup', () => {
    it('should set starting lineup for a game', async () => {
      const playerIds = ['player-1', 'player-2', 'player-3', 'player-4', 'player-5'];
      const gameWithLineup = { ...mockGame, startingLineup: playerIds };
      mockApiClientPut.mockResolvedValue({ success: true, data: gameWithLineup });

      const result = await gameService.setStartingLineup('game-1', playerIds);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(gameWithLineup);
      expect(mockApiClientPut).toHaveBeenCalledWith('/api/games/game-1/starting-lineup', {
        playerIds,
      });
    });

    it('should handle errors when setting starting lineup', async () => {
      const playerIds = ['player-1', 'player-2', 'player-3'];
      mockApiClientPut.mockResolvedValue({
        success: false,
        error: 'Must select exactly 5 players',
      });

      const result = await gameService.setStartingLineup('game-1', playerIds);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Must select exactly 5 players');
    });
  });

  describe('nextQuarter', () => {
    it('should move to next quarter', async () => {
      const gameNextQuarter = { ...mockGame, currentQuarter: 2 };
      mockApiClientPost.mockResolvedValue({ success: true, data: gameNextQuarter });

      const result = await gameService.nextQuarter('game-1');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(gameNextQuarter);
      expect(mockApiClientPost).toHaveBeenCalledWith('/api/games/game-1/next-quarter', {});
    });

    it('should handle errors when moving to next quarter', async () => {
      mockApiClientPost.mockResolvedValue({ success: false, error: 'Already at final quarter' });

      const result = await gameService.nextQuarter('game-1');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Already at final quarter');
    });
  });

  describe('recordSubstitution', () => {
    it('should record a player substitution', async () => {
      const mockSubstitution = {
        id: 'sub-1',
        gameId: 'game-1',
        quarter: 2,
        playerOut: 'player-1',
        playerIn: 'player-6',
        timestamp: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const gameAfterSub = {
        ...mockGame,
        currentLineup: ['player-6', 'player-2', 'player-3', 'player-4', 'player-5'],
      };
      mockApiClientPost.mockResolvedValue({
        success: true,
        data: { game: gameAfterSub, substitution: mockSubstitution },
      });

      const result = await gameService.recordSubstitution('game-1', 'player-1', 'player-6');

      expect(result.success).toBe(true);
      expect(result.data?.game).toEqual(gameAfterSub);
      expect(result.data?.substitution).toEqual(mockSubstitution);
      expect(mockApiClientPost).toHaveBeenCalledWith('/api/games/game-1/substitution', {
        playerOut: 'player-1',
        playerIn: 'player-6',
      });
    });

    it('should handle errors when recording substitution', async () => {
      mockApiClientPost.mockResolvedValue({ success: false, error: 'Player not on court' });

      const result = await gameService.recordSubstitution('game-1', 'player-1', 'player-6');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Player not on court');
    });
  });
});
