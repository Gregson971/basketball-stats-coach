import { DeleteTeam } from '../../../../../src/application/use-cases/team/DeleteTeam';
import { Team } from '../../../../../src/domain/entities/Team';
import { ITeamRepository } from '../../../../../src/domain/repositories/TeamRepository';

class MockTeamRepository implements ITeamRepository {
  public teams: Team[] = [];

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

  async delete(id: string): Promise<boolean> {
    const index = this.teams.findIndex((t) => t.id === id);
    if (index >= 0) {
      this.teams.splice(index, 1);
      return true;
    }
    return false;
  }
}

describe('DeleteTeam Use Case', () => {
  let mockRepository: MockTeamRepository;
  let deleteTeam: DeleteTeam;

  beforeEach(() => {
    mockRepository = new MockTeamRepository();
    deleteTeam = new DeleteTeam(mockRepository);
  });

  test('should delete a team successfully', async () => {
    const team = new Team({ name: 'Wild Cats' });
    mockRepository.teams.push(team);

    const result = await deleteTeam.execute(team.id);

    expect(result.success).toBe(true);
    expect(mockRepository.teams.length).toBe(0);
  });

  test('should return error when team not found', async () => {
    const result = await deleteTeam.execute('non-existent-id');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Team not found');
  });
});
