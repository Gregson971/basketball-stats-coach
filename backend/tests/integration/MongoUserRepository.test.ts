import { MongoUserRepository } from '../../src/infrastructure/database/repositories/MongoUserRepository';
import { User } from '../../src/domain/entities/User';
import { setupDatabase, teardownDatabase, clearDatabase } from '../setup';

describe('MongoUserRepository Integration Tests', () => {
  let repository: MongoUserRepository;

  beforeAll(async () => {
    await setupDatabase();
  });

  afterAll(async () => {
    await teardownDatabase();
  });

  beforeEach(async () => {
    await clearDatabase();
    repository = new MongoUserRepository();
  });

  describe('save and findById', () => {
    test('should save and retrieve a user', async () => {
      const user = new User({
        email: 'john.doe@example.com',
        password: 'hashedpassword123',
        name: 'John Doe',
      });

      const saved = await repository.save(user);
      expect(saved.id).toBe(user.id);

      const found = await repository.findById(user.id);
      expect(found).not.toBeNull();
      expect(found?.email).toBe('john.doe@example.com');
      expect(found?.password).toBe('hashedpassword123');
      expect(found?.name).toBe('John Doe');
    });

    test('should update existing user', async () => {
      const user = new User({
        email: 'john.doe@example.com',
        password: 'hashedpassword123',
        name: 'John Doe',
      });

      await repository.save(user);

      user.update({ name: 'John Smith' });
      const updated = await repository.save(user);

      expect(updated.name).toBe('John Smith');

      const found = await repository.findById(user.id);
      expect(found?.name).toBe('John Smith');
      expect(found?.email).toBe('john.doe@example.com');
    });

    test('should update user password', async () => {
      const user = new User({
        email: 'john.doe@example.com',
        password: 'oldhashedpassword',
        name: 'John Doe',
      });

      await repository.save(user);

      user.update({ password: 'newhashedpassword' });
      await repository.save(user);

      const found = await repository.findById(user.id);
      expect(found?.password).toBe('newhashedpassword');
    });

    test('should return null for non-existent user', async () => {
      const found = await repository.findById('non-existent-id');
      expect(found).toBeNull();
    });
  });

  describe('findByEmail', () => {
    test('should find user by email', async () => {
      const user = new User({
        email: 'john.doe@example.com',
        password: 'hashedpassword123',
        name: 'John Doe',
      });

      await repository.save(user);

      const found = await repository.findByEmail('john.doe@example.com');
      expect(found).not.toBeNull();
      expect(found?.id).toBe(user.id);
      expect(found?.email).toBe('john.doe@example.com');
      expect(found?.name).toBe('John Doe');
    });

    test('should be case-insensitive for email search', async () => {
      const user = new User({
        email: 'john.doe@example.com',
        password: 'hashedpassword123',
        name: 'John Doe',
      });

      await repository.save(user);

      // Search with different cases
      const found1 = await repository.findByEmail('JOHN.DOE@EXAMPLE.COM');
      const found2 = await repository.findByEmail('John.Doe@Example.Com');
      const found3 = await repository.findByEmail('john.doe@example.com');

      expect(found1).not.toBeNull();
      expect(found2).not.toBeNull();
      expect(found3).not.toBeNull();

      expect(found1?.id).toBe(user.id);
      expect(found2?.id).toBe(user.id);
      expect(found3?.id).toBe(user.id);
    });

    test('should return null for non-existent email', async () => {
      const found = await repository.findByEmail('nonexistent@example.com');
      expect(found).toBeNull();
    });

    test('should handle multiple users with different emails', async () => {
      const user1 = new User({
        email: 'user1@example.com',
        password: 'password1',
        name: 'User One',
      });

      const user2 = new User({
        email: 'user2@example.com',
        password: 'password2',
        name: 'User Two',
      });

      await repository.save(user1);
      await repository.save(user2);

      const found1 = await repository.findByEmail('user1@example.com');
      const found2 = await repository.findByEmail('user2@example.com');

      expect(found1?.id).toBe(user1.id);
      expect(found1?.name).toBe('User One');

      expect(found2?.id).toBe(user2.id);
      expect(found2?.name).toBe('User Two');
    });
  });

  describe('findAll', () => {
    test('should find all users', async () => {
      await repository.save(
        new User({
          email: 'user1@example.com',
          password: 'password1',
          name: 'User One',
        })
      );

      await repository.save(
        new User({
          email: 'user2@example.com',
          password: 'password2',
          name: 'User Two',
        })
      );

      await repository.save(
        new User({
          email: 'user3@example.com',
          password: 'password3',
          name: 'User Three',
        })
      );

      const all = await repository.findAll();
      expect(all).toHaveLength(3);

      const emails = all.map((u) => u.email);
      expect(emails).toContain('user1@example.com');
      expect(emails).toContain('user2@example.com');
      expect(emails).toContain('user3@example.com');
    });

    test('should return empty array when no users exist', async () => {
      const all = await repository.findAll();
      expect(all).toEqual([]);
    });
  });

  describe('delete', () => {
    test('should delete a user', async () => {
      const user = new User({
        email: 'john.doe@example.com',
        password: 'hashedpassword123',
        name: 'John Doe',
      });

      await repository.save(user);

      const deleted = await repository.delete(user.id);
      expect(deleted).toBe(true);

      const found = await repository.findById(user.id);
      expect(found).toBeNull();

      const foundByEmail = await repository.findByEmail('john.doe@example.com');
      expect(foundByEmail).toBeNull();
    });

    test('should return false when deleting non-existent user', async () => {
      const deleted = await repository.delete('non-existent-id');
      expect(deleted).toBe(false);
    });

    test('should only delete specified user', async () => {
      const user1 = new User({
        email: 'user1@example.com',
        password: 'password1',
        name: 'User One',
      });

      const user2 = new User({
        email: 'user2@example.com',
        password: 'password2',
        name: 'User Two',
      });

      await repository.save(user1);
      await repository.save(user2);

      await repository.delete(user1.id);

      const found1 = await repository.findById(user1.id);
      const found2 = await repository.findById(user2.id);

      expect(found1).toBeNull();
      expect(found2).not.toBeNull();
    });
  });

  describe('data persistence', () => {
    test('should preserve all user fields', async () => {
      const user = new User({
        id: 'custom-user-id',
        email: 'test@example.com',
        password: 'hashedpassword',
        name: 'Test User',
      });

      await repository.save(user);

      const found = await repository.findById('custom-user-id');

      expect(found).not.toBeNull();
      expect(found?.id).toBe('custom-user-id');
      expect(found?.email).toBe('test@example.com');
      expect(found?.password).toBe('hashedpassword');
      expect(found?.name).toBe('Test User');
      expect(found?.createdAt).toBeInstanceOf(Date);
      expect(found?.updatedAt).toBeInstanceOf(Date);
    });

    test('should handle special characters in fields', async () => {
      const user = new User({
        email: 'test+tag@example-domain.co.uk',
        password: 'p@ssw0rd!#$%',
        name: "O'Brien-Smith Jr.",
      });

      await repository.save(user);

      const found = await repository.findByEmail('test+tag@example-domain.co.uk');

      expect(found).not.toBeNull();
      expect(found?.email).toBe('test+tag@example-domain.co.uk');
      expect(found?.password).toBe('p@ssw0rd!#$%');
      expect(found?.name).toBe("O'Brien-Smith Jr.");
    });
  });

  describe('email uniqueness', () => {
    test('should enforce email uniqueness constraint', async () => {
      const user1 = new User({
        email: 'duplicate@example.com',
        password: 'password1',
        name: 'User One',
      });

      const user2 = new User({
        email: 'duplicate@example.com',
        password: 'password2',
        name: 'User Two',
      });

      await repository.save(user1);

      // Attempting to save user2 with same email should throw
      await expect(repository.save(user2)).rejects.toThrow();
    });

    test('should enforce case-insensitive email uniqueness', async () => {
      const user1 = new User({
        email: 'test@example.com',
        password: 'password1',
        name: 'User One',
      });

      const user2 = new User({
        email: 'TEST@EXAMPLE.COM',
        password: 'password2',
        name: 'User Two',
      });

      await repository.save(user1);

      // Attempting to save user2 with same email (different case) should throw
      await expect(repository.save(user2)).rejects.toThrow();
    });
  });
});
