import { User, UserData } from '../../../src/domain/entities/User';

describe('User Entity', () => {
  describe('Creation', () => {
    test('should create a valid user with required fields', () => {
      const userData: UserData = {
        email: 'john.doe@example.com',
        password: 'password123',
        name: 'John Doe',
      };

      const user = new User(userData);

      expect(user.id).toBeDefined();
      expect(user.email).toBe('john.doe@example.com');
      expect(user.password).toBe('password123');
      expect(user.name).toBe('John Doe');
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    test('should create user with custom id and timestamps', () => {
      const customCreatedAt = new Date('2024-01-01');
      const customUpdatedAt = new Date('2024-01-02');
      const userData: UserData = {
        id: 'custom-id-123',
        email: 'jane.smith@example.com',
        password: 'securepass456',
        name: 'Jane Smith',
        createdAt: customCreatedAt,
        updatedAt: customUpdatedAt,
      };

      const user = new User(userData);

      expect(user.id).toBe('custom-id-123');
      expect(user.email).toBe('jane.smith@example.com');
      expect(user.createdAt).toEqual(customCreatedAt);
      expect(user.updatedAt).toEqual(customUpdatedAt);
    });

    test('should throw error if email is missing', () => {
      const userData = {
        password: 'password123',
        name: 'John Doe',
      } as UserData;

      expect(() => new User(userData)).toThrow('Email is required');
    });

    test('should throw error if email is empty string', () => {
      const userData: UserData = {
        email: '',
        password: 'password123',
        name: 'John Doe',
      };

      expect(() => new User(userData)).toThrow('Email is required');
    });

    test('should throw error if email is only whitespace', () => {
      const userData: UserData = {
        email: '   ',
        password: 'password123',
        name: 'John Doe',
      };

      expect(() => new User(userData)).toThrow('Email is required');
    });

    test('should throw error if email format is invalid', () => {
      const invalidEmails = [
        'notanemail',
        'missing@domain',
        '@nodomain.com',
        'no-at-sign.com',
        'spaces in@email.com',
        'double@@domain.com',
      ];

      invalidEmails.forEach((email) => {
        const userData: UserData = {
          email,
          password: 'password123',
          name: 'John Doe',
        };

        expect(() => new User(userData)).toThrow('Invalid email format');
      });
    });

    test('should accept valid email formats', () => {
      const validEmails = [
        'simple@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
        'user_name@example-domain.com',
        'test123@test123.com',
      ];

      validEmails.forEach((email) => {
        const userData: UserData = {
          email,
          password: 'password123',
          name: 'John Doe',
        };

        expect(() => new User(userData)).not.toThrow();
      });
    });

    test('should throw error if password is missing', () => {
      const userData = {
        email: 'john.doe@example.com',
        name: 'John Doe',
      } as UserData;

      expect(() => new User(userData)).toThrow('Password is required');
    });

    test('should throw error if password is empty string', () => {
      const userData: UserData = {
        email: 'john.doe@example.com',
        password: '',
        name: 'John Doe',
      };

      expect(() => new User(userData)).toThrow('Password is required');
    });

    test('should throw error if password is only whitespace', () => {
      const userData: UserData = {
        email: 'john.doe@example.com',
        password: '   ',
        name: 'John Doe',
      };

      expect(() => new User(userData)).toThrow('Password is required');
    });

    test('should throw error if password is less than 6 characters', () => {
      const invalidPasswords = ['12345', 'abc', 'a', '', '     '];

      invalidPasswords.forEach((password) => {
        const userData: UserData = {
          email: 'john.doe@example.com',
          password,
          name: 'John Doe',
        };

        if (password.trim() === '') {
          expect(() => new User(userData)).toThrow('Password is required');
        } else {
          expect(() => new User(userData)).toThrow('Password must be at least 6 characters long');
        }
      });
    });

    test('should accept password with exactly 6 characters', () => {
      const userData: UserData = {
        email: 'john.doe@example.com',
        password: '123456',
        name: 'John Doe',
      };

      expect(() => new User(userData)).not.toThrow();
    });

    test('should throw error if name is missing', () => {
      const userData = {
        email: 'john.doe@example.com',
        password: 'password123',
      } as UserData;

      expect(() => new User(userData)).toThrow('Name is required');
    });

    test('should throw error if name is empty string', () => {
      const userData: UserData = {
        email: 'john.doe@example.com',
        password: 'password123',
        name: '',
      };

      expect(() => new User(userData)).toThrow('Name is required');
    });

    test('should throw error if name is only whitespace', () => {
      const userData: UserData = {
        email: 'john.doe@example.com',
        password: 'password123',
        name: '   ',
      };

      expect(() => new User(userData)).toThrow('Name is required');
    });
  });

  describe('Methods', () => {
    test('should convert to JSON without password', () => {
      const user = new User({
        email: 'john.doe@example.com',
        password: 'password123',
        name: 'John Doe',
      });

      const json = user.toJSON();

      expect(json).toHaveProperty('id');
      expect(json).toHaveProperty('email', 'john.doe@example.com');
      expect(json).toHaveProperty('name', 'John Doe');
      expect(json).toHaveProperty('createdAt');
      expect(json).toHaveProperty('updatedAt');
      expect(json).not.toHaveProperty('password');
    });

    test('should convert to JSON with password using toJSONWithPassword', () => {
      const user = new User({
        email: 'john.doe@example.com',
        password: 'password123',
        name: 'John Doe',
      });

      const json = user.toJSONWithPassword();

      expect(json).toHaveProperty('id');
      expect(json).toHaveProperty('email', 'john.doe@example.com');
      expect(json).toHaveProperty('password', 'password123');
      expect(json).toHaveProperty('name', 'John Doe');
      expect(json).toHaveProperty('createdAt');
      expect(json).toHaveProperty('updatedAt');
    });

    test('should update user info', async () => {
      const user = new User({
        email: 'john.doe@example.com',
        password: 'password123',
        name: 'John Doe',
      });

      const originalUpdatedAt = user.updatedAt;

      // Wait a bit to ensure timestamp changes
      await new Promise((resolve) => setTimeout(resolve, 10));

      user.update({
        name: 'John Smith',
        email: 'john.smith@example.com',
      });

      expect(user.name).toBe('John Smith');
      expect(user.email).toBe('john.smith@example.com');
      expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });

    test('should update password', async () => {
      const user = new User({
        email: 'john.doe@example.com',
        password: 'password123',
        name: 'John Doe',
      });

      const originalUpdatedAt = user.updatedAt;

      // Wait a bit to ensure timestamp changes
      await new Promise((resolve) => setTimeout(resolve, 10));

      user.update({ password: 'newpassword456' });

      expect(user.password).toBe('newpassword456');
      expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });

    test('should validate email after update', () => {
      const user = new User({
        email: 'john.doe@example.com',
        password: 'password123',
        name: 'John Doe',
      });

      expect(() => user.update({ email: 'invalid-email' })).toThrow('Invalid email format');
    });

    test('should validate password after update', () => {
      const user = new User({
        email: 'john.doe@example.com',
        password: 'password123',
        name: 'John Doe',
      });

      expect(() => user.update({ password: '123' })).toThrow(
        'Password must be at least 6 characters long'
      );
    });

    test('should validate name after update', () => {
      const user = new User({
        email: 'john.doe@example.com',
        password: 'password123',
        name: 'John Doe',
      });

      expect(() => user.update({ name: '' })).toThrow('Name is required');
    });

    test('should not update immutable fields', () => {
      const user = new User({
        email: 'john.doe@example.com',
        password: 'password123',
        name: 'John Doe',
      });

      const originalId = user.id;
      const originalCreatedAt = user.createdAt;

      user.update({ id: 'new-id', createdAt: new Date() } as any);

      expect(user.id).toBe(originalId);
      expect(user.createdAt).toEqual(originalCreatedAt);
    });
  });

  describe('Validation', () => {
    test('should validate user data', () => {
      const user = new User({
        email: 'john.doe@example.com',
        password: 'password123',
        name: 'John Doe',
      });

      expect(user.isValid()).toBe(true);
    });

    test('should return false for invalid email', () => {
      const user = new User({
        email: 'john.doe@example.com',
        password: 'password123',
        name: 'John Doe',
      });

      // Manually set invalid data (bypassing constructor validation)
      (user as any).email = 'invalid-email';

      expect(user.isValid()).toBe(false);
    });

    test('should return false for invalid password', () => {
      const user = new User({
        email: 'john.doe@example.com',
        password: 'password123',
        name: 'John Doe',
      });

      // Manually set invalid data (bypassing constructor validation)
      (user as any).password = '123';

      expect(user.isValid()).toBe(false);
    });

    test('should return false for empty name', () => {
      const user = new User({
        email: 'john.doe@example.com',
        password: 'password123',
        name: 'John Doe',
      });

      // Manually set invalid data (bypassing constructor validation)
      (user as any).name = '';

      expect(user.isValid()).toBe(false);
    });
  });
});
