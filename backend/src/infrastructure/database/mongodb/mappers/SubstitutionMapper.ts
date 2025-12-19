import { Substitution } from '../../../../domain/entities/Substitution';
import { ISubstitutionDocument } from '../models/SubstitutionModel';

export class SubstitutionMapper {
  static toDomain(doc: ISubstitutionDocument): Substitution {
    return new Substitution({
      id: doc._id,
      gameId: doc.gameId,
      quarter: doc.quarter,
      playerOut: doc.playerOut,
      playerIn: doc.playerIn,
      timestamp: doc.timestamp,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toPersistence(substitution: Substitution): Partial<ISubstitutionDocument> {
    return {
      _id: substitution.id,
      gameId: substitution.gameId,
      quarter: substitution.quarter,
      playerOut: substitution.playerOut,
      playerIn: substitution.playerIn,
      timestamp: substitution.timestamp,
      createdAt: substitution.createdAt,
      updatedAt: substitution.updatedAt,
    };
  }
}
