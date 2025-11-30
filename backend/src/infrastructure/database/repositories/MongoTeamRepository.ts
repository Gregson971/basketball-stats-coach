import { Team } from '../../../domain/entities/Team';
import { ITeamRepository } from '../../../domain/repositories/TeamRepository';
import { TeamModel } from '../mongodb/models/TeamModel';
import { TeamMapper } from '../mongodb/mappers/TeamMapper';

export class MongoTeamRepository implements ITeamRepository {
  async findById(id: string): Promise<Team | null> {
    const doc = await TeamModel.findById(id).exec();
    return doc ? TeamMapper.toDomain(doc) : null;
  }

  async findAll(): Promise<Team[]> {
    const docs = await TeamModel.find().sort({ name: 1 }).exec();
    return docs.map((doc) => TeamMapper.toDomain(doc));
  }

  async save(team: Team): Promise<Team> {
    const data = TeamMapper.toPersistence(team);

    const doc = await TeamModel.findByIdAndUpdate(team.id, data, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }).exec();

    if (!doc) {
      throw new Error('Failed to save team');
    }

    return TeamMapper.toDomain(doc);
  }

  async delete(id: string): Promise<boolean> {
    const result = await TeamModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async searchByName(query: string): Promise<Team[]> {
    const regex = new RegExp(query, 'i');
    const docs = await TeamModel.find({
      name: regex,
    })
      .sort({ name: 1 })
      .exec();

    return docs.map((doc) => TeamMapper.toDomain(doc));
  }
}
