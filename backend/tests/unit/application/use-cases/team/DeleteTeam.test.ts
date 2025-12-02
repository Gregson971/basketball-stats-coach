import { DeleteTeam } from '../../../../../src/application/use-cases/team/DeleteTeam';
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

describe('DeleteTeam Use Case', () => {
  let mockRepository: MockTeamRepository;
  let deleteTeam: DeleteTeam;
  const userId = 'user-123';

  beforeEach(() => {
    mockRepository = new MockTeamRepository();
    deleteTeam = new DeleteTeam(mockRepository);
  });

  test('should delete a team successfully', async () => {
    const team = new Team({ userId, name: 'Wild Cats' });
    mockRepository.teams.push(team);

    const result = await deleteTeam.execute(team.id, userId);

    expect(result.success).toBe(true);
    expect(mockRepository.teams.length).toBe(0);
  });

  test('should return error when team not found', async () => {
    const result = await deleteTeam.execute('non-existent-id', userId);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Team not found');
  });

  test('should not delete team from different user', async () => {
    const team = new Team({ userId, name: 'Wild Cats' });
    mockRepository.teams.push(team);

    const result = await deleteTeam.execute(team.id, 'different-user-id');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Team not found');
    expect(mockRepository.teams.length).toBe(1);
  });
});
