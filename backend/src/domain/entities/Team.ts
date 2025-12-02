import { v4 as uuidv4 } from 'uuid';

export interface TeamData {
  id?: string;
  userId: string;
  name: string;
  coach?: string | null;
  season?: string | null;
  league?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Team {
  public readonly id: string;
  public readonly userId: string;
  public name: string;
  public coach: string | null;
  public season: string | null;
  public league: string | null;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(data: TeamData) {
    this.id = data.id || uuidv4();
    this.userId = data.userId;
    this.name = data.name;
    this.coach = data.coach || null;
    this.season = data.season || null;
    this.league = data.league || null;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();

    this.validate();
  }

  private validate(): void {
    if (!this.userId || this.userId.trim() === '') {
      throw new Error('User ID is required');
    }

    if (!this.name || this.name.trim() === '') {
      throw new Error('Team name is required');
    }
  }

  public update(data: Partial<TeamData>): void {
    const immutableFields = ['id', 'userId', 'createdAt'];

    Object.keys(data).forEach((key) => {
      if (!immutableFields.includes(key) && key in this) {
        (this as any)[key] = (data as any)[key];
      }
    });

    this.updatedAt = new Date();
    this.validate();
  }

  public isValid(): boolean {
    try {
      this.validate();
      return true;
    } catch {
      return false;
    }
  }

  public toJSON(): Record<string, any> {
    return {
      id: this.id,
      userId: this.userId,
      name: this.name,
      coach: this.coach,
      season: this.season,
      league: this.league,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
