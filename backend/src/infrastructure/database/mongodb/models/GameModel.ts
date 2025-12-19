import mongoose, { Schema } from 'mongoose';
import { GameStatus } from '../../../../domain/entities/Game';

export interface IGameDocument {
  _id: string;
  userId: string;
  teamId: string;
  opponent: string;
  gameDate?: Date;
  location?: string;
  notes?: string;
  status: GameStatus;
  startedAt?: Date;
  completedAt?: Date;
  currentQuarter: number;
  roster: string[];
  startingLineup: string[];
  currentLineup: string[];
  createdAt: Date;
  updatedAt: Date;
}

const GameSchema = new Schema<IGameDocument>(
  {
    _id: { type: String, required: true },
    userId: { type: String, required: true, index: true },
    teamId: { type: String, required: true, index: true },
    opponent: { type: String, required: true, trim: true },
    gameDate: { type: Date },
    location: { type: String, trim: true },
    notes: { type: String, trim: true },
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed'],
      default: 'not_started',
      required: true,
    },
    startedAt: { type: Date },
    completedAt: { type: Date },
    currentQuarter: { type: Number, default: 1, min: 1, max: 4 },
    roster: [{ type: String }],
    startingLineup: [{ type: String }],
    currentLineup: [{ type: String }],
  },
  {
    timestamps: true,
    collection: 'games',
  }
);

// Indexes
GameSchema.index({ userId: 1, teamId: 1, gameDate: -1 });
GameSchema.index({ userId: 1, status: 1 });

export const GameModel = mongoose.model<IGameDocument>('Game', GameSchema);
