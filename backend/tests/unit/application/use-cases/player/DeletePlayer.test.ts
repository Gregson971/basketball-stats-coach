import { DeletePlayer } from '../../../../../src/application/use-cases/player/DeletePlayer';
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

  async delete(id: string, userId: string): Promise<boolean> {
    const index = this.players.findIndex((p) => p.id === id && p.userId === userId);
    if (index >= 0) {
      this.players.splice(index, 1);
      return true;
    }
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

describe('DeletePlayer Use Case', () => {
  let mockRepository: MockPlayerRepository;
  let deletePlayer: DeletePlayer;
  let existingPlayer: Player;
  const userId = 'user-123';

  beforeEach(async () => {
    mockRepository = new MockPlayerRepository();
    deletePlayer = new DeletePlayer(mockRepository);

    existingPlayer = new Player({
      userId,
      firstName: 'Ryan',
      lastName: 'Evans',
      teamId: 'team-123',
    });
    await mockRepository.save(existingPlayer);
  });

  test('should delete existing player', async () => {
    const result = await deletePlayer.execute(existingPlayer.id, userId);

    expect(result.success).toBe(true);

    const player = await mockRepository.findById(existingPlayer.id, userId);
    expect(player).toBeNull();
  });

  test('should return error when player not found', async () => {
    const result = await deletePlayer.execute('non-existent-id', userId);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Player not found');
  });

  test('should not delete player from different user', async () => {
    const result = await deletePlayer.execute(existingPlayer.id, 'different-user-id');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Player not found');

    // Original player should still exist
    const player = await mockRepository.findById(existingPlayer.id, userId);
    expect(player).not.toBeNull();
  });
});
