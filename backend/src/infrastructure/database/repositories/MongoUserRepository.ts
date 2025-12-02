import { User } from '../../../domain/entities/User';
import { IUserRepository } from '../../../domain/repositories/UserRepository';
import { IPlayerRepository } from '../../../domain/repositories/PlayerRepository';
import { ITeamRepository } from '../../../domain/repositories/TeamRepository';
import { IGameRepository } from '../../../domain/repositories/GameRepository';
import { IGameStatsRepository } from '../../../domain/repositories/GameStatsRepository';
import { UserModel } from '../mongodb/models/UserModel';
import { UserMapper } from '../mongodb/mappers/UserMapper';

export class MongoUserRepository implements IUserRepository {
  constructor(
    private readonly playerRepository?: IPlayerRepository,
    private readonly teamRepository?: ITeamRepository,
    private readonly gameRepository?: IGameRepository,
    private readonly gameStatsRepository?: IGameStatsRepository
  ) {}
  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findById(id).exec();
    return doc ? UserMapper.toDomain(doc) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email: email.toLowerCase() }).exec();
    return doc ? UserMapper.toDomain(doc) : null;
  }

  async findAll(): Promise<User[]> {
    const docs = await UserModel.find().sort({ name: 1 }).exec();
    return docs.map((doc) => UserMapper.toDomain(doc));
  }

  async save(user: User): Promise<User> {
    const data = UserMapper.toPersistence(user);

    const doc = await UserModel.findByIdAndUpdate(user.id, data, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }).exec();

    if (!doc) {
      throw new Error('Failed to save user');
    }

    return UserMapper.toDomain(doc);
  }

  async delete(id: string): Promise<boolean> {
    // Cascade delete all related entities
    // Order matters: delete child entities before parent entities

    // 1. Delete all game stats for this user
    if (this.gameStatsRepository) {
      await this.gameStatsRepository.deleteByUserId(id);
    }

    // 2. Delete all games for this user
    if (this.gameRepository) {
      await this.gameRepository.deleteByUserId(id);
    }

    // 3. Delete all players for this user
    if (this.playerRepository) {
      await this.playerRepository.deleteByUserId(id);
    }

    // 4. Delete all teams for this user
    if (this.teamRepository) {
      await this.teamRepository.deleteByUserId(id);
    }

    // 5. Finally, delete the user
    const result = await UserModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
}
