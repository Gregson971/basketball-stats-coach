import { Team } from '../../../../domain/entities/Team';
import { ITeamDocument } from '../models/TeamModel';

export class TeamMapper {
  static toDomain(doc: ITeamDocument): Team {
    return new Team({
      id: doc._id,
      userId: doc.userId,
      name: doc.name,
      coach: doc.coach,
      season: doc.season,
      league: doc.league,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toPersistence(team: Team): Partial<ITeamDocument> {
    return {
      _id: team.id,
      userId: team.userId,
      name: team.name,
      coach: team.coach || undefined,
      season: team.season || undefined,
      league: team.league || undefined,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
    };
  }
}
