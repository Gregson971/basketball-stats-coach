import { GameStats } from '../../../domain/entities/GameStats';
import {
  IGameStatsRepository,
  PlayerAggregateStats,
} from '../../../domain/repositories/GameStatsRepository';
import { GameStatsModel } from '../mongodb/models/GameStatsModel';
import { GameStatsMapper } from '../mongodb/mappers/GameStatsMapper';

export class MongoGameStatsRepository implements IGameStatsRepository {
  async findById(id: string, userId: string): Promise<GameStats | null> {
    const doc = await GameStatsModel.findOne({ _id: id, userId }).exec();
    return doc ? GameStatsMapper.toDomain(doc) : null;
  }

  async findByGameId(gameId: string, userId: string): Promise<GameStats[]> {
    const docs = await GameStatsModel.find({ gameId, userId }).exec();
    return docs.map((doc) => GameStatsMapper.toDomain(doc));
  }

  async findByPlayerId(playerId: string, userId: string): Promise<GameStats[]> {
    const docs = await GameStatsModel.find({ playerId, userId }).sort({ createdAt: -1 }).exec();
    return docs.map((doc) => GameStatsMapper.toDomain(doc));
  }

  async findByGameAndPlayer(gameId: string, playerId: string, userId: string): Promise<GameStats | null> {
    const doc = await GameStatsModel.findOne({ gameId, playerId, userId }).exec();
    return doc ? GameStatsMapper.toDomain(doc) : null;
  }

  async findByUserId(userId: string): Promise<GameStats[]> {
    const docs = await GameStatsModel.find({ userId }).sort({ createdAt: -1 }).exec();
    return docs.map((doc) => GameStatsMapper.toDomain(doc));
  }

  async save(gameStats: GameStats): Promise<GameStats> {
    const data = GameStatsMapper.toPersistence(gameStats);

    const doc = await GameStatsModel.findOneAndUpdate(
      { _id: gameStats.id, userId: gameStats.userId },
      data,
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    ).exec();

    if (!doc) {
      throw new Error('Failed to save game stats');
    }

    return GameStatsMapper.toDomain(doc);
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const result = await GameStatsModel.findOneAndDelete({ _id: id, userId }).exec();
    return result !== null;
  }

  async getPlayerAggregateStats(playerId: string, userId: string): Promise<PlayerAggregateStats> {
    const allStats = await this.findByPlayerId(playerId, userId);

    if (allStats.length === 0) {
      return {
        playerId,
        gamesPlayed: 0,
        totalPoints: 0,
        totalRebounds: 0,
        totalAssists: 0,
        totalSteals: 0,
        totalBlocks: 0,
        totalTurnovers: 0,
        averagePoints: 0,
        averageRebounds: 0,
        averageAssists: 0,
        fieldGoalPercentage: 0,
        freeThrowPercentage: 0,
        threePointPercentage: 0,
      };
    }

    const totals = allStats.reduce(
      (acc, stats) => ({
        points: acc.points + stats.getTotalPoints(),
        rebounds: acc.rebounds + stats.getTotalRebounds(),
        assists: acc.assists + stats.assists,
        steals: acc.steals + stats.steals,
        blocks: acc.blocks + stats.blocks,
        turnovers: acc.turnovers + stats.turnovers,
        fieldGoalsMade: acc.fieldGoalsMade + stats.twoPointsMade + stats.threePointsMade,
        fieldGoalsAttempted:
          acc.fieldGoalsAttempted + stats.twoPointsAttempted + stats.threePointsAttempted,
        freeThrowsMade: acc.freeThrowsMade + stats.freeThrowsMade,
        freeThrowsAttempted: acc.freeThrowsAttempted + stats.freeThrowsAttempted,
        threePointsMade: acc.threePointsMade + stats.threePointsMade,
        threePointsAttempted: acc.threePointsAttempted + stats.threePointsAttempted,
      }),
      {
        points: 0,
        rebounds: 0,
        assists: 0,
        steals: 0,
        blocks: 0,
        turnovers: 0,
        fieldGoalsMade: 0,
        fieldGoalsAttempted: 0,
        freeThrowsMade: 0,
        freeThrowsAttempted: 0,
        threePointsMade: 0,
        threePointsAttempted: 0,
      }
    );

    const gamesPlayed = allStats.length;

    return {
      playerId,
      gamesPlayed,
      totalPoints: totals.points,
      totalRebounds: totals.rebounds,
      totalAssists: totals.assists,
      totalSteals: totals.steals,
      totalBlocks: totals.blocks,
      totalTurnovers: totals.turnovers,
      averagePoints: Math.round((totals.points / gamesPlayed) * 10) / 10,
      averageRebounds: Math.round((totals.rebounds / gamesPlayed) * 10) / 10,
      averageAssists: Math.round((totals.assists / gamesPlayed) * 10) / 10,
      fieldGoalPercentage:
        totals.fieldGoalsAttempted > 0
          ? Math.round((totals.fieldGoalsMade / totals.fieldGoalsAttempted) * 1000) / 10
          : 0,
      freeThrowPercentage:
        totals.freeThrowsAttempted > 0
          ? Math.round((totals.freeThrowsMade / totals.freeThrowsAttempted) * 1000) / 10
          : 0,
      threePointPercentage:
        totals.threePointsAttempted > 0
          ? Math.round((totals.threePointsMade / totals.threePointsAttempted) * 1000) / 10
          : 0,
    };
  }

  async deleteByUserId(userId: string): Promise<number> {
    const result = await GameStatsModel.deleteMany({ userId }).exec();
    return result.deletedCount || 0;
  }
}
