import { Substitution } from '../../../domain/entities/Substitution';
import { ISubstitutionRepository } from '../../../domain/repositories/SubstitutionRepository';
import { SubstitutionModel } from '../mongodb/models/SubstitutionModel';
import { SubstitutionMapper } from '../mongodb/mappers/SubstitutionMapper';

export class MongoSubstitutionRepository implements ISubstitutionRepository {
  async findById(id: string, userId: string): Promise<Substitution | null> {
    // Need to join with games to filter by userId
    const doc = await SubstitutionModel.findOne({ _id: id }).exec();
    if (!doc) return null;

    // Verify the substitution belongs to a game owned by the user
    const GameModel = require('../mongodb/models/GameModel').GameModel;
    const game = await GameModel.findOne({ _id: doc.gameId, userId }).exec();
    if (!game) return null;

    return SubstitutionMapper.toDomain(doc);
  }

  async findByGameId(gameId: string, userId: string): Promise<Substitution[]> {
    // Verify the game belongs to the user
    const GameModel = require('../mongodb/models/GameModel').GameModel;
    const game = await GameModel.findOne({ _id: gameId, userId }).exec();
    if (!game) return [];

    const docs = await SubstitutionModel.find({ gameId })
      .sort({ timestamp: 1 })
      .exec();

    return docs.map((doc) => SubstitutionMapper.toDomain(doc));
  }

  async findByUserId(userId: string): Promise<Substitution[]> {
    // Get all games for this user
    const GameModel = require('../mongodb/models/GameModel').GameModel;
    const games = await GameModel.find({ userId }).select('_id').exec();
    const gameIds = games.map((g) => g._id);

    const docs = await SubstitutionModel.find({ gameId: { $in: gameIds } })
      .sort({ timestamp: 1 })
      .exec();

    return docs.map((doc) => SubstitutionMapper.toDomain(doc));
  }

  async save(substitution: Substitution): Promise<Substitution> {
    const data = SubstitutionMapper.toPersistence(substitution);

    const doc = await SubstitutionModel.findByIdAndUpdate(
      substitution.id,
      data,
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    ).exec();

    if (!doc) {
      throw new Error('Failed to save substitution');
    }

    return SubstitutionMapper.toDomain(doc);
  }

  async delete(id: string, userId: string): Promise<boolean> {
    // Verify ownership through game
    const doc = await SubstitutionModel.findById(id).exec();
    if (!doc) return false;

    const GameModel = require('../mongodb/models/GameModel').GameModel;
    const game = await GameModel.findOne({ _id: doc.gameId, userId }).exec();
    if (!game) return false;

    const result = await SubstitutionModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async deleteByUserId(userId: string): Promise<number> {
    // Get all games for this user
    const GameModel = require('../mongodb/models/GameModel').GameModel;
    const games = await GameModel.find({ userId }).select('_id').exec();
    const gameIds = games.map((g) => g._id);

    const result = await SubstitutionModel.deleteMany({ gameId: { $in: gameIds } }).exec();
    return result.deletedCount || 0;
  }

  async deleteByGameId(gameId: string, userId: string): Promise<number> {
    // Verify game ownership
    const GameModel = require('../mongodb/models/GameModel').GameModel;
    const game = await GameModel.findOne({ _id: gameId, userId }).exec();
    if (!game) return 0;

    const result = await SubstitutionModel.deleteMany({ gameId }).exec();
    return result.deletedCount || 0;
  }
}
