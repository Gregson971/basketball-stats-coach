import { Player } from '../../../src/domain/entities/Player';
import { Team } from '../../../src/domain/entities/Team';
import { Game, GameStatus } from '../../../src/domain/entities/Game';
import { GameStats } from '../../../src/domain/entities/GameStats';
import { User } from '../../../src/domain/entities/User';
import { Substitution } from '../../../src/domain/entities/Substitution';
import { IPlayerRepository } from '../../../src/domain/repositories/PlayerRepository';
import { ITeamRepository } from '../../../src/domain/repositories/TeamRepository';
import { IGameRepository } from '../../../src/domain/repositories/GameRepository';
import { IUserRepository } from '../../../src/domain/repositories/UserRepository';
import { ISubstitutionRepository } from '../../../src/domain/repositories/SubstitutionRepository';
import {
  IGameStatsRepository,
  PlayerAggregateStats,
} from '../../../src/domain/repositories/GameStatsRepository';

export class MockPlayerRepository implements IPlayerRepository {
  players: Player[] = [];

  async findById(id: string, _userId?: string): Promise<Player | null> {
    return this.players.find((p) => p.id === id) || null;
  }

  async save(player: Player): Promise<Player> {
    const existingIndex = this.players.findIndex((p) => p.id === player.id);
    if (existingIndex >= 0) {
      this.players[existingIndex] = player;
    } else {
      this.players.push(player);
    }
    return player;
  }

  async findByTeamId(teamId: string, _userId?: string): Promise<Player[]> {
    return this.players.filter((p) => p.teamId === teamId);
  }

  async findAll(_userId?: string): Promise<Player[]> {
    return this.players;
  }

  async searchByName(_query: string, _userId?: string): Promise<Player[]> {
    return [];
  }

  async delete(id: string, _userId?: string): Promise<boolean> {
    const index = this.players.findIndex((p) => p.id === id);
    if (index >= 0) {
      this.players.splice(index, 1);
      return true;
    }
    return false;
  }

  async findByUserId(_userId: string): Promise<Player[]> {
    return this.players;
  }

  async deleteByUserId(_userId: string): Promise<number> {
    const count = this.players.length;
    this.players = [];
    return count;
  }
}

export class MockTeamRepository implements ITeamRepository {
  teams: Team[] = [];

  async findById(id: string, _userId?: string): Promise<Team | null> {
    return this.teams.find((t) => t.id === id) || null;
  }

  async save(team: Team): Promise<Team> {
    const existingIndex = this.teams.findIndex((t) => t.id === team.id);
    if (existingIndex >= 0) {
      this.teams[existingIndex] = team;
    } else {
      this.teams.push(team);
    }
    return team;
  }

  async findAll(_userId?: string): Promise<Team[]> {
    return this.teams;
  }

  async searchByName(_query: string, _userId?: string): Promise<Team[]> {
    return [];
  }

  async delete(id: string, _userId?: string): Promise<boolean> {
    const index = this.teams.findIndex((t) => t.id === id);
    if (index >= 0) {
      this.teams.splice(index, 1);
      return true;
    }
    return false;
  }

  async findByUserId(_userId: string): Promise<Team[]> {
    return this.teams;
  }

  async deleteByUserId(_userId: string): Promise<number> {
    const count = this.teams.length;
    this.teams = [];
    return count;
  }
}

export class MockGameRepository implements IGameRepository {
  games: Game[] = [];

  async findById(id: string, _userId?: string): Promise<Game | null> {
    return this.games.find((g) => g.id === id) || null;
  }

  async save(game: Game): Promise<Game> {
    const existingIndex = this.games.findIndex((g) => g.id === game.id);
    if (existingIndex >= 0) {
      this.games[existingIndex] = game;
    } else {
      this.games.push(game);
    }
    return game;
  }

  async findByTeamId(teamId: string, _userId?: string): Promise<Game[]> {
    return this.games.filter((g) => g.teamId === teamId);
  }

  async findAll(_userId?: string): Promise<Game[]> {
    return this.games;
  }

  async findByStatus(status: GameStatus, _userId?: string): Promise<Game[]> {
    return this.games.filter((g) => g.status === status);
  }

  async delete(id: string, _userId?: string): Promise<boolean> {
    const index = this.games.findIndex((g) => g.id === id);
    if (index >= 0) {
      this.games.splice(index, 1);
      return true;
    }
    return false;
  }

  async findByUserId(_userId: string): Promise<Game[]> {
    return this.games;
  }

  async deleteByUserId(_userId: string): Promise<number> {
    const count = this.games.length;
    this.games = [];
    return count;
  }
}

