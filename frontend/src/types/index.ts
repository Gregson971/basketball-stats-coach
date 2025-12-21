/**
 * Type definitions for the application
 * These should match the backend DTOs
 */

export type Position = 'Guard' | 'Forward' | 'Center';
export type Gender = 'M' | 'F';
export type GameStatus = 'not_started' | 'in_progress' | 'completed';

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  teamId: string;
  nickname?: string;
  position?: Position;
  height?: number; // cm
  weight?: number; // kg
  age?: number;
  gender?: Gender;
  grade?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Team {
  id: string;
  name: string;
  coach?: string;
  season?: string;
  league?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Game {
  id: string;
  teamId: string;
  opponent: string;
  gameDate?: Date;
  location?: string;
  notes?: string;
  status: GameStatus;
  roster: string[]; // Player IDs (5-15 players)
  startingLineup: string[]; // Player IDs (exactly 5 players)
  currentLineup: string[]; // Player IDs currently on court (exactly 5 players)
  currentQuarter: number; // 1-4
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Substitution {
  id: string;
  gameId: string;
  quarter: number; // 1-4
  playerOut: string; // Player ID leaving the court
  playerIn: string; // Player ID entering the court
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface GameStats {
  gameId: string;
  playerId: string;
  freeThrowsMade: number;
  freeThrowsAttempted: number;
  twoPointsMade: number;
  twoPointsAttempted: number;
  threePointsMade: number;
  threePointsAttempted: number;
  offensiveRebounds: number;
  defensiveRebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  personalFouls: number;
}

export interface CareerStats {
  playerId: string;
  gamesPlayed: number;
  totalPoints: number;
  totalRebounds: number;
  totalAssists: number;
  averagePoints: number;
  averageRebounds: number;
  averageAssists: number;
  fieldGoalPercentage: number;
  freeThrowPercentage: number;
  threePointPercentage: number;
}

export type ActionType =
  | 'freeThrow'
  | 'twoPoint'
  | 'threePoint'
  | 'offensiveRebound'
  | 'defensiveRebound'
  | 'assist'
  | 'steal'
  | 'block'
  | 'turnover'
  | 'personalFoul';

export interface RecordActionPayload {
  gameId: string;
  playerId: string;
  actionType: ActionType;
  made?: boolean; // For shots only
}

// User & Auth types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
