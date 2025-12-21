import { Player } from '../../../domain/entities/Player';
import { IPlayerRepository } from '../../../domain/repositories/PlayerRepository';
import { PlayerModel } from '../mongodb/models/PlayerModel';
import { PlayerMapper } from '../mongodb/mappers/PlayerMapper';

export class MongoPlayerRepository implements IPlayerRepository {
  async findById(id: string, userId: string): Promise<Player | null> {
    const doc = await PlayerModel.findOne({ _id: id, userId }).exec();
    return doc ? PlayerMapper.toDomain(doc) : null;
  }

  async findByTeamId(teamId: string, userId: string): Promise<Player[]> {
    const docs = await PlayerModel.find({ teamId, userId })
      .sort({ lastName: 1, firstName: 1 })
      .exec();
    return docs.map((doc) => PlayerMapper.toDomain(doc));
  }

  async findByUserId(userId: string): Promise<Player[]> {
    const docs = await PlayerModel.find({ userId }).sort({ lastName: 1, firstName: 1 }).exec();
    return docs.map((doc) => PlayerMapper.toDomain(doc));
  }

  async save(player: Player): Promise<Player> {
    const data = PlayerMapper.toPersistence(player);

    const doc = await PlayerModel.findOneAndUpdate(
      { _id: player.id, userId: player.userId },
      data,
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    ).exec();

    if (!doc) {
      throw new Error('Failed to save player');
    }

    return PlayerMapper.toDomain(doc);
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const result = await PlayerModel.findOneAndDelete({ _id: id, userId }).exec();
    return result !== null;
  }

  async searchByName(query: string, userId: string): Promise<Player[]> {
    const regex = new RegExp(query, 'i');
    const docs = await PlayerModel.find({
      userId,
      $or: [{ firstName: regex }, { lastName: regex }, { nickname: regex }],
    })
      .sort({ lastName: 1, firstName: 1 })
      .exec();

    return docs.map((doc) => PlayerMapper.toDomain(doc));
  }

  async deleteByUserId(userId: string): Promise<number> {
    const result = await PlayerModel.deleteMany({ userId }).exec();
    return result.deletedCount || 0;
  }
}
