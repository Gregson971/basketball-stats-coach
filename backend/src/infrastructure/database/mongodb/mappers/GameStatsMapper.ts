import { GameStats } from '../../../../domain/entities/GameStats';
import { IGameStatsDocument } from '../models/GameStatsModel';

export class GameStatsMapper {
  static toDomain(doc: IGameStatsDocument): GameStats {
    return new GameStats({
      id: doc._id,
      gameId: doc.gameId,
      playerId: doc.playerId,
      freeThrowsMade: doc.freeThrowsMade,
      freeThrowsAttempted: doc.freeThrowsAttempted,
      twoPointsMade: doc.twoPointsMade,
      twoPointsAttempted: doc.twoPointsAttempted,
      threePointsMade: doc.threePointsMade,
      threePointsAttempted: doc.threePointsAttempted,
      offensiveRebounds: doc.offensiveRebounds,
      defensiveRebounds: doc.defensiveRebounds,
      assists: doc.assists,
      steals: doc.steals,
      blocks: doc.blocks,
      turnovers: doc.turnovers,
      personalFouls: doc.personalFouls,
      minutesPlayed: doc.minutesPlayed,
      actionHistory: doc.actionHistory,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toPersistence(gameStats: GameStats): Partial<IGameStatsDocument> {
    return {
      _id: gameStats.id,
      gameId: gameStats.gameId,
      playerId: gameStats.playerId,
      freeThrowsMade: gameStats.freeThrowsMade,
      freeThrowsAttempted: gameStats.freeThrowsAttempted,
      twoPointsMade: gameStats.twoPointsMade,
      twoPointsAttempted: gameStats.twoPointsAttempted,
      threePointsMade: gameStats.threePointsMade,
      threePointsAttempted: gameStats.threePointsAttempted,
      offensiveRebounds: gameStats.offensiveRebounds,
      defensiveRebounds: gameStats.defensiveRebounds,
      assists: gameStats.assists,
      steals: gameStats.steals,
      blocks: gameStats.blocks,
      turnovers: gameStats.turnovers,
      personalFouls: gameStats.personalFouls,
      minutesPlayed: gameStats.minutesPlayed,
      actionHistory: gameStats.actionHistory,
      createdAt: gameStats.createdAt,
      updatedAt: gameStats.updatedAt,
    };
  }
}
