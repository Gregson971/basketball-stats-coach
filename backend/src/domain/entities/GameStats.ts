import { v4 as uuidv4 } from 'uuid';

export type ActionType =
  | 'freeThrow'
  | 'twoPoint'
  | 'threePoint'
  | 'offensiveRebound'
  | 'defensiveRebound'
  | 'assist'
  | 'steal'
  | 'block'
  | 'turnover'
  | 'personalFoul';

export interface ActionHistoryItem {
  type: ActionType;
  made?: boolean;
}

export interface GameStatsData {
  id?: string;
  gameId: string;
  playerId: string;
  freeThrowsMade?: number;
  freeThrowsAttempted?: number;
  twoPointsMade?: number;
  twoPointsAttempted?: number;
  threePointsMade?: number;
  threePointsAttempted?: number;
  offensiveRebounds?: number;
  defensiveRebounds?: number;
  assists?: number;
  steals?: number;
  blocks?: number;
  turnovers?: number;
  personalFouls?: number;
  minutesPlayed?: number;
  actionHistory?: ActionHistoryItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class GameStats {
  public readonly id: string;
  public readonly gameId: string;
  public readonly playerId: string;

  // Shooting stats
  public freeThrowsMade: number;
  public freeThrowsAttempted: number;
  public twoPointsMade: number;
  public twoPointsAttempted: number;
  public threePointsMade: number;
  public threePointsAttempted: number;

  // Other stats
  public offensiveRebounds: number;
  public defensiveRebounds: number;
  public assists: number;
  public steals: number;
  public blocks: number;
  public turnovers: number;
  public personalFouls: number;
  public minutesPlayed: number;

  // Action history for undo
  public actionHistory: ActionHistoryItem[];

  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(data: GameStatsData) {
    this.id = data.id || uuidv4();
    this.gameId = data.gameId;
    this.playerId = data.playerId;

    // Initialize shooting stats
    this.freeThrowsMade = data.freeThrowsMade || 0;
    this.freeThrowsAttempted = data.freeThrowsAttempted || 0;
    this.twoPointsMade = data.twoPointsMade || 0;
    this.twoPointsAttempted = data.twoPointsAttempted || 0;
    this.threePointsMade = data.threePointsMade || 0;
    this.threePointsAttempted = data.threePointsAttempted || 0;

    // Initialize other stats
    this.offensiveRebounds = data.offensiveRebounds || 0;
    this.defensiveRebounds = data.defensiveRebounds || 0;
    this.assists = data.assists || 0;
    this.steals = data.steals || 0;
    this.blocks = data.blocks || 0;
    this.turnovers = data.turnovers || 0;
    this.personalFouls = data.personalFouls || 0;
    this.minutesPlayed = data.minutesPlayed || 0;

    // Initialize action history
    this.actionHistory = data.actionHistory || [];

    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();

    this.validate();
  }

  private validate(): void {
    if (!this.gameId || this.gameId.trim() === '') {
      throw new Error('Game ID is required');
    }

    if (!this.playerId || this.playerId.trim() === '') {
      throw new Error('Player ID is required');
    }
  }

  public recordFreeThrow(made: boolean): void {
    this.freeThrowsAttempted++;
    if (made) {
      this.freeThrowsMade++;
    }
    this.actionHistory.push({ type: 'freeThrow', made });
    this.updatedAt = new Date();
  }

  public recordTwoPoint(made: boolean): void {
    this.twoPointsAttempted++;
    if (made) {
      this.twoPointsMade++;
    }
    this.actionHistory.push({ type: 'twoPoint', made });
    this.updatedAt = new Date();
  }

  public recordThreePoint(made: boolean): void {
    this.threePointsAttempted++;
    if (made) {
      this.threePointsMade++;
    }
    this.actionHistory.push({ type: 'threePoint', made });
    this.updatedAt = new Date();
  }

  public recordOffensiveRebound(): void {
    this.offensiveRebounds++;
    this.actionHistory.push({ type: 'offensiveRebound' });
    this.updatedAt = new Date();
  }

  public recordDefensiveRebound(): void {
    this.defensiveRebounds++;
    this.actionHistory.push({ type: 'defensiveRebound' });
    this.updatedAt = new Date();
  }

  public recordAssist(): void {
    this.assists++;
    this.actionHistory.push({ type: 'assist' });
    this.updatedAt = new Date();
  }

  public recordSteal(): void {
    this.steals++;
    this.actionHistory.push({ type: 'steal' });
    this.updatedAt = new Date();
  }

  public recordBlock(): void {
    this.blocks++;
    this.actionHistory.push({ type: 'block' });
    this.updatedAt = new Date();
  }

  public recordTurnover(): void {
    this.turnovers++;
    this.actionHistory.push({ type: 'turnover' });
    this.updatedAt = new Date();
  }

  public recordPersonalFoul(): void {
    this.personalFouls++;
    this.actionHistory.push({ type: 'personalFoul' });
    this.updatedAt = new Date();
  }

  public addMinutes(minutes: number): void {
    this.minutesPlayed += minutes;
    this.updatedAt = new Date();
  }

  public getTotalPoints(): number {
    return (this.freeThrowsMade * 1) +
           (this.twoPointsMade * 2) +
           (this.threePointsMade * 3);
  }

  public getTotalRebounds(): number {
    return this.offensiveRebounds + this.defensiveRebounds;
  }

  public getFieldGoalPercentage(): number {
    const totalAttempts = this.twoPointsAttempted + this.threePointsAttempted;
    if (totalAttempts === 0) return 0;

    const totalMade = this.twoPointsMade + this.threePointsMade;
    return Math.round((totalMade / totalAttempts) * 1000) / 10;
  }

  public getFreeThrowPercentage(): number {
    if (this.freeThrowsAttempted === 0) return 0;
    return Math.round((this.freeThrowsMade / this.freeThrowsAttempted) * 1000) / 10;
  }

  public getThreePointPercentage(): number {
    if (this.threePointsAttempted === 0) return 0;
    return Math.round((this.threePointsMade / this.threePointsAttempted) * 1000) / 10;
  }

  public undoLastAction(): void {
    if (this.actionHistory.length === 0) {
      throw new Error('No actions to undo');
    }

    const lastAction = this.actionHistory.pop()!;

    switch (lastAction.type) {
      case 'freeThrow':
        this.freeThrowsAttempted--;
        if (lastAction.made) {
          this.freeThrowsMade--;
        }
        break;
      case 'twoPoint':
        this.twoPointsAttempted--;
        if (lastAction.made) {
          this.twoPointsMade--;
        }
        break;
      case 'threePoint':
        this.threePointsAttempted--;
        if (lastAction.made) {
          this.threePointsMade--;
        }
        break;
      case 'offensiveRebound':
        this.offensiveRebounds--;
        break;
      case 'defensiveRebound':
        this.defensiveRebounds--;
        break;
      case 'assist':
        this.assists--;
        break;
      case 'steal':
        this.steals--;
        break;
      case 'block':
        this.blocks--;
        break;
      case 'turnover':
        this.turnovers--;
        break;
      case 'personalFoul':
        this.personalFouls--;
        break;
    }

    this.updatedAt = new Date();
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
      gameId: this.gameId,
      playerId: this.playerId,
      freeThrowsMade: this.freeThrowsMade,
      freeThrowsAttempted: this.freeThrowsAttempted,
      twoPointsMade: this.twoPointsMade,
      twoPointsAttempted: this.twoPointsAttempted,
      threePointsMade: this.threePointsMade,
      threePointsAttempted: this.threePointsAttempted,
      offensiveRebounds: this.offensiveRebounds,
      defensiveRebounds: this.defensiveRebounds,
      assists: this.assists,
      steals: this.steals,
      blocks: this.blocks,
      turnovers: this.turnovers,
      personalFouls: this.personalFouls,
      minutesPlayed: this.minutesPlayed,
      totalPoints: this.getTotalPoints(),
      totalRebounds: this.getTotalRebounds(),
      fieldGoalPercentage: this.getFieldGoalPercentage(),
      freeThrowPercentage: this.getFreeThrowPercentage(),
      threePointPercentage: this.getThreePointPercentage(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
