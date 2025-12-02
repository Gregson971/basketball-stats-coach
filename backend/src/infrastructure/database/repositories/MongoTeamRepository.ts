import { Team } from '../../../domain/entities/Team';
import { ITeamRepository } from '../../../domain/repositories/TeamRepository';
import { TeamModel } from '../mongodb/models/TeamModel';
import { TeamMapper } from '../mongodb/mappers/TeamMapper';

export class MongoTeamRepository implements ITeamRepository {
  async findById(id: string, userId: string): Promise<Team | null> {
    const doc = await TeamModel.findOne({ _id: id, userId }).exec();
    return doc ? TeamMapper.toDomain(doc) : null;
  }

  async findAll(userId: string): Promise<Team[]> {
    const docs = await TeamModel.find({ userId }).sort({ name: 1 }).exec();
    return docs.map((doc) => TeamMapper.toDomain(doc));
  }

  async findByUserId(userId: string): Promise<Team[]> {
    const docs = await TeamModel.find({ userId }).sort({ name: 1 }).exec();
    return docs.map((doc) => TeamMapper.toDomain(doc));
  }

  async save(team: Team): Promise<Team> {
    const data = TeamMapper.toPersistence(team);

    const doc = await TeamModel.findOneAndUpdate({ _id: team.id, userId: team.userId }, data, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }).exec();

    if (!doc) {
      throw new Error('Failed to save team');
    }

    return TeamMapper.toDomain(doc);
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const result = await TeamModel.findOneAndDelete({ _id: id, userId }).exec();
    return result !== null;
  }

  async searchByName(query: string, userId: string): Promise<Team[]> {
    const regex = new RegExp(query, 'i');
    const docs = await TeamModel.find({
      userId,
      name: regex,
    })
      .sort({ name: 1 })
      .exec();

    return docs.map((doc) => TeamMapper.toDomain(doc));
  }

  async deleteByUserId(userId: string): Promise<number> {
    const result = await TeamModel.deleteMany({ userId }).exec();
    return result.deletedCount || 0;
  }
}
