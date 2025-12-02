import { CreateTeam } from '../../../../../src/application/use-cases/team/CreateTeam';
import { Team, TeamData } from '../../../../../src/domain/entities/Team';
import { ITeamRepository } from '../../../../../src/domain/repositories/TeamRepository';

class MockTeamRepository implements ITeamRepository {
  private teams: Team[] = [];

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

describe('CreateTeam Use Case', () => {
  let mockRepository: MockTeamRepository;
  let createTeam: CreateTeam;

  beforeEach(() => {
    mockRepository = new MockTeamRepository();
    createTeam = new CreateTeam(mockRepository);
  });

  test('should create a team with required fields only', async () => {
    const userId = 'user-123';
    const teamData: TeamData = {
      userId,
      name: 'Wild Cats',
    };

    const result = await createTeam.execute(teamData);

    expect(result.success).toBe(true);
    expect(result.team?.name).toBe('Wild Cats');
    expect(result.team?.userId).toBe(userId);
    expect(result.team?.id).toBeDefined();
  });

  test('should create a team with all optional fields', async () => {
    const userId = 'user-123';
    const teamData: TeamData = {
      userId,
      name: 'Tigers',
      coach: 'Coach Johnson',
      season: '2024-2025',
      league: 'Youth League',
    };

    const result = await createTeam.execute(teamData);

    expect(result.success).toBe(true);
    expect(result.team?.name).toBe('Tigers');
    expect(result.team?.userId).toBe(userId);
    expect(result.team?.coach).toBe('Coach Johnson');
    expect(result.team?.season).toBe('2024-2025');
    expect(result.team?.league).toBe('Youth League');
  });

  test('should return error when name is missing', async () => {
    const teamData: TeamData = {
      userId: 'user-123',
      name: '',
    };

    const result = await createTeam.execute(teamData);

    expect(result.success).toBe(false);
    expect(result.error).toContain('name');
  });

  test('should return error when name is only whitespace', async () => {
    const teamData: TeamData = {
      userId: 'user-123',
      name: '   ',
    };

    const result = await createTeam.execute(teamData);

    expect(result.success).toBe(false);
    expect(result.error).toContain('name');
  });

  test('should return error when userId is missing', async () => {
    const teamData = {
      name: 'Wild Cats',
    } as TeamData;

    const result = await createTeam.execute(teamData);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error).toContain('User ID is required');
  });

  test('should save team to repository', async () => {
    const userId = 'user-123';
    const teamData: TeamData = {
      userId,
      name: 'Panthers',
      coach: 'Coach Smith',
    };

    await createTeam.execute(teamData);

    const allTeams = await mockRepository.findAll(userId);
    expect(allTeams.length).toBe(1);
    expect(allTeams[0].name).toBe('Panthers');
    expect(allTeams[0].userId).toBe(userId);
  });
});
