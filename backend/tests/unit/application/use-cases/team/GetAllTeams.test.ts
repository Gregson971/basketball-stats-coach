import { GetAllTeams } from '../../../../../src/application/use-cases/team/GetAllTeams';
import { Team } from '../../../../../src/domain/entities/Team';
import { ITeamRepository } from '../../../../../src/domain/repositories/TeamRepository';

class MockTeamRepository implements ITeamRepository {
  public teams: Team[] = [];

  async findById(id: string, userId: string): Promise<Team | null> {
    return this.teams.find((t) => t.id === id && t.userId === userId) || null;
  }

  async save(team: Team): Promise<Team> {
    this.teams.push(team);
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

describe('GetAllTeams Use Case', () => {
  let mockRepository: MockTeamRepository;
  let getAllTeams: GetAllTeams;
  const userId = 'user-123';

  beforeEach(() => {
    mockRepository = new MockTeamRepository();
    getAllTeams = new GetAllTeams(mockRepository);
  });

  test('should get all teams for a user', async () => {
    const team1 = new Team({ userId, name: 'Wild Cats' });
    const team2 = new Team({ userId, name: 'Tigers' });
    const team3 = new Team({ userId, name: 'Panthers' });
    mockRepository.teams.push(team1, team2, team3);

    const result = await getAllTeams.execute(userId);

    expect(result.success).toBe(true);
    expect(result.teams?.length).toBe(3);
    expect(result.teams?.[0].name).toBe('Wild Cats');
    expect(result.teams?.[1].name).toBe('Tigers');
    expect(result.teams?.[2].name).toBe('Panthers');
  });

  test('should return empty array when no teams exist', async () => {
    const result = await getAllTeams.execute(userId);

    expect(result.success).toBe(true);
    expect(result.teams?.length).toBe(0);
  });

  test('should only return teams for the specified user', async () => {
    const team1 = new Team({ userId, name: 'Wild Cats' });
    const team2 = new Team({ userId: 'user-456', name: 'Tigers' });
    const team3 = new Team({ userId, name: 'Panthers' });
    mockRepository.teams.push(team1, team2, team3);

    const result = await getAllTeams.execute(userId);

    expect(result.success).toBe(true);
    expect(result.teams?.length).toBe(2);
    expect(result.teams?.every((t) => t.userId === userId)).toBe(true);
  });

  test('should not return teams from different user', async () => {
    const team1 = new Team({ userId: 'user-456', name: 'Wild Cats' });
    const team2 = new Team({ userId: 'user-456', name: 'Tigers' });
    mockRepository.teams.push(team1, team2);

    const result = await getAllTeams.execute(userId);

    expect(result.success).toBe(true);
    expect(result.teams?.length).toBe(0);
  });
});
