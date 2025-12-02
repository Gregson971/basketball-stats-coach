import { GetPlayer } from '../../../../../src/application/use-cases/player/GetPlayer';
import { Player } from '../../../../../src/domain/entities/Player';
import { IPlayerRepository } from '../../../../../src/domain/repositories/PlayerRepository';

class MockPlayerRepository implements IPlayerRepository {
  private players: Player[] = [];

  async save(player: Player): Promise<Player> {
    this.players.push(player);
    return player;
  }

  async findById(id: string, userId: string): Promise<Player | null> {
    return this.players.find((p) => p.id === id && p.userId === userId) || null;
  }

  async findByTeamId(teamId: string, userId: string): Promise<Player[]> {
    return this.players.filter((p) => p.teamId === teamId && p.userId === userId);
  }

  async findByUserId(userId: string): Promise<Player[]> {
    return this.players.filter((p) => p.userId === userId);
  }

  async delete(_id: string, _userId: string): Promise<boolean> {
    return false;
  }

  async searchByName(_query: string, _userId: string): Promise<Player[]> {
    return [];
  }

  async deleteByUserId(userId: string): Promise<number> {
    const initialLength = this.players.length;
    this.players = this.players.filter((p) => p.userId !== userId);
    return initialLength - this.players.length;
  }
}

describe('GetPlayer Use Case', () => {
  let mockRepository: MockPlayerRepository;
  let getPlayer: GetPlayer;
  let existingPlayer: Player;
  const userId = 'user-123';

  beforeEach(async () => {
    mockRepository = new MockPlayerRepository();
    getPlayer = new GetPlayer(mockRepository);

    existingPlayer = new Player({
      userId,
      firstName: 'Ryan',
      lastName: 'Evans',
      teamId: 'team-123',
      nickname: 'The Rocket',
    });
    await mockRepository.save(existingPlayer);
  });

  test('should get player by id', async () => {
    const result = await getPlayer.execute(existingPlayer.id, userId);

    expect(result.success).toBe(true);
    expect(result.player).toBeDefined();
    expect(result.player?.id).toBe(existingPlayer.id);
    expect(result.player?.userId).toBe(userId);
    expect(result.player?.firstName).toBe('Ryan');
    expect(result.player?.nickname).toBe('The Rocket');
  });

  test('should return error when player not found', async () => {
    const result = await getPlayer.execute('non-existent-id', userId);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Player not found');
  });

  test('should not get player from different user', async () => {
    const result = await getPlayer.execute(existingPlayer.id, 'different-user-id');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Player not found');
  });
});
