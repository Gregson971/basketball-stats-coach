import mongoose, { Schema } from 'mongoose';

export interface ISubstitutionDocument {
  _id: string;
  gameId: string;
  quarter: number;
  playerOut: string;
  playerIn: string;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SubstitutionSchema = new Schema<ISubstitutionDocument>(
  {
    _id: { type: String, required: true },
    gameId: { type: String, required: true, index: true },
    quarter: { type: Number, required: true, min: 1, max: 4 },
    playerOut: { type: String, required: true },
    playerIn: { type: String, required: true },
    timestamp: { type: Date, required: true },
  },
  {
    timestamps: true,
    collection: 'substitutions',
  }
);

// Indexes
SubstitutionSchema.index({ gameId: 1, timestamp: 1 });
SubstitutionSchema.index({ gameId: 1, quarter: 1 });

export const SubstitutionModel = mongoose.model<ISubstitutionDocument>(
  'Substitution',
  SubstitutionSchema
);
