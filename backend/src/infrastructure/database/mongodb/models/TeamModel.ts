import mongoose, { Schema } from 'mongoose';

export interface ITeamDocument {
  _id: string;
  name: string;
  coach?: string;
  season?: string;
  league?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TeamSchema = new Schema<ITeamDocument>(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    coach: { type: String, trim: true },
    season: { type: String, trim: true },
    league: { type: String, trim: true },
  },
  {
    timestamps: true,
    collection: 'teams',
  }
);

// Indexes
TeamSchema.index({ name: 1 });

export const TeamModel = mongoose.model<ITeamDocument>('Team', TeamSchema);
