import { UpdateTeam } from '../../../../../src/application/use-cases/team/UpdateTeam';
import { Team } from '../../../../../src/domain/entities/Team';
import { ITeamRepository } from '../../../../../src/domain/repositories/TeamRepository';

class MockTeamRepository implements ITeamRepository {
  public teams: Team[] = [];

  async findById(id: string): Promise<Team | null> {
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

  async searchByName(_query: string): Promise<Team[]> {
    return [];
  }

  async findAll(): Promise<Team[]> {
    return this.teams;
  }

  async delete(_id: string): Promise<boolean> {
    return false;
  }
}

describe('UpdateTeam Use Case', () => {
  let mockRepository: MockTeamRepository;
  let updateTeam: UpdateTeam;
  let team: Team;

  beforeEach(() => {
    mockRepository = new MockTeamRepository();
    updateTeam = new UpdateTeam(mockRepository);

    team = new Team({
      name: 'Wild Cats',
      coach: 'Coach Smith',
      season: '2024-2025',
    });
    mockRepository.teams.push(team);
  });

  test('should update team name', async () => {
    const result = await updateTeam.execute(team.id, { name: 'Panthers' });

    expect(result.success).toBe(true);
    expect(result.team?.name).toBe('Panthers');
  });

  test('should update team coach', async () => {
    const result = await updateTeam.execute(team.id, { coach: 'Coach Johnson' });

    expect(result.success).toBe(true);
    expect(result.team?.coach).toBe('Coach Johnson');
  });

  test('should update team season', async () => {
    const result = await updateTeam.execute(team.id, { season: '2025-2026' });

    expect(result.success).toBe(true);
    expect(result.team?.season).toBe('2025-2026');
  });

  test('should update multiple fields at once', async () => {
    const result = await updateTeam.execute(team.id, {
      name: 'Tigers',
      coach: 'Coach Williams',
      league: 'Premier League',
    });

    expect(result.success).toBe(true);
    expect(result.team?.name).toBe('Tigers');
    expect(result.team?.coach).toBe('Coach Williams');
    expect(result.team?.league).toBe('Premier League');
  });

  test('should return error when team not found', async () => {
    const result = await updateTeam.execute('non-existent-id', { name: 'New Name' });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Team not found');
  });

  test('should return error when trying to set empty name', async () => {
    const result = await updateTeam.execute(team.id, { name: '' });

    expect(result.success).toBe(false);
    expect(result.error).toContain('name');
  });

  test('should not allow updating team id', async () => {
    const updateData: any = { id: 'new-id' };
    const result = await updateTeam.execute(team.id, updateData);

    expect(result.success).toBe(true);
    expect(result.team?.id).toBe(team.id); // ID should remain unchanged
  });
});
