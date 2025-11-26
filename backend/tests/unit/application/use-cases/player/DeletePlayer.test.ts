import { DeletePlayer } from '../../../../../src/application/use-cases/player/DeletePlayer';
import { Player } from '../../../../../src/domain/entities/Player';
import { IPlayerRepository } from '../../../../../src/domain/repositories/PlayerRepository';

class MockPlayerRepository implements IPlayerRepository {
  private players: Player[] = [];

  async save(player: Player): Promise<Player> {
    this.players.push(player);
    return player;
  }

  async findById(id: string): Promise<Player | null> {
    return this.players.find(p => p.id === id) || null;
  }

  async findByTeamId(teamId: string): Promise<Player[]> {
    return this.players.filter(p => p.teamId === teamId);
  }

  async findAll(): Promise<Player[]> {
    return this.players;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.players.findIndex(p => p.id === id);
    if (index >= 0) {
      this.players.splice(index, 1);
      return true;
    }
    return false;
  }

  async searchByName(_query: string): Promise<Player[]> {
    return [];
  }
}

describe('DeletePlayer Use Case', () => {
  let mockRepository: MockPlayerRepository;
  let deletePlayer: DeletePlayer;
  let existingPlayer: Player;

  beforeEach(async () => {
    mockRepository = new MockPlayerRepository();
    deletePlayer = new DeletePlayer(mockRepository);

    existingPlayer = new Player({
      firstName: 'Ryan',
      lastName: 'Evans',
      teamId: 'team-123'
    });
    await mockRepository.save(existingPlayer);
  });

  test('should delete existing player', async () => {
    const result = await deletePlayer.execute(existingPlayer.id);

    expect(result.success).toBe(true);

    const player = await mockRepository.findById(existingPlayer.id);
    expect(player).toBeNull();
  });

  test('should return error when player not found', async () => {
    const result = await deletePlayer.execute('non-existent-id');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Player not found');
  });
});
