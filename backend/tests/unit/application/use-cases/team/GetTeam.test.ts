import { GetTeam } from '../../../../../src/application/use-cases/team/GetTeam';
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

describe('GetTeam Use Case', () => {
  let mockRepository: MockTeamRepository;
  let getTeam: GetTeam;

  beforeEach(() => {
    mockRepository = new MockTeamRepository();
    getTeam = new GetTeam(mockRepository);
  });

  test('should get a team by id', async () => {
    const team = new Team({
      name: 'Wild Cats',
      coach: 'Coach Smith'
    });
    mockRepository.teams.push(team);

    const result = await getTeam.execute(team.id);

    expect(result.success).toBe(true);
    expect(result.team?.id).toBe(team.id);
    expect(result.team?.name).toBe('Wild Cats');
    expect(result.team?.coach).toBe('Coach Smith');
  });

  test('should return error when team not found', async () => {
    const result = await getTeam.execute('non-existent-id');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Team not found');
  });
});
