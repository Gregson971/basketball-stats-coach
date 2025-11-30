import { GetPlayer } from '../../../../../src/application/use-cases/player/GetPlayer';
import { Player } from '../../../../../src/domain/entities/Player';
import { IPlayerRepository } from '../../../../../src/domain/repositories/PlayerRepository';

class MockPlayerRepository implements IPlayerRepository {
  private players: Player[] = [];

  async save(player: Player): Promise<Player> {
    this.players.push(player);
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

  async delete(_id: string): Promise<boolean> {
    return false;
  }

  async searchByName(_query: string): Promise<Player[]> {
    return [];
  }
}

describe('GetPlayer Use Case', () => {
  let mockRepository: MockPlayerRepository;
  let getPlayer: GetPlayer;
  let existingPlayer: Player;

  beforeEach(async () => {
    mockRepository = new MockPlayerRepository();
    getPlayer = new GetPlayer(mockRepository);

    existingPlayer = new Player({
      firstName: 'Ryan',
      lastName: 'Evans',
      teamId: 'team-123',
      nickname: 'The Rocket',
    });
    await mockRepository.save(existingPlayer);
  });

  test('should get player by id', async () => {
    const result = await getPlayer.execute(existingPlayer.id);

    expect(result.success).toBe(true);
    expect(result.player).toBeDefined();
    expect(result.player?.id).toBe(existingPlayer.id);
    expect(result.player?.firstName).toBe('Ryan');
    expect(result.player?.nickname).toBe('The Rocket');
  });

  test('should return error when player not found', async () => {
    const result = await getPlayer.execute('non-existent-id');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Player not found');
  });
});
