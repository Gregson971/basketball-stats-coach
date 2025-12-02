import request from 'supertest';
import { Application } from 'express';
import { createApp } from '../../src/presentation/app';
import {
  MockPlayerRepository,
  MockTeamRepository,
  MockGameRepository,
  MockGameStatsRepository,
  MockUserRepository,
} from './setup/mockRepositories';
import * as jwt from 'jsonwebtoken';

describe('Auth API Endpoints', () => {
  let app: Application;
  let userRepository: MockUserRepository;

  beforeAll(() => {
    const playerRepository = new MockPlayerRepository();
    const teamRepository = new MockTeamRepository();
    const gameRepository = new MockGameRepository();
    const gameStatsRepository = new MockGameStatsRepository();
    userRepository = new MockUserRepository();

    app = createApp({
      playerRepository,
      teamRepository,
      gameRepository,
      gameStatsRepository,
      userRepository,
    });
  });

  beforeEach(() => {
    userRepository.users = [];
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user with valid data', async () => {
      const userData = {
        email: 'john.doe@example.com',
        password: 'password123',
        name: 'John Doe',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe('john.doe@example.com');
      expect(response.body.user.name).toBe('John Doe');
      expect(response.body.user.id).toBeDefined();
      expect(response.body.token).toBeDefined();

      // Password should not be in response
      expect(response.body.user.password).toBeUndefined();
    });

    it('should generate a valid JWT token on registration', async () => {
      const userData = {
        email: 'jane.smith@example.com',
        password: 'securepass456',
        name: 'Jane Smith',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.token).toBeDefined();

      // Verify token
      const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
      const decoded = jwt.verify(response.body.token, jwtSecret) as any;

      expect(decoded.userId).toBe(response.body.user.id);
      expect(decoded.email).toBe('jane.smith@example.com');
      expect(decoded.exp).toBeDefined();
    });

    it('should return 400 when email is missing', async () => {
      const userData = {
        password: 'password123',
        name: 'John Doe',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Missing required fields');
    });

    it('should return 400 when email format is invalid', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'password123',
        name: 'John Doe',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid email format');
    });

    it('should return 400 when password is missing', async () => {
      const userData = {
        email: 'john.doe@example.com',
        name: 'John Doe',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Missing required fields');
    });

    it('should return 400 when name is missing', async () => {
      const userData = {
        email: 'john.doe@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Missing required fields');
    });

    it('should return 400 when user with email already exists', async () => {
      const userData = {
        email: 'duplicate@example.com',
        password: 'password123',
        name: 'First User',
      };

      // Register first user
      await request(app).post('/api/auth/register').send(userData).expect(201);

      // Try to register again with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'differentpass',
          name: 'Second User',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('User with this email already exists');
    });

    it('should be case-insensitive for duplicate email check', async () => {
      const userData1 = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      await request(app).post('/api/auth/register').send(userData1).expect(201);

      const userData2 = {
        email: 'TEST@EXAMPLE.COM',
        password: 'password456',
        name: 'Another User',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData2)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('User with this email already exists');
    });

    it('should hash the password before storing', async () => {
      const userData = {
        email: 'secure@example.com',
        password: 'plainpassword',
        name: 'Secure User',
      };

      await request(app).post('/api/auth/register').send(userData).expect(201);

      // Check that password is hashed in repository
      const user = await userRepository.findByEmail('secure@example.com');
      expect(user).toBeDefined();
      expect(user?.password).not.toBe('plainpassword');
      expect(user?.password.length).toBeGreaterThan(20); // Bcrypt hashes are long
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Register a test user before each login test
      await request(app).post('/api/auth/register').send({
        email: 'testuser@example.com',
        password: 'testpassword123',
        name: 'Test User',
      });
    });

    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'testuser@example.com',
        password: 'testpassword123',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe('testuser@example.com');
      expect(response.body.user.name).toBe('Test User');
      expect(response.body.token).toBeDefined();

      // Password should not be in response
      expect(response.body.user.password).toBeUndefined();
    });

    it('should generate a valid JWT token on login', async () => {
      const loginData = {
        email: 'testuser@example.com',
        password: 'testpassword123',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.token).toBeDefined();

      // Verify token
      const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
      const decoded = jwt.verify(response.body.token, jwtSecret) as any;

      expect(decoded.userId).toBe(response.body.user.id);
      expect(decoded.email).toBe('testuser@example.com');
    });

    it('should return 401 when user does not exist', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'anypassword',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid email or password');
      expect(response.body.user).toBeUndefined();
      expect(response.body.token).toBeUndefined();
    });

    it('should return 401 when password is incorrect', async () => {
      const loginData = {
        email: 'testuser@example.com',
        password: 'wrongpassword',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid email or password');
      expect(response.body.user).toBeUndefined();
      expect(response.body.token).toBeUndefined();
    });

    it('should be case-insensitive for email', async () => {
      const loginData = {
        email: 'TESTUSER@EXAMPLE.COM',
        password: 'testpassword123',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
    });

    it('should return 400 when email is missing', async () => {
      const loginData = {
        password: 'testpassword123',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('required');
    });

    it('should return 400 when password is missing', async () => {
      const loginData = {
        email: 'testuser@example.com',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('required');
    });

    it('should not reveal if email exists when password is wrong', async () => {
      // Login with wrong password for existing user
      const response1 = await request(app).post('/api/auth/login').send({
        email: 'testuser@example.com',
        password: 'wrongpassword',
      });

      // Login with non-existent user
      const response2 = await request(app).post('/api/auth/login').send({
        email: 'nonexistent@example.com',
        password: 'anypassword',
      });

      // Both should return the same error message
      expect(response1.body.error).toBe(response2.body.error);
      expect(response1.body.error).toBe('Invalid email or password');
      expect(response1.status).toBe(401);
      expect(response2.status).toBe(401);
    });

    it('should handle multiple login sessions', async () => {
      const loginData = {
        email: 'testuser@example.com',
        password: 'testpassword123',
      };

      const response1 = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      const response2 = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response1.body.success).toBe(true);
      expect(response2.body.success).toBe(true);
      expect(response1.body.token).toBeDefined();
      expect(response2.body.token).toBeDefined();
    });
  });

  describe('Authentication Flow', () => {
    it('should complete full registration and login flow', async () => {
      // Step 1: Register a new user
      const registerData = {
        email: 'flowtest@example.com',
        password: 'flowpassword123',
        name: 'Flow Test User',
      };

      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(registerData)
        .expect(201);

      expect(registerResponse.body.success).toBe(true);
      const registrationToken = registerResponse.body.token;

      // Step 2: Login with the same credentials
      const loginData = {
        email: 'flowtest@example.com',
        password: 'flowpassword123',
      };

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(loginResponse.body.success).toBe(true);
      const loginToken = loginResponse.body.token;

      // Both tokens should be valid but different (different iat)
      expect(registrationToken).toBeDefined();
      expect(loginToken).toBeDefined();

      // Decode both tokens
      const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
      const decodedRegister = jwt.verify(registrationToken, jwtSecret) as any;
      const decodedLogin = jwt.verify(loginToken, jwtSecret) as any;

      // Should contain same user info
      expect(decodedRegister.userId).toBe(decodedLogin.userId);
      expect(decodedRegister.email).toBe(decodedLogin.email);
    });
  });
});
