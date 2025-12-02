/**
 * API Client
 * Handles all HTTP requests to the backend
 */

import * as SecureStore from 'expo-secure-store';
import { API_CONFIG } from '../constants/api';
import type { ApiResponse } from '../types';

const TOKEN_KEY = 'auth_token';

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  /**
   * Get authentication headers
   */
  private async getAuthHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token for headers:', error);
    }

    return headers;
  }

  /**
   * Generic GET request
   */
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Request failed',
        };
      }

      return {
        success: true,
        data:
          data.data ||
          data.players ||
          data.player ||
          data.teams ||
          data.team ||
          data.games ||
          data.game ||
          data.gameStats ||
          data.stats ||
          data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  /**
   * Generic POST request
   */
  async post<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Request failed',
        };
      }

      return {
        success: true,
        data:
          data.data ||
          data.players ||
          data.player ||
          data.teams ||
          data.team ||
          data.games ||
          data.game ||
          data.gameStats ||
          data.stats ||
          data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  /**
   * Generic PUT request
   */
  async put<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Request failed',
        };
      }

      return {
        success: true,
        data:
          data.data ||
          data.players ||
          data.player ||
          data.teams ||
          data.team ||
          data.games ||
          data.game ||
          data.gameStats ||
          data.stats ||
          data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  /**
   * Generic DELETE request
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Request failed',
        };
      }

      return {
        success: true,
        data:
          data.data ||
          data.players ||
          data.player ||
          data.teams ||
          data.team ||
          data.games ||
          data.game ||
          data.gameStats ||
          data.stats ||
          data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  /**
   * Check API health
   */
  async healthCheck(): Promise<ApiResponse<{ message: string; timestamp: string }>> {
    return this.get(API_CONFIG.ENDPOINTS.HEALTH);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
