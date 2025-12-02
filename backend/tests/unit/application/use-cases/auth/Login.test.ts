import { Login, LoginInput } from '../../../../../src/application/use-cases/auth/Login';
import { User, UserData } from '../../../../../src/domain/entities/User';
import { IUserRepository } from '../../../../../src/domain/repositories/UserRepository';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

// Mock repository
class MockUserRepository implements IUserRepository {
  private users: User[] = [];

  async findById(id: string): Promise<User | null> {
    return this.users.find((u) => u.id === id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  async save(user: User): Promise<User> {
    const existingIndex = this.users.findIndex((u) => u.id === user.id);
    if (existingIndex >= 0) {
      this.users[existingIndex] = user;
    } else {
      this.users.push(user);
    }
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index >= 0) {
      this.users.splice(index, 1);
      return true;
    }
    return false;
  }

  // Helper method for tests
  clear() {
    this.users = [];
  }
}

describe('Login Use Case', () => {
  let mockRepository: MockUserRepository;
  let login: Login;

  // Helper function to create a user with hashed password
  const createUserWithHashedPassword = async (
    email: string,
    plainPassword: string,
    name: string
  ): Promise<User> => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    const userData: UserData = {
      email,
      password: hashedPassword,
      name,
    };

    const user = new User(userData);
    await mockRepository.save(user);
    return user;
  };

  beforeEach(() => {
    mockRepository = new MockUserRepository();
    login = new Login(mockRepository);
  });

  test('should successfully login with valid credentials', async () => {
    // Create a user first
    await createUserWithHashedPassword('john.doe@example.com', 'password123', 'John Doe');

    const input: LoginInput = {
      email: 'john.doe@example.com',
      password: 'password123',
    };

    const result = await login.execute(input);

    expect(result.success).toBe(true);
    expect(result.user).toBeDefined();
    expect(result.user?.email).toBe('john.doe@example.com');
    expect(result.user?.name).toBe('John Doe');
    expect(result.token).toBeDefined();
    expect(result.error).toBeUndefined();
  });

  test('should not include password in returned user data', async () => {
    await createUserWithHashedPassword('john.doe@example.com', 'password123', 'John Doe');

    const input: LoginInput = {
      email: 'john.doe@example.com',
      password: 'password123',
    };

    const result = await login.execute(input);

    expect(result.success).toBe(true);
    expect(result.user).toBeDefined();
    expect((result.user as any).password).toBeUndefined();
  });

  test('should generate a valid JWT token', async () => {
    await createUserWithHashedPassword('john.doe@example.com', 'password123', 'John Doe');

    const input: LoginInput = {
      email: 'john.doe@example.com',
      password: 'password123',
    };

    const result = await login.execute(input);

    expect(result.success).toBe(true);
    expect(result.token).toBeDefined();

    // Verify token is valid
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    const decoded = jwt.verify(result.token!, jwtSecret) as any;

    expect(decoded.userId).toBeDefined();
    expect(decoded.email).toBe('john.doe@example.com');
    expect(decoded.exp).toBeDefined();
  });

  test('should return error when user does not exist', async () => {
    const input: LoginInput = {
      email: 'nonexistent@example.com',
      password: 'password123',
    };

    const result = await login.execute(input);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid email or password');
    expect(result.user).toBeUndefined();
    expect(result.token).toBeUndefined();
  });

  test('should return error when password is incorrect', async () => {
    await createUserWithHashedPassword('john.doe@example.com', 'password123', 'John Doe');

    const input: LoginInput = {
      email: 'john.doe@example.com',
      password: 'wrongpassword',
    };

    const result = await login.execute(input);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid email or password');
    expect(result.user).toBeUndefined();
    expect(result.token).toBeUndefined();
  });

  test('should be case-insensitive for email', async () => {
    await createUserWithHashedPassword('john.doe@example.com', 'password123', 'John Doe');

    const input: LoginInput = {
      email: 'JOHN.DOE@EXAMPLE.COM',
      password: 'password123',
    };

    const result = await login.execute(input);

    expect(result.success).toBe(true);
    expect(result.user).toBeDefined();
    expect(result.token).toBeDefined();
  });

  test('should not reveal if email exists when password is wrong', async () => {
    await createUserWithHashedPassword('john.doe@example.com', 'password123', 'John Doe');

    // Wrong password
    const result1 = await login.execute({
      email: 'john.doe@example.com',
      password: 'wrongpassword',
    });

    // Non-existent email
    const result2 = await login.execute({
      email: 'nonexistent@example.com',
      password: 'password123',
    });

    // Both should return the same error message (security best practice)
    expect(result1.error).toBe(result2.error);
    expect(result1.error).toBe('Invalid email or password');
  });

  test('should verify password with bcrypt', async () => {
    // Create user with known hashed password
    const plainPassword = 'mySecurePassword123';
    await createUserWithHashedPassword('john.doe@example.com', plainPassword, 'John Doe');

    // Login should succeed with correct password
    const result1 = await login.execute({
      email: 'john.doe@example.com',
      password: plainPassword,
    });
    expect(result1.success).toBe(true);

    // Login should fail with incorrect password
    const result2 = await login.execute({
      email: 'john.doe@example.com',
      password: 'wrongPassword',
    });
    expect(result2.success).toBe(false);
  });

  test('should handle empty email', async () => {
    const input: LoginInput = {
      email: '',
      password: 'password123',
    };

    const result = await login.execute(input);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid email or password');
  });

  test('should handle empty password', async () => {
    await createUserWithHashedPassword('john.doe@example.com', 'password123', 'John Doe');

    const input: LoginInput = {
      email: 'john.doe@example.com',
      password: '',
    };

    const result = await login.execute(input);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid email or password');
  });

  test('should handle repository errors gracefully', async () => {
    // Mock repository that throws an error
    const errorRepository = {
      findByEmail: jest.fn().mockRejectedValue(new Error('Database connection failed')),
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    } as unknown as IUserRepository;

    const loginWithError = new Login(errorRepository);

    const input: LoginInput = {
      email: 'john.doe@example.com',
      password: 'password123',
    };

    const result = await loginWithError.execute(input);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Database connection failed');
  });

  test('should include correct user id in token payload', async () => {
    const user = await createUserWithHashedPassword(
      'john.doe@example.com',
      'password123',
      'John Doe'
    );

    const input: LoginInput = {
      email: 'john.doe@example.com',
      password: 'password123',
    };

    const result = await login.execute(input);

    expect(result.success).toBe(true);

    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    const decoded = jwt.verify(result.token!, jwtSecret) as any;

    expect(decoded.userId).toBe(user.id);
    expect(decoded.email).toBe(user.email);
  });

  test('should handle multiple users with different credentials', async () => {
    await createUserWithHashedPassword('user1@example.com', 'password1', 'User One');
    await createUserWithHashedPassword('user2@example.com', 'password2', 'User Two');

    // Login as user1
    const result1 = await login.execute({
      email: 'user1@example.com',
      password: 'password1',
    });

    // Login as user2
    const result2 = await login.execute({
      email: 'user2@example.com',
      password: 'password2',
    });

    expect(result1.success).toBe(true);
    expect(result1.user?.name).toBe('User One');

    expect(result2.success).toBe(true);
    expect(result2.user?.name).toBe('User Two');

    // Cross-password test should fail
    const result3 = await login.execute({
      email: 'user1@example.com',
      password: 'password2',
    });

    expect(result3.success).toBe(false);
  });
});
