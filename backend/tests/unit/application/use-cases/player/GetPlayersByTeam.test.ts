import { GetPlayersByTeam } from '../../../../../src/application/use-cases/player/GetPlayersByTeam';
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

describe('GetPlayersByTeam Use Case', () => {
  let mockRepository: MockPlayerRepository;
  let getPlayersByTeam: GetPlayersByTeam;
  const userId = 'user-123';

  beforeEach(async () => {
    mockRepository = new MockPlayerRepository();
    getPlayersByTeam = new GetPlayersByTeam(mockRepository);

    await mockRepository.save(
      new Player({
        userId,
        firstName: 'Ryan',
        lastName: 'Evans',
        teamId: 'team-123',
      })
    );

    await mockRepository.save(
      new Player({
        userId,
        firstName: 'Lilly',
        lastName: 'Evans',
        teamId: 'team-123',
      })
    );

    await mockRepository.save(
      new Player({
        userId,
        firstName: 'Reed',
        lastName: 'Smith',
        teamId: 'team-456',
      })
    );

    // Player from different user
    await mockRepository.save(
      new Player({
        userId: 'different-user',
        firstName: 'Bob',
        lastName: 'Jones',
        teamId: 'team-123',
      })
    );
  });

  test('should get all players for a team', async () => {
    const result = await getPlayersByTeam.execute('team-123', userId);

    expect(result.success).toBe(true);
    expect(result.players).toHaveLength(2);
    expect(result.players?.map((p) => p.firstName)).toContain('Ryan');
    expect(result.players?.map((p) => p.firstName)).toContain('Lilly');
  });

  test('should return empty array for team with no players', async () => {
    const result = await getPlayersByTeam.execute('empty-team', userId);

    expect(result.success).toBe(true);
    expect(result.players).toHaveLength(0);
  });

  test('should only return players belonging to the user', async () => {
    const result = await getPlayersByTeam.execute('team-123', userId);

    expect(result.success).toBe(true);
    expect(result.players?.every((p) => p.userId === userId)).toBe(true);
    expect(result.players?.length).toBe(2); // Not 3 (excludes other user's player)
  });
});
