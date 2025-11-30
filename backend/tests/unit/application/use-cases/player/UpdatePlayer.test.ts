import { UpdatePlayer } from '../../../../../src/application/use-cases/player/UpdatePlayer';
import { Player, PlayerData } from '../../../../../src/domain/entities/Player';
import { IPlayerRepository } from '../../../../../src/domain/repositories/PlayerRepository';

// Mock repository
class MockPlayerRepository implements IPlayerRepository {
  private players: Player[] = [];

  async save(player: Player): Promise<Player> {
    const existingIndex = this.players.findIndex((p) => p.id === player.id);
    if (existingIndex >= 0) {
      this.players[existingIndex] = player;
    } else {
      this.players.push(player);
    }
    return player;
  }

  async findById(id: string): Promise<Player | null> {
    return this.players.find((p) => p.id === id) || null;
  }

  async findByTeamId(teamId: string): Promise<Player[]> {
    return this.players.filter((p) => p.teamId === teamId);
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

describe('UpdatePlayer Use Case', () => {
  let mockRepository: MockPlayerRepository;
  let updatePlayer: UpdatePlayer;
  let existingPlayer: Player;

  beforeEach(async () => {
    mockRepository = new MockPlayerRepository();
    updatePlayer = new UpdatePlayer(mockRepository);

    existingPlayer = new Player({
      firstName: 'Ryan',
      lastName: 'Evans',
      teamId: 'team-123',
    });
    await mockRepository.save(existingPlayer);
  });

  test('should update player with new data', async () => {
    const updateData: Partial<PlayerData> = {
      nickname: 'The Rocket',
      height: 202.5,
      age: 24,
    };

    const result = await updatePlayer.execute(existingPlayer.id, updateData);

    expect(result.success).toBe(true);
    expect(result.player?.nickname).toBe('The Rocket');
    expect(result.player?.height).toBe(202.5);
    expect(result.player?.age).toBe(24);
    expect(result.player?.firstName).toBe('Ryan'); // unchanged
  });

  test('should return error when player not found', async () => {
    const result = await updatePlayer.execute('non-existent-id', { nickname: 'Test' });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Player not found');
  });

  test('should return error when validation fails', async () => {
    const updateData: Partial<PlayerData> = {
      age: -5,
    };

    const result = await updatePlayer.execute(existingPlayer.id, updateData);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error).toContain('Age must be between 5 and 100');
  });

  test('should not update immutable fields', async () => {
    const updateData = {
      id: 'new-id',
      teamId: 'new-team-id',
      createdAt: new Date(),
    } as any;

    const result = await updatePlayer.execute(existingPlayer.id, updateData);

    expect(result.success).toBe(true);
    expect(result.player?.id).toBe(existingPlayer.id);
    expect(result.player?.teamId).toBe('team-123');
  });

  test('should update player in repository', async () => {
    const updateData: Partial<PlayerData> = {
      nickname: 'The Rocket',
    };

    await updatePlayer.execute(existingPlayer.id, updateData);

    const updatedPlayer = await mockRepository.findById(existingPlayer.id);
    expect(updatedPlayer?.nickname).toBe('The Rocket');
  });

  test('should update multiple fields at once', async () => {
    const updateData: Partial<PlayerData> = {
      nickname: 'The Rocket',
      height: 202.5,
      weight: 95.5,
      age: 24,
      position: 'Power Forward',
    };

    const result = await updatePlayer.execute(existingPlayer.id, updateData);

    expect(result.success).toBe(true);
    expect(result.player?.nickname).toBe('The Rocket');
    expect(result.player?.height).toBe(202.5);
    expect(result.player?.weight).toBe(95.5);
    expect(result.player?.age).toBe(24);
    expect(result.player?.position).toBe('Power Forward');
  });
});