export class MockGameStatsRepository implements IGameStatsRepository {
  stats: GameStats[] = [];

  async findById(_id: string, _userId?: string): Promise<GameStats | null> {
    return null;
  }

  async findByGameId(gameId: string, _userId?: string): Promise<GameStats[]> {
    return this.stats.filter((s) => s.gameId === gameId);
  }

  async findByPlayerId(playerId: string, _userId?: string): Promise<GameStats[]> {
    return this.stats.filter((s) => s.playerId === playerId);
  }

  async findByGameAndPlayer(
    gameId: string,
    playerId: string,
    _userId?: string
  ): Promise<GameStats | null> {
    return this.stats.find((s) => s.gameId === gameId && s.playerId === playerId) || null;
  }

  async save(gameStats: GameStats): Promise<GameStats> {
    const existingIndex = this.stats.findIndex(
      (s) => s.gameId === gameStats.gameId && s.playerId === gameStats.playerId
    );
    if (existingIndex >= 0) {
      this.stats[existingIndex] = gameStats;
    } else {
      this.stats.push(gameStats);
    }
    return gameStats;
  }

  async delete(_id: string, _userId?: string): Promise<boolean> {
    return false;
  }

  async findByUserId(_userId: string): Promise<GameStats[]> {
    return this.stats;
  }

  async deleteByUserId(_userId: string): Promise<number> {
    const count = this.stats.length;
    this.stats = [];
    return count;
  }

  async getPlayerAggregateStats(playerId: string, _userId?: string): Promise<PlayerAggregateStats> {
    const playerStats = this.stats.filter((s) => s.playerId === playerId);

    if (playerStats.length === 0) {
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

    const totals = playerStats.reduce(
      (acc, stats) => ({
        points: acc.points + stats.getTotalPoints(),
        rebounds: acc.rebounds + stats.getTotalRebounds(),
        assists: acc.assists + stats.assists,
      }),
      {
        points: 0,
        rebounds: 0,
        assists: 0,
      }
    );

    return {
      playerId,
      gamesPlayed: playerStats.length,
      totalPoints: totals.points,
      totalRebounds: totals.rebounds,
      totalAssists: totals.assists,
      totalSteals: 0,
      totalBlocks: 0,
      totalTurnovers: 0,
      averagePoints: Math.round((totals.points / playerStats.length) * 10) / 10,
      averageRebounds: Math.round((totals.rebounds / playerStats.length) * 10) / 10,
      averageAssists: Math.round((totals.assists / playerStats.length) * 10) / 10,
      fieldGoalPercentage: 0,
      freeThrowPercentage: 0,
      threePointPercentage: 0,
    };
  }
}

export class MockUserRepository implements IUserRepository {
  users: User[] = [];

  async findById(id: string): Promise<User | null> {
    return this.users.find((u) => u.id === id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  async save(user: User): Promise<User> {
    const existingIndex = this.users.findIndex((u) => u.id === user.id);
    if (existingIndex >= 0) {
      this.users[existingIndex] = user;
    } else {
      this.users.push(user);
    }
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index >= 0) {
      this.users.splice(index, 1);
      return true;
    }
    return false;
  }
}

export class MockSubstitutionRepository implements ISubstitutionRepository {
  substitutions: Substitution[] = [];

  async findById(id: string, _userId?: string): Promise<Substitution | null> {
    return this.substitutions.find((s) => s.id === id) || null;
  }

  async findByGameId(_gameId: string, _userId?: string): Promise<Substitution[]> {
    return this.substitutions.filter((s) => s.gameId === _gameId);
  }

  async findByUserId(_userId: string): Promise<Substitution[]> {
    return this.substitutions;
  }

  async save(substitution: Substitution): Promise<Substitution> {
    const existingIndex = this.substitutions.findIndex((s) => s.id === substitution.id);
    if (existingIndex >= 0) {
      this.substitutions[existingIndex] = substitution;
    } else {
      this.substitutions.push(substitution);
    }
    return substitution;
  }

  async delete(id: string, _userId?: string): Promise<boolean> {
    const index = this.substitutions.findIndex((s) => s.id === id);
    if (index >= 0) {
      this.substitutions.splice(index, 1);
      return true;
    }
    return false;
  }

  async deleteByUserId(_userId: string): Promise<number> {
    const count = this.substitutions.length;
    this.substitutions = [];
    return count;
  }

  async deleteByGameId(_gameId: string, _userId?: string): Promise<number> {
    const beforeCount = this.substitutions.length;
    this.substitutions = this.substitutions.filter((s) => s.gameId !== _gameId);
    return beforeCount - this.substitutions.length;
  }
}
