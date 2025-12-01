/**
 * Game Service
 * Handles all game-related API calls
 */

import { apiClient } from '@/api/client';
import { API_CONFIG } from '@/constants/api';
import type { Game, ApiResponse, GameStatus } from '@/types';

export const gameService = {
  /**
   * Get all games (combines all statuses)
   */
  async getAll(): Promise<ApiResponse<Game[]>> {
    try {
      // Récupérer les matchs de tous les statuts
      const [notStarted, inProgress, completed] = await Promise.all([
        apiClient.get<Game[]>(API_CONFIG.ENDPOINTS.GAMES_BY_STATUS('not_started')),
        apiClient.get<Game[]>(API_CONFIG.ENDPOINTS.GAMES_BY_STATUS('in_progress')),
        apiClient.get<Game[]>(API_CONFIG.ENDPOINTS.GAMES_BY_STATUS('completed')),
      ]);

      const allGames: Game[] = [];
      if (notStarted.success && notStarted.data) allGames.push(...notStarted.data);
      if (inProgress.success && inProgress.data) allGames.push(...inProgress.data);
      if (completed.success && completed.data) allGames.push(...completed.data);

      return {
        success: true,
        data: allGames,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch games',
      };
    }
  },

  /**
   * Get a single game by ID
   */
  async getById(id: string): Promise<ApiResponse<Game>> {
    return apiClient.get<Game>(API_CONFIG.ENDPOINTS.GAME_BY_ID(id));
  },

  /**
   * Get games by team ID
   */
  async getByTeam(teamId: string): Promise<ApiResponse<Game[]>> {
    return apiClient.get<Game[]>(API_CONFIG.ENDPOINTS.GAMES_BY_TEAM(teamId));
  },

  /**
   * Get games by status
   */
  async getByStatus(status: GameStatus): Promise<ApiResponse<Game[]>> {
    return apiClient.get<Game[]>(API_CONFIG.ENDPOINTS.GAMES_BY_STATUS(status));
  },

  /**
   * Create a new game
   */
  async create(data: Partial<Game>): Promise<ApiResponse<Game>> {
    return apiClient.post<Game>(API_CONFIG.ENDPOINTS.GAMES, data);
  },

  /**
   * Update a game
   */
  async update(id: string, data: Partial<Game>): Promise<ApiResponse<Game>> {
    return apiClient.put<Game>(API_CONFIG.ENDPOINTS.GAME_BY_ID(id), data);
  },

  /**
   * Delete a game
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(API_CONFIG.ENDPOINTS.GAME_BY_ID(id));
  },

  /**
   * Start a game
   */
  async start(id: string): Promise<ApiResponse<Game>> {
    return apiClient.post<Game>(API_CONFIG.ENDPOINTS.START_GAME(id), {});
  },

  /**
   * Complete a game
   */
  async complete(id: string): Promise<ApiResponse<Game>> {
    return apiClient.post<Game>(API_CONFIG.ENDPOINTS.COMPLETE_GAME(id), {});
  },
};
