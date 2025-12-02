import { v4 as uuidv4 } from 'uuid';

export interface UserData {
  id?: string;
  email: string;
  password: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  public readonly id: string;
  public email: string;
  public password: string;
  public name: string;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(data: UserData) {
    this.id = data.id || uuidv4();
    this.email = data.email;
    this.password = data.password;
    this.name = data.name;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();

    this.validate();
  }

  private validate(): void {
    if (!this.email || this.email.trim() === '') {
      throw new Error('Email is required');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      throw new Error('Invalid email format');
    }

    if (!this.password || this.password.trim() === '') {
      throw new Error('Password is required');
    }

    if (this.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    if (!this.name || this.name.trim() === '') {
      throw new Error('Name is required');
    }
  }

  public update(data: Partial<UserData>): void {
    const immutableFields = ['id', 'createdAt'];

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
      email: this.email,
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  // Method to get user data with password (for authentication)
  public toJSONWithPassword(): Record<string, unknown> {
    return {
      id: this.id,
      email: this.email,
      password: this.password,
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
