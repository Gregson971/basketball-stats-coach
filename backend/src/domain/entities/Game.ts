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
  currentQuarter?: number;
  roster?: string[];
  startingLineup?: string[];
  currentLineup?: string[];
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
  public currentQuarter: number;
  public roster: string[];
  public startingLineup: string[];
  public currentLineup: string[];
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
    this.currentQuarter = data.currentQuarter || 1;
    this.roster = data.roster || [];
    this.startingLineup = data.startingLineup || [];
    this.currentLineup = data.currentLineup || [];
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

    if (!this.canStart()) {
      throw new Error('Cannot start game: roster and starting lineup must be set');
    }

    this.status = 'in_progress';
    this.currentQuarter = 1;
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

  public setRoster(playerIds: string[]): void {
    if (playerIds.length < 5) {
      throw new Error('Au moins 5 joueurs doivent être convoqués');
    }
    if (playerIds.length > 15) {
      throw new Error('Maximum 15 joueurs peuvent être convoqués');
    }
    if (this.status !== 'not_started') {
      throw new Error('Cannot modify roster of a started game');
    }

    // Vérifier qu'il n'y a pas de doublons
    const uniquePlayerIds = new Set(playerIds);
    if (uniquePlayerIds.size !== playerIds.length) {
      throw new Error('Roster contains duplicate players');
    }

    this.roster = [...playerIds];
    this.updatedAt = new Date();
  }

  public setStartingLineup(playerIds: string[]): void {
    if (playerIds.length !== 5) {
      throw new Error('La composition de départ doit contenir exactement 5 joueurs');
    }
    if (!playerIds.every((id) => this.roster.includes(id))) {
      throw new Error('Les titulaires doivent faire partie des joueurs convoqués');
    }
    if (this.status !== 'not_started') {
      throw new Error('Cannot modify lineup of a started game');
    }

    // Vérifier qu'il n'y a pas de doublons
    const uniquePlayerIds = new Set(playerIds);
    if (uniquePlayerIds.size !== playerIds.length) {
      throw new Error('Starting lineup contains duplicate players');
    }

    this.startingLineup = [...playerIds];
    this.currentLineup = [...playerIds];
    this.updatedAt = new Date();
  }

  public substitutePlayer(playerOut: string, playerIn: string): void {
    if (!this.isInProgress()) {
      throw new Error('Les changements ne peuvent être effectués que pendant un match en cours');
    }
    if (!this.currentLineup.includes(playerOut)) {
      throw new Error('Le joueur sortant doit être sur le terrain');
    }
    if (!this.roster.includes(playerIn)) {
      throw new Error('Le joueur entrant doit faire partie des joueurs convoqués');
    }
    if (this.currentLineup.includes(playerIn)) {
      throw new Error('Le joueur entrant est déjà sur le terrain');
    }

    const index = this.currentLineup.indexOf(playerOut);
    this.currentLineup[index] = playerIn;
    this.updatedAt = new Date();
  }

  public nextQuarter(): void {
    if (!this.isInProgress()) {
      throw new Error('Le match doit être en cours');
    }
    if (this.currentQuarter >= 4) {
      throw new Error('Le match est au dernier quart-temps');
    }

    this.currentQuarter++;
    this.updatedAt = new Date();
  }

  public canStart(): boolean {
    return (
      this.status === 'not_started' &&
      this.roster.length >= 5 &&
      this.startingLineup.length === 5
    );
  }

  public update(data: Partial<GameData>): void {
    const immutableFields = ['id', 'userId', 'createdAt', 'teamId', 'startedAt', 'completedAt'];

    Object.keys(data).forEach((key) => {
      if (!immutableFields.includes(key) && key in this) {
        (this as Record<string, unknown>)[key] = (data as Record<string, unknown>)[key];
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

  public toJSON(): Record<string, unknown> {
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
      currentQuarter: this.currentQuarter,
      roster: this.roster,
      startingLineup: this.startingLineup,
      currentLineup: this.currentLineup,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
