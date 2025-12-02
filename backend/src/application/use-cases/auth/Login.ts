import { User } from '../../../domain/entities/User';
import { IUserRepository } from '../../../domain/repositories/UserRepository';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResult {
  success: boolean;
  user?: Omit<ReturnType<User['toJSON']>, 'password'>;
  token?: string;
  error?: string;
}

export class Login {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: LoginInput): Promise<LoginResult> {
    try {
      // Find user by email
      const user = await this.userRepository.findByEmail(input.email);
      if (!user) {
        return {
          success: false,
          error: 'Invalid email or password',
        };
      }

      // Verify password
      const userData = user.toJSONWithPassword();
      const isPasswordValid = await bcrypt.compare(input.password, userData.password);
      if (!isPasswordValid) {
        return {
          success: false,
          error: 'Invalid email or password',
        };
      }

      // Generate JWT token
      const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
      const token = jwt.sign({ userId: user.id, email: user.email }, jwtSecret, {
        expiresIn: '7d',
      });

      return {
        success: true,
        user: user.toJSON(),
        token,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
