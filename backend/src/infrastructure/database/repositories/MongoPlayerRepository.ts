import { Player } from '../../../domain/entities/Player';
import { IPlayerRepository } from '../../../domain/repositories/PlayerRepository';
import { PlayerModel } from '../mongodb/models/PlayerModel';
import { PlayerMapper } from '../mongodb/mappers/PlayerMapper';

export class MongoPlayerRepository implements IPlayerRepository {
  async findById(id: string): Promise<Player | null> {
    const doc = await PlayerModel.findById(id).exec();
    return doc ? PlayerMapper.toDomain(doc) : null;
  }

  async findByTeamId(teamId: string): Promise<Player[]> {
    const docs = await PlayerModel.find({ teamId }).sort({ lastName: 1, firstName: 1 }).exec();
    return docs.map((doc) => PlayerMapper.toDomain(doc));
  }

  async findAll(): Promise<Player[]> {
    const docs = await PlayerModel.find().sort({ lastName: 1, firstName: 1 }).exec();
    return docs.map((doc) => PlayerMapper.toDomain(doc));
  }

  async save(player: Player): Promise<Player> {
    const data = PlayerMapper.toPersistence(player);

    const doc = await PlayerModel.findByIdAndUpdate(player.id, data, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }).exec();

    if (!doc) {
      throw new Error('Failed to save player');
    }

    return PlayerMapper.toDomain(doc);
  }

  async delete(id: string): Promise<boolean> {
    const result = await PlayerModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async searchByName(query: string): Promise<Player[]> {
    const regex = new RegExp(query, 'i');
    const docs = await PlayerModel.find({
      $or: [{ firstName: regex }, { lastName: regex }, { nickname: regex }],
    })
      .sort({ lastName: 1, firstName: 1 })
      .exec();

    return docs.map((doc) => PlayerMapper.toDomain(doc));
  }
}
