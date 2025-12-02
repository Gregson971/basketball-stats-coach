import { User, UserData } from '../../../domain/entities/User';
import { IUserRepository } from '../../../domain/repositories/UserRepository';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export interface RegisterResult {
  success: boolean;
  user?: Omit<ReturnType<User['toJSON']>, 'password'>;
  token?: string;
  error?: string;
}

export class Register {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: RegisterInput): Promise<RegisterResult> {
    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(input.email);
      if (existingUser) {
        return {
          success: false,
          error: 'User with this email already exists',
        };
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(input.password, salt);

      // Create user entity
      const userData: UserData = {
        email: input.email,
        password: hashedPassword,
        name: input.name,
      };

      const user = new User(userData);

      // Save to repository
      const savedUser = await this.userRepository.save(user);

      // Generate JWT token
      const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
      const token = jwt.sign({ userId: savedUser.id, email: savedUser.email }, jwtSecret, {
        expiresIn: '7d',
      });

      return {
        success: true,
        user: savedUser.toJSON(),
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
