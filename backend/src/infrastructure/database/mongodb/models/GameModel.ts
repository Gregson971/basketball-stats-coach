import mongoose, { Schema } from 'mongoose';
import { GameStatus } from '../../../../domain/entities/Game';

export interface IGameDocument {
  _id: string;
  teamId: string;
  opponent: string;
  gameDate?: Date;
  location?: string;
  notes?: string;
  status: GameStatus;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const GameSchema = new Schema<IGameDocument>(
  {
    _id: { type: String, required: true },
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
  },
  {
    timestamps: true,
    collection: 'games',
  }
);

// Indexes
GameSchema.index({ teamId: 1, gameDate: -1 });
GameSchema.index({ status: 1 });

export const GameModel = mongoose.model<IGameDocument>('Game', GameSchema);
