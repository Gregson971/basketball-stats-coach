import { v4 as uuidv4 } from 'uuid';

export interface SubstitutionData {
  id?: string;
  gameId: string;
  quarter: number;
  playerOut: string;
  playerIn: string;
  timestamp?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Substitution {
  public readonly id: string;
  public readonly gameId: string;
  public readonly quarter: number;
  public readonly playerOut: string;
  public readonly playerIn: string;
  public readonly timestamp: Date;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(data: SubstitutionData) {
    this.id = data.id || uuidv4();
    this.gameId = data.gameId;
    this.quarter = data.quarter;
    this.playerOut = data.playerOut;
    this.playerIn = data.playerIn;
    this.timestamp = data.timestamp || new Date();
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();

    this.validate();
  }

  private validate(): void {
    if (!this.gameId || this.gameId.trim() === '') {
      throw new Error('Game ID is required');
    }

    if (this.quarter < 1 || this.quarter > 4) {
      throw new Error('Quarter must be between 1 and 4');
    }

    if (!this.playerOut || this.playerOut.trim() === '') {
      throw new Error('Player out is required');
    }

    if (!this.playerIn || this.playerIn.trim() === '') {
      throw new Error('Player in is required');
    }

    if (this.playerOut === this.playerIn) {
      throw new Error('Player out and player in must be different');
    }
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      gameId: this.gameId,
      quarter: this.quarter,
      playerOut: this.playerOut,
      playerIn: this.playerIn,
      timestamp: this.timestamp,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
