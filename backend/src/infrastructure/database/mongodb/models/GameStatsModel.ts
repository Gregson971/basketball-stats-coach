import mongoose, { Schema } from 'mongoose';
import { ActionHistoryItem } from '../../../../domain/entities/GameStats';

export interface IGameStatsDocument {
  _id: string;
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
  minutesPlayed: number;
  actionHistory: ActionHistoryItem[];
  createdAt: Date;
  updatedAt: Date;
}

const ActionHistorySchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: [
      'freeThrow',
      'twoPoint',
      'threePoint',
      'offensiveRebound',
      'defensiveRebound',
      'assist',
      'steal',
      'block',
      'turnover',
      'personalFoul'
    ]
  },
  made: { type: Boolean }
}, { _id: false });

const GameStatsSchema = new Schema<IGameStatsDocument>(
  {
    _id: { type: String, required: true },
    gameId: { type: String, required: true, index: true },
    playerId: { type: String, required: true, index: true },
    freeThrowsMade: { type: Number, default: 0, min: 0 },
    freeThrowsAttempted: { type: Number, default: 0, min: 0 },
    twoPointsMade: { type: Number, default: 0, min: 0 },
    twoPointsAttempted: { type: Number, default: 0, min: 0 },
    threePointsMade: { type: Number, default: 0, min: 0 },
    threePointsAttempted: { type: Number, default: 0, min: 0 },
    offensiveRebounds: { type: Number, default: 0, min: 0 },
    defensiveRebounds: { type: Number, default: 0, min: 0 },
    assists: { type: Number, default: 0, min: 0 },
    steals: { type: Number, default: 0, min: 0 },
    blocks: { type: Number, default: 0, min: 0 },
    turnovers: { type: Number, default: 0, min: 0 },
    personalFouls: { type: Number, default: 0, min: 0 },
    minutesPlayed: { type: Number, default: 0, min: 0 },
    actionHistory: [ActionHistorySchema]
  },
  {
    timestamps: true,
    collection: 'game_stats'
  }
);

// Composite unique index
GameStatsSchema.index({ gameId: 1, playerId: 1 }, { unique: true });
// Index for queries
GameStatsSchema.index({ playerId: 1, gameId: 1 });

export const GameStatsModel = mongoose.model<IGameStatsDocument>('GameStats', GameStatsSchema);
