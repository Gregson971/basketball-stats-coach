import { User } from '../../../../domain/entities/User';
import { IUserDocument } from '../models/UserModel';

export class UserMapper {
  static toDomain(doc: IUserDocument): User {
    return new User({
      id: doc._id,
      email: doc.email,
      password: doc.password,
      name: doc.name,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toPersistence(user: User): Partial<IUserDocument> {
    const userData = user.toJSONWithPassword();
    return {
      _id: userData.id,
      email: userData.email,
      password: userData.password,
      name: userData.name,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    };
  }
}
