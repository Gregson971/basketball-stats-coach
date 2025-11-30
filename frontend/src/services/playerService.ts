/**
 * Player Service
 * Handles all player-related API calls
 */

import { apiClient } from '@/api/client';
import { API_CONFIG } from '@/constants/api';
import type { Player, ApiResponse } from '@/types';

export const playerService = {
  /**
   * Get all players
   */
  async getAll(): Promise<ApiResponse<Player[]>> {
    return apiClient.get<Player[]>(API_CONFIG.ENDPOINTS.PLAYERS);
  },

  /**
   * Get a single player by ID
   */
  async getById(id: string): Promise<ApiResponse<Player>> {
    return apiClient.get<Player>(API_CONFIG.ENDPOINTS.PLAYER_BY_ID(id));
  },

  /**
   * Get players by team ID
   */
  async getByTeam(teamId: string): Promise<ApiResponse<Player[]>> {
    return apiClient.get<Player[]>(API_CONFIG.ENDPOINTS.PLAYERS_BY_TEAM(teamId));
  },

  /**
   * Create a new player
   */
  async create(data: Partial<Player>): Promise<ApiResponse<Player>> {
    return apiClient.post<Player>(API_CONFIG.ENDPOINTS.PLAYERS, data);
  },

  /**
   * Update a player
   */
  async update(id: string, data: Partial<Player>): Promise<ApiResponse<Player>> {
    return apiClient.put<Player>(API_CONFIG.ENDPOINTS.PLAYER_BY_ID(id), data);
  },

  /**
   * Delete a player
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(API_CONFIG.ENDPOINTS.PLAYER_BY_ID(id));
  },
};
