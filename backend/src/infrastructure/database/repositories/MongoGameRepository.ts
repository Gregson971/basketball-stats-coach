import { Game, GameStatus } from '../../../domain/entities/Game';
import { IGameRepository } from '../../../domain/repositories/GameRepository';
import { GameModel } from '../mongodb/models/GameModel';
import { GameMapper } from '../mongodb/mappers/GameMapper';

export class MongoGameRepository implements IGameRepository {
  async findById(id: string, userId: string): Promise<Game | null> {
    const doc = await GameModel.findOne({ _id: id, userId }).exec();
    return doc ? GameMapper.toDomain(doc) : null;
  }

  async findByTeamId(teamId: string, userId: string): Promise<Game[]> {
    const docs = await GameModel.find({ teamId, userId })
      .sort({ gameDate: -1, createdAt: -1 })
      .exec();
    return docs.map((doc) => GameMapper.toDomain(doc));
  }

  async findAll(userId: string): Promise<Game[]> {
    const docs = await GameModel.find({ userId }).sort({ gameDate: -1, createdAt: -1 }).exec();
    return docs.map((doc) => GameMapper.toDomain(doc));
  }

  async findByStatus(status: GameStatus, userId: string): Promise<Game[]> {
    const docs = await GameModel.find({ status, userId })
      .sort({ gameDate: -1, createdAt: -1 })
      .exec();
    return docs.map((doc) => GameMapper.toDomain(doc));
  }

  async findByUserId(userId: string): Promise<Game[]> {
    const docs = await GameModel.find({ userId }).sort({ gameDate: -1, createdAt: -1 }).exec();
    return docs.map((doc) => GameMapper.toDomain(doc));
  }

  async save(game: Game): Promise<Game> {
    const data = GameMapper.toPersistence(game);

    const doc = await GameModel.findOneAndUpdate({ _id: game.id, userId: game.userId }, data, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }).exec();

    if (!doc) {
      throw new Error('Failed to save game');
    }

    return GameMapper.toDomain(doc);
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const result = await GameModel.findOneAndDelete({ _id: id, userId }).exec();
    return result !== null;
  }

  async deleteByUserId(userId: string): Promise<number> {
    const result = await GameModel.deleteMany({ userId }).exec();
    return result.deletedCount || 0;
  }
}
