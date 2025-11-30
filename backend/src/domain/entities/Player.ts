import { v4 as uuidv4 } from 'uuid';

export interface PlayerData {
  id?: string;
  firstName: string;
  lastName: string;
  teamId: string;
  nickname?: string | null;
  height?: number | null; // in cm
  weight?: number | null; // in kg
  age?: number | null;
  gender?: 'M' | 'F' | null;
  grade?: string | null;
  position?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Player {
  public readonly id: string;
  public firstName: string;
  public lastName: string;
  public readonly teamId: string;
  public nickname: string | null;
  public height: number | null;
  public weight: number | null;
  public age: number | null;
  public gender: 'M' | 'F' | null;
  public grade: string | null;
  public position: string | null;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(data: PlayerData) {
    this.id = data.id || uuidv4();
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.teamId = data.teamId;
    this.nickname = data.nickname || null;
    this.height = data.height || null;
    this.weight = data.weight || null;
    this.age = data.age || null;
    this.gender = data.gender || null;
    this.grade = data.grade || null;
    this.position = data.position || null;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();

    this.validate();
  }

  private validate(): void {
    if (!this.firstName || this.firstName.trim() === '') {
      throw new Error('First name is required');
    }

    if (!this.lastName || this.lastName.trim() === '') {
      throw new Error('Last name is required');
    }

    if (!this.teamId || this.teamId.trim() === '') {
      throw new Error('Team ID is required');
    }

    if (this.height !== null && this.height <= 0) {
      throw new Error('Height must be positive');
    }

    if (this.weight !== null && this.weight <= 0) {
      throw new Error('Weight must be positive');
    }

    if (this.age !== null && (this.age < 5 || this.age > 100)) {
      throw new Error('Age must be between 5 and 100');
    }

    if (this.gender !== null && !['M', 'F'].includes(this.gender)) {
      throw new Error('Gender must be M or F');
    }
  }

  public getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  public getDisplayName(): string {
    if (this.nickname) {
      return `${this.nickname} (${this.getFullName()})`;
    }
    return this.getFullName();
  }

  public update(data: Partial<PlayerData>): void {
    const immutableFields = ['id', 'createdAt', 'teamId'];

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
      firstName: this.firstName,
      lastName: this.lastName,
      teamId: this.teamId,
      nickname: this.nickname,
      height: this.height,
      weight: this.weight,
      age: this.age,
      gender: this.gender,
      grade: this.grade,
      position: this.position,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
