/**
 * Game Store - Zustand
 * Manages the current game state, players, and stats
 */

import { create } from 'zustand';
import type { Game, Player, GameStats } from '../types';

interface GameState {
  // Current game
  currentGame: Game | null;

  // Players in the current game
  players: Player[];

  // Stats for all players in current game
  gameStats: Map<string, GameStats>; // playerId -> GameStats

  // Loading states
  isLoading: boolean;
  error: string | null;

  // Actions
  setCurrentGame: (game: Game | null) => void;
  setPlayers: (players: Player[]) => void;
  updatePlayerStats: (playerId: string, stats: GameStats) => void;
  clearGame: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useGameStore = create<GameState>((set) => ({
  // Initial state
  currentGame: null,
  players: [],
  gameStats: new Map(),
  isLoading: false,
  error: null,

  // Actions
  setCurrentGame: (game) => set({ currentGame: game }),

  setPlayers: (players) => set({ players }),

  updatePlayerStats: (playerId, stats) =>
    set((state) => {
      const newStats = new Map(state.gameStats);
      newStats.set(playerId, stats);
      return { gameStats: newStats };
    }),

  clearGame: () =>
    set({
      currentGame: null,
      players: [],
      gameStats: new Map(),
      error: null,
    }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),
}));
