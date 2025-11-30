import { Game, GameStatus } from '../../../domain/entities/Game';
import { IGameRepository } from '../../../domain/repositories/GameRepository';
import { GameModel } from '../mongodb/models/GameModel';
import { GameMapper } from '../mongodb/mappers/GameMapper';

export class MongoGameRepository implements IGameRepository {
  async findById(id: string): Promise<Game | null> {
    const doc = await GameModel.findById(id).exec();
    return doc ? GameMapper.toDomain(doc) : null;
  }

  async findByTeamId(teamId: string): Promise<Game[]> {
    const docs = await GameModel.find({ teamId }).sort({ gameDate: -1, createdAt: -1 }).exec();
    return docs.map((doc) => GameMapper.toDomain(doc));
  }

  async findAll(): Promise<Game[]> {
    const docs = await GameModel.find().sort({ gameDate: -1, createdAt: -1 }).exec();
    return docs.map((doc) => GameMapper.toDomain(doc));
  }

  async findByStatus(status: GameStatus): Promise<Game[]> {
    const docs = await GameModel.find({ status }).sort({ gameDate: -1, createdAt: -1 }).exec();
    return docs.map((doc) => GameMapper.toDomain(doc));
  }

  async save(game: Game): Promise<Game> {
    const data = GameMapper.toPersistence(game);

    const doc = await GameModel.findByIdAndUpdate(game.id, data, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }).exec();

    if (!doc) {
      throw new Error('Failed to save game');
    }

    return GameMapper.toDomain(doc);
  }

  async delete(id: string): Promise<boolean> {
    const result = await GameModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
}
