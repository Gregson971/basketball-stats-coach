import { GetPlayersByTeam } from '../../../../../src/application/use-cases/player/GetPlayersByTeam';
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

describe('GetPlayersByTeam Use Case', () => {
  let mockRepository: MockPlayerRepository;
  let getPlayersByTeam: GetPlayersByTeam;

  beforeEach(async () => {
    mockRepository = new MockPlayerRepository();
    getPlayersByTeam = new GetPlayersByTeam(mockRepository);

    await mockRepository.save(
      new Player({
        firstName: 'Ryan',
        lastName: 'Evans',
        teamId: 'team-123',
      })
    );

    await mockRepository.save(
      new Player({
        firstName: 'Lilly',
        lastName: 'Evans',
        teamId: 'team-123',
      })
    );

    await mockRepository.save(
      new Player({
        firstName: 'Reed',
        lastName: 'Smith',
        teamId: 'team-456',
      })
    );
  });

  test('should get all players for a team', async () => {
    const result = await getPlayersByTeam.execute('team-123');

    expect(result.success).toBe(true);
    expect(result.players).toHaveLength(2);
    expect(result.players?.map((p) => p.firstName)).toContain('Ryan');
    expect(result.players?.map((p) => p.firstName)).toContain('Lilly');
  });

  test('should return empty array for team with no players', async () => {
    const result = await getPlayersByTeam.execute('empty-team');

    expect(result.success).toBe(true);
    expect(result.players).toHaveLength(0);
  });
});
