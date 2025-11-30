import { CreateTeam } from '../../../../../src/application/use-cases/team/CreateTeam';
import { Team, TeamData } from '../../../../../src/domain/entities/Team';
import { ITeamRepository } from '../../../../../src/domain/repositories/TeamRepository';

class MockTeamRepository implements ITeamRepository {
  private teams: Team[] = [];

  async findById(id: string): Promise<Team | null> {
    return this.teams.find((t) => t.id === id) || null;
  }

  async save(team: Team): Promise<Team> {
    this.teams.push(team);
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

describe('CreateTeam Use Case', () => {
  let mockRepository: MockTeamRepository;
  let createTeam: CreateTeam;

  beforeEach(() => {
    mockRepository = new MockTeamRepository();
    createTeam = new CreateTeam(mockRepository);
  });

  test('should create a team with required fields only', async () => {
    const teamData: TeamData = {
      name: 'Wild Cats',
    };

    const result = await createTeam.execute(teamData);

    expect(result.success).toBe(true);
    expect(result.team?.name).toBe('Wild Cats');
    expect(result.team?.id).toBeDefined();
  });

  test('should create a team with all optional fields', async () => {
    const teamData: TeamData = {
      name: 'Tigers',
      coach: 'Coach Johnson',
      season: '2024-2025',
      league: 'Youth League',
    };

    const result = await createTeam.execute(teamData);

    expect(result.success).toBe(true);
    expect(result.team?.name).toBe('Tigers');
    expect(result.team?.coach).toBe('Coach Johnson');
    expect(result.team?.season).toBe('2024-2025');
    expect(result.team?.league).toBe('Youth League');
  });

  test('should return error when name is missing', async () => {
    const teamData: TeamData = {
      name: '',
    };

    const result = await createTeam.execute(teamData);

    expect(result.success).toBe(false);
    expect(result.error).toContain('name');
  });

  test('should return error when name is only whitespace', async () => {
    const teamData: TeamData = {
      name: '   ',
    };

    const result = await createTeam.execute(teamData);

    expect(result.success).toBe(false);
    expect(result.error).toContain('name');
  });

  test('should save team to repository', async () => {
    const teamData: TeamData = {
      name: 'Panthers',
      coach: 'Coach Smith',
    };

    await createTeam.execute(teamData);

    const allTeams = await mockRepository.findAll();
    expect(allTeams.length).toBe(1);
    expect(allTeams[0].name).toBe('Panthers');
  });
});
