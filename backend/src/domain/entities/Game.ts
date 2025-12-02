import { v4 as uuidv4 } from 'uuid';

export type GameStatus = 'not_started' | 'in_progress' | 'completed';

export interface GameData {
  id?: string;
  userId: string;
  teamId: string;
  opponent: string;
  gameDate?: Date | null;
  location?: string | null;
  notes?: string | null;
  status?: GameStatus;
  startedAt?: Date | null;
  completedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Game {
  public readonly id: string;
  public readonly userId: string;
  public readonly teamId: string;
  public opponent: string;
  public gameDate: Date | null;
  public location: string | null;
  public notes: string | null;
  public status: GameStatus;
  public startedAt: Date | null;
  public completedAt: Date | null;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(data: GameData) {
    this.id = data.id || uuidv4();
    this.userId = data.userId;
    this.teamId = data.teamId;
    this.opponent = data.opponent;
    this.gameDate = data.gameDate || null;
    this.location = data.location || null;
    this.notes = data.notes || null;
    this.status = data.status || 'not_started';
    this.startedAt = data.startedAt || null;
    this.completedAt = data.completedAt || null;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();

    this.validate();
  }

  private validate(): void {
    if (!this.userId || this.userId.trim() === '') {
      throw new Error('User ID is required');
    }

    if (!this.teamId || this.teamId.trim() === '') {
      throw new Error('Team ID is required');
    }

    if (!this.opponent || this.opponent.trim() === '') {
      throw new Error('Opponent is required');
    }

    const validStatuses: GameStatus[] = ['not_started', 'in_progress', 'completed'];
    if (!validStatuses.includes(this.status)) {
      throw new Error('Invalid game status');
    }
  }

  public start(): void {
    if (this.status !== 'not_started') {
      throw new Error('Game is already in progress or completed');
    }

    this.status = 'in_progress';
    this.startedAt = new Date();
    this.updatedAt = new Date();
  }

  public complete(): void {
    if (this.status !== 'in_progress') {
      throw new Error('Game must be in progress to complete');
    }

    this.status = 'completed';
    this.completedAt = new Date();
    this.updatedAt = new Date();
  }

  public isInProgress(): boolean {
    return this.status === 'in_progress';
  }

  public isCompleted(): boolean {
    return this.status === 'completed';
  }

  public update(data: Partial<GameData>): void {
    const immutableFields = ['id', 'userId', 'createdAt', 'teamId', 'startedAt', 'completedAt'];

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
      teamId: this.teamId,
      opponent: this.opponent,
      gameDate: this.gameDate,
      location: this.location,
      notes: this.notes,
      status: this.status,
      startedAt: this.startedAt,
      completedAt: this.completedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
