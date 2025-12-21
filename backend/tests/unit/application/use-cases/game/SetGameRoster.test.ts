import { SetGameRoster } from '../../../../../src/application/use-cases/game/SetGameRoster';
import { Game } from '../../../../../src/domain/entities/Game';
import { Player } from '../../../../../src/domain/entities/Player';
import { IGameRepository } from '../../../../../src/domain/repositories/GameRepository';
import { IPlayerRepository } from '../../../../../src/domain/repositories/PlayerRepository';
import { GameStatus } from '../../../../../src/domain/entities/Game';

// Mock repositories
class MockGameRepository implements IGameRepository {
  public games: Game[] = [];

  async findById(id: string, userId: string): Promise<Game | null> {
    return this.games.find((g) => g.id === id && g.userId === userId) || null;
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

  async findByTeamId(teamId: string, userId: string): Promise<Game[]> {
    return this.games.filter((g) => g.teamId === teamId && g.userId === userId);
  }

  async findByUserId(userId: string): Promise<Game[]> {
    return this.games.filter((g) => g.userId === userId);
  }

  async findAll(): Promise<Game[]> {
    return this.games;
  }

  async findByStatus(status: GameStatus, userId: string): Promise<Game[]> {
    return this.games.filter((g) => g.status === status && g.userId === userId);
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const index = this.games.findIndex((g) => g.id === id && g.userId === userId);
    if (index >= 0) {
      this.games.splice(index, 1);
      return true;
    }
    return false;
  }

  async deleteByUserId(userId: string): Promise<number> {
    const initialLength = this.games.length;
    this.games = this.games.filter((g) => g.userId !== userId);
    return initialLength - this.games.length;
  }
}

class MockPlayerRepository implements IPlayerRepository {
  public players: Player[] = [];

