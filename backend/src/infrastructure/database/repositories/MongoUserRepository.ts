import { User } from '../../../domain/entities/User';
import { IUserRepository } from '../../../domain/repositories/UserRepository';
import { UserModel } from '../mongodb/models/UserModel';
import { UserMapper } from '../mongodb/mappers/UserMapper';

export class MongoUserRepository implements IUserRepository {
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
    const result = await UserModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
}
