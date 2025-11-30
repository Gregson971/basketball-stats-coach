import { CreatePlayer } from '../../../../../src/application/use-cases/player/CreatePlayer';
import { Player, PlayerData } from '../../../../../src/domain/entities/Player';
import { IPlayerRepository } from '../../../../../src/domain/repositories/PlayerRepository';

// Mock repository
class MockPlayerRepository implements IPlayerRepository {
  private players: Player[] = [];

  async save(player: Player): Promise<Player> {
    this.players.push(player);
    return player;
  }

  async findByTeamId(teamId: string): Promise<Player[]> {
    return this.players.filter((p) => p.teamId === teamId);
  }

  async findById(id: string): Promise<Player | null> {
    return this.players.find((p) => p.id === id) || null;
  }

  async findAll(): Promise<Player[]> {
    return this.players;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.players.findIndex((p) => p.id === id);
    if (index >= 0) {
      this.players.splice(index, 1);
      return true;
    }
    return false;
  }

  async searchByName(query: string): Promise<Player[]> {
    return this.players.filter(
      (p) =>
        p.firstName.toLowerCase().includes(query.toLowerCase()) ||
        p.lastName.toLowerCase().includes(query.toLowerCase())
    );
  }
}

describe('CreatePlayer Use Case', () => {
  let mockRepository: MockPlayerRepository;
  let createPlayer: CreatePlayer;

  beforeEach(() => {
    mockRepository = new MockPlayerRepository();
    createPlayer = new CreatePlayer(mockRepository);
  });

  test('should create a player with required fields', async () => {
    const playerData: PlayerData = {
      firstName: 'Ryan',
      lastName: 'Evans',
      teamId: 'team-123',
    };

    const result = await createPlayer.execute(playerData);

    expect(result.success).toBe(true);
    expect(result.player).toBeInstanceOf(Player);
    expect(result.player?.firstName).toBe('Ryan');
    expect(result.player?.lastName).toBe('Evans');
    expect(result.player?.teamId).toBe('team-123');
  });

  test('should create a player with all fields', async () => {
    const playerData: PlayerData = {
      firstName: 'Ryan',
      lastName: 'Evans',
      teamId: 'team-123',
      nickname: 'The Rocket',
      height: 202.5,
      weight: 95.5,
      age: 24,
      gender: 'M',
      grade: '10',
      position: 'Power Forward',
    };

    const result = await createPlayer.execute(playerData);

    expect(result.success).toBe(true);
    expect(result.player?.nickname).toBe('The Rocket');
    expect(result.player?.height).toBe(202.5);
    expect(result.player?.position).toBe('Power Forward');
  });

  test('should return error when required fields are missing', async () => {
    const playerData = {
      lastName: 'Evans',
      teamId: 'team-123',
    } as PlayerData;

    const result = await createPlayer.execute(playerData);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error).toContain('First name is required');
  });

  test('should return error when validation fails', async () => {
    const playerData: PlayerData = {
      firstName: 'Ryan',
      lastName: 'Evans',
      teamId: 'team-123',
      age: -5,
    };

    const result = await createPlayer.execute(playerData);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error).toContain('Age must be between 5 and 100');
  });

  test('should save player to repository', async () => {
    const playerData: PlayerData = {
      firstName: 'Ryan',
      lastName: 'Evans',
      teamId: 'team-123',
    };

    await createPlayer.execute(playerData);

    const playersInRepo = await mockRepository.findByTeamId('team-123');
    expect(playersInRepo).toHaveLength(1);
    expect(playersInRepo[0].firstName).toBe('Ryan');
  });
});
