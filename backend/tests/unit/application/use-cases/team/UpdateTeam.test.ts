import { UpdateTeam } from '../../../../../src/application/use-cases/team/UpdateTeam';
import { Team } from '../../../../../src/domain/entities/Team';
import { ITeamRepository } from '../../../../../src/domain/repositories/TeamRepository';

class MockTeamRepository implements ITeamRepository {
  public teams: Team[] = [];

  async findById(id: string, userId: string): Promise<Team | null> {
    return this.teams.find((t) => t.id === id && t.userId === userId) || null;
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

  async searchByName(query: string, userId: string): Promise<Team[]> {
    return this.teams.filter(
      (t) => t.userId === userId && t.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  async findAll(userId: string): Promise<Team[]> {
    return this.teams.filter((t) => t.userId === userId);
  }

  async findByUserId(userId: string): Promise<Team[]> {
    return this.teams.filter((t) => t.userId === userId);
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const index = this.teams.findIndex((t) => t.id === id && t.userId === userId);
    if (index >= 0) {
      this.teams.splice(index, 1);
      return true;
    }
    return false;
  }

  async deleteByUserId(userId: string): Promise<number> {
    const initialLength = this.teams.length;
    this.teams = this.teams.filter((t) => t.userId !== userId);
    return initialLength - this.teams.length;
  }
}

describe('UpdateTeam Use Case', () => {
  let mockRepository: MockTeamRepository;
  let updateTeam: UpdateTeam;
  let team: Team;
  const userId = 'user-123';

  beforeEach(() => {
    mockRepository = new MockTeamRepository();
    updateTeam = new UpdateTeam(mockRepository);

    team = new Team({
      userId,
      name: 'Wild Cats',
      coach: 'Coach Smith',
      season: '2024-2025',
    });
    mockRepository.teams.push(team);
  });

  test('should update team name', async () => {
    const result = await updateTeam.execute(team.id, userId, { name: 'Panthers' });

    expect(result.success).toBe(true);
    expect(result.team?.name).toBe('Panthers');
    expect(result.team?.userId).toBe(userId);
  });

  test('should update team coach', async () => {
    const result = await updateTeam.execute(team.id, userId, { coach: 'Coach Johnson' });

    expect(result.success).toBe(true);
    expect(result.team?.coach).toBe('Coach Johnson');
  });

  test('should update team season', async () => {
    const result = await updateTeam.execute(team.id, userId, { season: '2025-2026' });

    expect(result.success).toBe(true);
    expect(result.team?.season).toBe('2025-2026');
  });

  test('should update multiple fields at once', async () => {
    const result = await updateTeam.execute(team.id, userId, {
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
    const result = await updateTeam.execute('non-existent-id', userId, { name: 'New Name' });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Team not found');
  });

  test('should return error when trying to set empty name', async () => {
    const result = await updateTeam.execute(team.id, userId, { name: '' });

    expect(result.success).toBe(false);
    expect(result.error).toContain('name');
  });

  test('should not allow updating team id', async () => {
    const updateData: any = { id: 'new-id' };
    const result = await updateTeam.execute(team.id, userId, updateData);

    expect(result.success).toBe(true);
    expect(result.team?.id).toBe(team.id); // ID should remain unchanged
  });

  test('should not update team from different user', async () => {
    const result = await updateTeam.execute(team.id, 'different-user-id', { name: 'New Name' });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Team not found');
  });
});
