/**
 * Stats Service
 * Handles all stats-related API calls
 */

import { apiClient } from '@/api/client';
import { API_CONFIG } from '@/constants/api';
import type { GameStats, CareerStats, ApiResponse, RecordActionPayload } from '@/types';

export const statsService = {
  /**
   * Record a game action (shot, rebound, assist, etc.)
   */
  async recordAction(payload: RecordActionPayload): Promise<ApiResponse<GameStats>> {
    return apiClient.post<GameStats>(
      API_CONFIG.ENDPOINTS.RECORD_ACTION(payload.gameId),
      payload
    );
  },

  /**
   * Undo the last action for a player in a game
   */
  async undoLastAction(gameId: string, playerId: string): Promise<ApiResponse<GameStats>> {
    return apiClient.delete<GameStats>(API_CONFIG.ENDPOINTS.UNDO_ACTION(gameId, playerId));
  },

  /**
   * Get player stats for a specific game
   */
  async getPlayerGameStats(gameId: string, playerId: string): Promise<ApiResponse<GameStats>> {
    return apiClient.get<GameStats>(API_CONFIG.ENDPOINTS.PLAYER_GAME_STATS(gameId, playerId));
  },

  /**
   * Get player career stats
   */
  async getPlayerCareerStats(playerId: string): Promise<ApiResponse<CareerStats>> {
    return apiClient.get<CareerStats>(API_CONFIG.ENDPOINTS.PLAYER_CAREER_STATS(playerId));
  },
};
