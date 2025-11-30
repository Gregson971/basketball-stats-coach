import { Player } from '../../../../domain/entities/Player';
import { IPlayerDocument } from '../models/PlayerModel';

export class PlayerMapper {
  static toDomain(doc: IPlayerDocument): Player {
    return new Player({
      id: doc._id,
      firstName: doc.firstName,
      lastName: doc.lastName,
      teamId: doc.teamId,
      nickname: doc.nickname,
      height: doc.height,
      weight: doc.weight,
      age: doc.age,
      gender: doc.gender,
      grade: doc.grade,
      position: doc.position,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toPersistence(player: Player): Partial<IPlayerDocument> {
    return {
      _id: player.id,
      firstName: player.firstName,
      lastName: player.lastName,
      teamId: player.teamId,
      nickname: player.nickname || undefined,
      height: player.height || undefined,
      weight: player.weight || undefined,
      age: player.age || undefined,
      gender: player.gender || undefined,
      grade: player.grade || undefined,
      position: player.position || undefined,
      createdAt: player.createdAt,
      updatedAt: player.updatedAt,
    };
  }
}
