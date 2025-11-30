/**
 * Team Service
 * Handles all team-related API calls
 */

import { apiClient } from '@/api/client';
import { API_CONFIG } from '@/constants/api';
import type { Team, ApiResponse } from '@/types';

export const teamService = {
  /**
   * Get all teams
   */
  async getAll(): Promise<ApiResponse<Team[]>> {
    return apiClient.get<Team[]>(API_CONFIG.ENDPOINTS.TEAMS);
  },

  /**
   * Get a single team by ID
   */
  async getById(id: string): Promise<ApiResponse<Team>> {
    return apiClient.get<Team>(API_CONFIG.ENDPOINTS.TEAM_BY_ID(id));
  },

  /**
   * Create a new team
   */
  async create(data: Partial<Team>): Promise<ApiResponse<Team>> {
    return apiClient.post<Team>(API_CONFIG.ENDPOINTS.TEAMS, data);
  },

  /**
   * Update a team
   */
  async update(id: string, data: Partial<Team>): Promise<ApiResponse<Team>> {
    return apiClient.put<Team>(API_CONFIG.ENDPOINTS.TEAM_BY_ID(id), data);
  },

  /**
   * Delete a team
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(API_CONFIG.ENDPOINTS.TEAM_BY_ID(id));
  },
};
