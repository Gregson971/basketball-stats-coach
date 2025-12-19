import { Game } from '../../../../domain/entities/Game';
import { IGameDocument } from '../models/GameModel';

export class GameMapper {
  static toDomain(doc: IGameDocument): Game {
    return new Game({
      id: doc._id,
      userId: doc.userId,
      teamId: doc.teamId,
      opponent: doc.opponent,
      gameDate: doc.gameDate,
      location: doc.location,
      notes: doc.notes,
      status: doc.status,
      startedAt: doc.startedAt,
      completedAt: doc.completedAt,
      currentQuarter: doc.currentQuarter,
      roster: doc.roster,
      startingLineup: doc.startingLineup,
      currentLineup: doc.currentLineup,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toPersistence(game: Game): Partial<IGameDocument> {
    return {
      _id: game.id,
      userId: game.userId,
      teamId: game.teamId,
      opponent: game.opponent,
      gameDate: game.gameDate || undefined,
      location: game.location || undefined,
      notes: game.notes || undefined,
      status: game.status,
      startedAt: game.startedAt || undefined,
      completedAt: game.completedAt || undefined,
      currentQuarter: game.currentQuarter,
      roster: game.roster,
      startingLineup: game.startingLineup,
      currentLineup: game.currentLineup,
      createdAt: game.createdAt,
      updatedAt: game.updatedAt,
    };
  }
}
