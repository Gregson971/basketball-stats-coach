import mongoose, { Schema } from 'mongoose';

export interface IPlayerDocument {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  teamId: string;
  nickname?: string;
  height?: number;
  weight?: number;
  age?: number;
  gender?: 'M' | 'F';
  grade?: string;
  position?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PlayerSchema = new Schema<IPlayerDocument>(
  {
    _id: { type: String, required: true },
    userId: { type: String, required: true, index: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    teamId: { type: String, required: true, index: true },
    nickname: { type: String, trim: true },
    height: { type: Number, min: 0 },
    weight: { type: Number, min: 0 },
    age: { type: Number, min: 5, max: 100 },
    gender: { type: String, enum: ['M', 'F'] },
    grade: { type: String, trim: true },
    position: { type: String, trim: true },
  },
  {
    timestamps: true,
    collection: 'players',
  }
);

// Indexes
PlayerSchema.index({ userId: 1, firstName: 1, lastName: 1 });
PlayerSchema.index({ userId: 1, teamId: 1, lastName: 1 });

export const PlayerModel = mongoose.model<IPlayerDocument>('Player', PlayerSchema);
