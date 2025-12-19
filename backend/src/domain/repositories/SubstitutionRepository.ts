import { Substitution } from '../entities/Substitution';

export interface ISubstitutionRepository {
  findById(id: string, userId: string): Promise<Substitution | null>;
  findByGameId(gameId: string, userId: string): Promise<Substitution[]>;
  findByUserId(userId: string): Promise<Substitution[]>;
  save(substitution: Substitution): Promise<Substitution>;
  delete(id: string, userId: string): Promise<boolean>;
  deleteByUserId(userId: string): Promise<number>;
  deleteByGameId(gameId: string, userId: string): Promise<number>;
}
