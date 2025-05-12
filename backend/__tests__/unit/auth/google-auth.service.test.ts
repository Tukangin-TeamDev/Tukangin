import { PrismaClient } from '@prisma/client';
import { registerWithGoogle, loginWithGoogle } from '../../../src/api/auth/auth.service';
import { AuthProvider } from '../../../src/types/user.types';

// Definisikan UserRole enum untuk testing
enum UserRole {
  ADMIN = 'ADMIN',
  PROVIDER = 'PROVIDER',
  CUSTOMER = 'CUSTOMER'
}

// Mock PrismaClient
jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

// Mock generateAccessToken dan generateRefreshToken untuk menghindari error JWT
jest.mock('../../../src/api/auth/auth.service', () => {
  const originalModule = jest.requireActual('../../../src/api/auth/auth.service');
  return {
    ...originalModule,
    // Hanya export fungsi yang kita butuhkan untuk ditest, mock yang lain
    generateAccessToken: jest.fn(() => 'mocked-access-token'),
    generateRefreshToken: jest.fn(() => 'mocked-refresh-token'),
  };
});

describe('Google Auth Service', () => {
  let prismaClient: any;

  beforeEach(() => {
    prismaClient = new PrismaClient();
    // Reset mocks
    jest.clearAllMocks();
  });

  describe('registerWithGoogle', () => {
    const googleData = {
      googleId: 'test-google-id',
      email: 'test@example.com',
      name: 'Test User',
    };

    const mockUser = {
      id: 1,
      email: googleData.email,
      name: googleData.name,
      googleId: googleData.googleId,
      authProvider: AuthProvider.GOOGLE,
      role: UserRole.CUSTOMER,
      password: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should register a new user if user does not exist', async () => {
      // Setup
      prismaClient.user.findUnique.mockResolvedValue(null);
      prismaClient.user.create.mockResolvedValue(mockUser);

      // Execute
      const result = await registerWithGoogle(googleData);

      // Verify
      expect(prismaClient.user.findUnique).toHaveBeenCalledWith({
        where: { email: googleData.email },
      });
      expect(prismaClient.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: googleData.email,
          name: googleData.name,
          googleId: googleData.googleId,
          authProvider: AuthProvider.GOOGLE,
          role: UserRole.CUSTOMER,
        }),
      });

      expect(result).toEqual({
        user: expect.objectContaining({
          email: googleData.email,
          name: googleData.name,
        }),
        token: 'mocked-access-token',
        refreshToken: 'mocked-refresh-token',
      });
    });

    it('should update existing user with Google ID if user exists without googleId', async () => {
      // Setup
      const existingUser = {
        ...mockUser,
        googleId: null,
        authProvider: AuthProvider.LOCAL,
      };
      
      prismaClient.user.findUnique.mockResolvedValue(existingUser);
      prismaClient.user.update.mockResolvedValue({
        ...existingUser,
        googleId: googleData.googleId,
        authProvider: AuthProvider.GOOGLE,
      });

      // Execute
      const result = await registerWithGoogle(googleData);

      // Verify
      expect(prismaClient.user.findUnique).toHaveBeenCalledWith({
        where: { email: googleData.email },
      });
      expect(prismaClient.user.update).toHaveBeenCalledWith({
        where: { id: existingUser.id },
        data: expect.objectContaining({
          googleId: googleData.googleId,
          authProvider: AuthProvider.GOOGLE,
        }),
      });

      expect(result).toEqual({
        user: expect.objectContaining({
          email: googleData.email,
          name: googleData.name,
        }),
        token: 'mocked-access-token',
        refreshToken: 'mocked-refresh-token',
      });
    });

    it('should return existing user data if user exists with googleId', async () => {
      // Setup
      prismaClient.user.findUnique.mockResolvedValue(mockUser);

      // Execute
      const result = await registerWithGoogle(googleData);

      // Verify
      expect(prismaClient.user.findUnique).toHaveBeenCalledWith({
        where: { email: googleData.email },
      });
      expect(prismaClient.user.update).not.toHaveBeenCalled();

      expect(result).toEqual({
        user: expect.objectContaining({
          email: googleData.email,
          name: googleData.name,
        }),
        token: 'mocked-access-token',
        refreshToken: 'mocked-refresh-token',
      });
    });
  });

  describe('loginWithGoogle', () => {
    const googleId = 'test-google-id';
    const email = 'test@example.com';

    const mockUser = {
      id: 1,
      email: email,
      name: 'Test User',
      googleId: googleId,
      authProvider: AuthProvider.GOOGLE,
      role: UserRole.CUSTOMER,
      password: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should login a user with Google account', async () => {
      // Setup
      prismaClient.user.findFirst.mockResolvedValue(mockUser);

      // Execute
      const result = await loginWithGoogle(googleId, email);

      // Verify
      expect(prismaClient.user.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [
            { googleId },
            { email, authProvider: AuthProvider.GOOGLE },
          ],
        },
      });

      expect(result).toEqual({
        user: expect.objectContaining({
          email: email,
          name: mockUser.name,
        }),
        token: 'mocked-access-token',
        refreshToken: 'mocked-refresh-token',
      });
    });

    it('should throw error if user with Google account does not exist', async () => {
      // Setup
      prismaClient.user.findFirst.mockResolvedValue(null);

      // Execute & Verify
      await expect(loginWithGoogle(googleId, email)).rejects.toThrow(
        'Akun Google tidak ditemukan. Silakan register terlebih dahulu.'
      );
    });
  });
}); 