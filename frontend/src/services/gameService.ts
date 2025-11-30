/**
 * Game Service
 * Handles all game-related API calls
 */

import { apiClient } from '@/api/client';
import { API_CONFIG } from '@/constants/api';
import type { Game, ApiResponse, GameStatus } from '@/types';

export const gameService = {
  /**
   * Get all games
   */
  async getAll(): Promise<ApiResponse<Game[]>> {
    return apiClient.get<Game[]>(API_CONFIG.ENDPOINTS.GAMES);
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
    return apiClient.put<Game>(API_CONFIG.ENDPOINTS.START_GAME(id), {});
  },

  /**
   * Complete a game
   */
  async complete(id: string): Promise<ApiResponse<Game>> {
    return apiClient.put<Game>(API_CONFIG.ENDPOINTS.COMPLETE_GAME(id), {});
  },
};