  async findById(id: string, userId: string): Promise<Player | null> {
    return this.players.find((p) => p.id === id && p.userId === userId) || null;
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

  async findByTeamId(teamId: string, userId: string): Promise<Player[]> {
    return this.players.filter((p) => p.teamId === teamId && p.userId === userId);
  }

  async findByUserId(userId: string): Promise<Player[]> {
    return this.players.filter((p) => p.userId === userId);
  }

  async findAll(): Promise<Player[]> {
    return this.players;
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const index = this.players.findIndex((p) => p.id === id && p.userId === userId);
    if (index >= 0) {
      this.players.splice(index, 1);
      return true;
    }
    return false;
  }

  async deleteByUserId(userId: string): Promise<number> {
    const initialLength = this.players.length;
    this.players = this.players.filter((p) => p.userId !== userId);
    return initialLength - this.players.length;
  }

  async searchByName(query: string, userId: string): Promise<Player[]> {
    const lowerQuery = query.toLowerCase();
    return this.players.filter(
      (p) =>
        p.userId === userId &&
        (p.firstName.toLowerCase().includes(lowerQuery) ||
          p.lastName.toLowerCase().includes(lowerQuery))
    );
  }
}

describe('SetGameRoster Use Case', () => {
  let mockGameRepository: MockGameRepository;
  let mockPlayerRepository: MockPlayerRepository;
  let setGameRoster: SetGameRoster;
  let game: Game;
  let players: Player[];
  const userId = 'user-123';
  const teamId = 'team-456';

  beforeEach(() => {
    mockGameRepository = new MockGameRepository();
    mockPlayerRepository = new MockPlayerRepository();
    setGameRoster = new SetGameRoster(mockGameRepository, mockPlayerRepository);

    // Create a game
    game = new Game({
      userId,
      teamId,
      opponent: 'Eagles',
    });
    mockGameRepository.games.push(game);

    // Create players for the team
    players = [
      new Player({ userId, teamId, firstName: 'P1', lastName: 'Player' }),
      new Player({ userId, teamId, firstName: 'P2', lastName: 'Player' }),
      new Player({ userId, teamId, firstName: 'P3', lastName: 'Player' }),
      new Player({ userId, teamId, firstName: 'P4', lastName: 'Player' }),
      new Player({ userId, teamId, firstName: 'P5', lastName: 'Player' }),
      new Player({ userId, teamId, firstName: 'P6', lastName: 'Player' }),
    ];
    mockPlayerRepository.players.push(...players);
  });

  test('should set roster successfully with valid players', async () => {
    const playerIds = players.slice(0, 5).map((p) => p.id);

    const result = await setGameRoster.execute({
      gameId: game.id,
      userId,
      playerIds,
    });

    expect(result.success).toBe(true);
    expect(result.game).toBeDefined();
    expect(result.game?.roster).toEqual(playerIds);
  });

  test('should allow setting roster with all team players', async () => {
    const playerIds = players.map((p) => p.id);

    const result = await setGameRoster.execute({
      gameId: game.id,
      userId,
      playerIds,
    });

    expect(result.success).toBe(true);
    expect(result.game?.roster).toHaveLength(6);
  });

  test('should return error when roster has less than 5 players', async () => {
    const playerIds = players.slice(0, 3).map((p) => p.id); // Only 3 players

    const result = await setGameRoster.execute({
      gameId: game.id,
      userId,
      playerIds,
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Au moins 5 joueurs doivent être convoqués');
  });

  test('should return error when game not found', async () => {
    const result = await setGameRoster.execute({
      gameId: 'non-existent',
      userId,
      playerIds: [players[0].id],
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Game not found');
  });

  test('should return error when game has already started', async () => {
    // Start the game
    game.setRoster(players.slice(0, 5).map((p) => p.id));
    game.setStartingLineup(players.slice(0, 5).map((p) => p.id));
    game.start();

    const result = await setGameRoster.execute({
      gameId: game.id,
      userId,
      playerIds: players.map((p) => p.id),
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Cannot modify roster of a started game');
  });

  test('should return error when game is completed', async () => {
    // Start and complete the game
    game.setRoster(players.slice(0, 5).map((p) => p.id));
    game.setStartingLineup(players.slice(0, 5).map((p) => p.id));
    game.start();
    game.complete();

    const result = await setGameRoster.execute({
      gameId: game.id,
      userId,
      playerIds: players.map((p) => p.id),
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Cannot modify roster of a started game');
  });

  test('should return error when some players do not belong to team', async () => {
    const invalidPlayerId = 'invalid-player-id';
    const playerIds = [players[0].id, players[1].id, invalidPlayerId];

    const result = await setGameRoster.execute({
      gameId: game.id,
      userId,
      playerIds,
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Some players do not belong to this team');
  });

  test('should return error when all players are from different team', async () => {
    const otherTeamPlayer = new Player({
      userId,
      teamId: 'other-team',
      firstName: 'Other',
      lastName: 'Player',
    });
    mockPlayerRepository.players.push(otherTeamPlayer);

    const result = await setGameRoster.execute({
      gameId: game.id,
      userId,
      playerIds: [otherTeamPlayer.id],
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Some players do not belong to this team');
  });

  test('should update roster when called multiple times', async () => {
    // First roster (5 players)
    const firstRoster = players.slice(0, 5).map((p) => p.id);
    await setGameRoster.execute({
      gameId: game.id,
      userId,
      playerIds: firstRoster,
    });

    // Second roster (all 6 players)
    const secondRoster = players.map((p) => p.id);
    const result = await setGameRoster.execute({
      gameId: game.id,
      userId,
      playerIds: secondRoster,
    });

    expect(result.success).toBe(true);
    expect(result.game?.roster).toEqual(secondRoster);
    expect(result.game?.roster).not.toEqual(firstRoster);
  });

  test('should isolate data by userId - user cannot modify other users games', async () => {
    const user2 = 'user-456';

    const result = await setGameRoster.execute({
      gameId: game.id,
      userId: user2,
      playerIds: [players[0].id],
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Game not found');

    // Verify original game roster was not modified
    const originalGame = await mockGameRepository.findById(game.id, userId);
    expect(originalGame?.roster).toEqual([]);
  });

  test('should preserve game data when setting roster', async () => {
    const playerIds = players.slice(0, 5).map((p) => p.id);

    const result = await setGameRoster.execute({
      gameId: game.id,
      userId,
      playerIds,
    });

    expect(result.success).toBe(true);
    expect(result.game?.id).toBe(game.id);
    expect(result.game?.userId).toBe(userId);
    expect(result.game?.teamId).toBe(teamId);
    expect(result.game?.opponent).toBe('Eagles');
    expect(result.game?.status).toBe('not_started');
  });

  test('should return error when roster contains duplicate player IDs', async () => {
    const playerIds = [
      players[0].id,
      players[1].id,
      players[2].id,
      players[3].id,
      players[4].id,
      players[0].id, // Duplicate player[0]
    ];

    const result = await setGameRoster.execute({
      gameId: game.id,
      userId,
      playerIds,
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Roster contains duplicate players');
  });
});
