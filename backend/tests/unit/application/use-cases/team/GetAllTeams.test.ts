import { GetAllTeams } from '../../../../../src/application/use-cases/team/GetAllTeams';
import { Team } from '../../../../../src/domain/entities/Team';
import { ITeamRepository } from '../../../../../src/domain/repositories/TeamRepository';

class MockTeamRepository implements ITeamRepository {
  public teams: Team[] = [];

  async findById(id: string): Promise<Team | null> {
    return this.teams.find(t => t.id === id) || null;
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

describe('GetAllTeams Use Case', () => {
  let mockRepository: MockTeamRepository;
  let getAllTeams: GetAllTeams;

  beforeEach(() => {
    mockRepository = new MockTeamRepository();
    getAllTeams = new GetAllTeams(mockRepository);
  });

  test('should get all teams', async () => {
    const team1 = new Team({ name: 'Wild Cats' });
    const team2 = new Team({ name: 'Tigers' });
    const team3 = new Team({ name: 'Panthers' });
    mockRepository.teams.push(team1, team2, team3);

    const result = await getAllTeams.execute();

    expect(result.success).toBe(true);
    expect(result.teams?.length).toBe(3);
    expect(result.teams?.[0].name).toBe('Wild Cats');
    expect(result.teams?.[1].name).toBe('Tigers');
    expect(result.teams?.[2].name).toBe('Panthers');
  });

  test('should return empty array when no teams exist', async () => {
    const result = await getAllTeams.execute();

    expect(result.success).toBe(true);
    expect(result.teams?.length).toBe(0);
  });
});
