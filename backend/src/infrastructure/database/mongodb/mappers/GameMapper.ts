import { Game } from '../../../../domain/entities/Game';
import { IGameDocument } from '../models/GameModel';

export class GameMapper {
  static toDomain(doc: IGameDocument): Game {
    return new Game({
      id: doc._id,
      teamId: doc.teamId,
      opponent: doc.opponent,
      gameDate: doc.gameDate,
      location: doc.location,
      notes: doc.notes,
      status: doc.status,
      startedAt: doc.startedAt,
      completedAt: doc.completedAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    });
  }

  static toPersistence(game: Game): Partial<IGameDocument> {
    return {
      _id: game.id,
      teamId: game.teamId,
      opponent: game.opponent,
      gameDate: game.gameDate || undefined,
      location: game.location || undefined,
      notes: game.notes || undefined,
      status: game.status,
      startedAt: game.startedAt || undefined,
      completedAt: game.completedAt || undefined,
      createdAt: game.createdAt,
      updatedAt: game.updatedAt
    };
  }
}
