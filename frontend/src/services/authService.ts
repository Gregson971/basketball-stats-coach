/**
 * Authentication Service
 * Handles user authentication, token management, and secure storage
 */

import * as SecureStore from 'expo-secure-store';
import { apiClient } from '@/api/client';
import { API_CONFIG } from '@/constants/api';
import type { User, RegisterPayload, LoginPayload, AuthResponse, ApiResponse } from '@/types';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const authService = {
  /**
   * Register a new user
   */
  async register(data: RegisterPayload): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiClient.post<{ user: User; token: string }>(
        API_CONFIG.ENDPOINTS.REGISTER,
        data
      );

      if (response.success && response.data) {
        // Store token and user data securely
        await this.setToken(response.data.token);
        await this.setUser(response.data.user);

        return {
          success: true,
          data: response.data as AuthResponse,
        };
      }

      return response as ApiResponse<AuthResponse>;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      };
    }
  },

  /**
   * Login an existing user
   */
  async login(data: LoginPayload): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiClient.post<{ user: User; token: string }>(
        API_CONFIG.ENDPOINTS.LOGIN,
        data
      );

      if (response.success && response.data) {
        // Store token and user data securely
        await this.setToken(response.data.token);
        await this.setUser(response.data.user);

        return {
          success: true,
          data: response.data as AuthResponse,
        };
      }

      return response as ApiResponse<AuthResponse>;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed',
      };
    }
  },

  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
  },

  /**
   * Get the stored authentication token
   */
  async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  /**
   * Set the authentication token
   */
  async setToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (error) {
      console.error('Error setting token:', error);
      throw error;
    }
  },

  /**
   * Get the stored user data
   */
  async getUser(): Promise<User | null> {
    try {
      const userJson = await SecureStore.getItemAsync(USER_KEY);
      if (!userJson) return null;

      return JSON.parse(userJson) as User;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  /**
   * Set the user data
   */
  async setUser(user: User): Promise<void> {
    try {
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error setting user:', error);
      throw error;
    }
  },

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  },

  /**
   * Get current session (user + token)
   */
  async getSession(): Promise<{ user: User; token: string } | null> {
    const token = await this.getToken();
    const user = await this.getUser();

    if (!token || !user) {
      return null;
    }

    return { user, token };
  },
};
