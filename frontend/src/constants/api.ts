/**
 * API Configuration
 */

export const API_CONFIG = {
  // Development - Use environment variable or fallback to localhost
  DEV_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',

  // Production
  PROD_URL: 'https://basketball-stats-coach-production.up.railway.app',

  // Get the appropriate URL based on environment
  get BASE_URL() {
    return __DEV__ ? this.DEV_URL : this.PROD_URL;
  },

  // API Endpoints
  ENDPOINTS: {
    // Players
    PLAYERS: '/api/players',
    PLAYER_BY_ID: (id: string) => `/api/players/${id}`,
    PLAYERS_BY_TEAM: (teamId: string) => `/api/players/team/${teamId}`,

    // Teams
    TEAMS: '/api/teams',
    TEAM_BY_ID: (id: string) => `/api/teams/${id}`,

    // Games
    GAMES: '/api/games',
    GAME_BY_ID: (id: string) => `/api/games/${id}`,
    GAMES_BY_TEAM: (teamId: string) => `/api/games/team/${teamId}`,
    GAMES_BY_STATUS: (status: string) => `/api/games/status/${status}`,
    START_GAME: (id: string) => `/api/games/${id}/start`,
    COMPLETE_GAME: (id: string) => `/api/games/${id}/complete`,

    // Stats
    RECORD_ACTION: (gameId: string) => `/api/stats/games/${gameId}/actions`,
    UNDO_ACTION: (gameId: string, playerId: string) =>
      `/api/stats/games/${gameId}/actions/${playerId}`,
    PLAYER_GAME_STATS: (gameId: string, playerId: string) =>
      `/api/stats/games/${gameId}/players/${playerId}`,
    PLAYER_CAREER_STATS: (playerId: string) => `/api/stats/players/${playerId}/career`,

    // Auth
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',

    // Health
    HEALTH: '/health',
  },
} as const;
