import request from 'supertest';
import app from '../../../src/app';
import * as authService from '../../../src/api/auth/auth.service';

// Mock auth service untuk integration test
jest.mock('../../../src/api/auth/auth.service', () => ({
  loginWithGoogle: jest.fn(),
  registerWithGoogle: jest.fn(),
  // Preserve other exports
  ...jest.requireActual('../../../src/api/auth/auth.service'),
}));

// Mock audit middleware
jest.mock('../../../src/middleware/audit.middleware', () => ({
  createAdminAuditLog: jest.fn().mockResolvedValue(undefined),
}));

describe('Google Auth API Endpoints', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/google', () => {
    const googleData = {
      googleId: 'test-google-id',
      email: 'test@example.com',
      name: 'Test User',
    };

    const mockUser = {
      id: 1,
      email: googleData.email,
      name: googleData.name,
    };

    const mockLoginResult = {
      user: mockUser,
      token: 'test-token',
      refreshToken: 'test-refresh-token',
    };

    const mockRegisterResult = {
      user: mockUser,
      token: 'test-token',
      refreshToken: 'test-refresh-token',
    };

    it('should return 400 if required data is missing', async () => {
      const response = await request(app)
        .post('/api/auth/google')
        .send({ email: googleData.email, name: googleData.name });

      expect(response.status).toBe(400);
      expect(response.body).toEqual(
        expect.objectContaining({
          success: false,
          error: 'Data Google tidak lengkap',
        })
      );
    });

    it('should login existing Google user successfully', async () => {
      // Mock successful login
      (authService.loginWithGoogle as jest.Mock).mockResolvedValueOnce(mockLoginResult);

      const response = await request(app)
        .post('/api/auth/google')
        .send(googleData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          success: true,
          data: mockLoginResult,
          message: 'Login dengan Google berhasil',
        })
      );
    });

    it('should register new Google user if login fails', async () => {
      // Mock login failure and registration success
      (authService.loginWithGoogle as jest.Mock).mockRejectedValueOnce(
        new Error('User not found')
      );
      (authService.registerWithGoogle as jest.Mock).mockResolvedValueOnce(mockRegisterResult);

      const response = await request(app)
        .post('/api/auth/google')
        .send(googleData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          success: true,
          data: mockRegisterResult,
          message: 'Registrasi dengan Google berhasil',
        })
      );
    });

    it('should return 500 if both login and registration fail', async () => {
      // Mock both login and registration failure
      const error = new Error('Database connection error');
      (authService.loginWithGoogle as jest.Mock).mockRejectedValueOnce(error);
      (authService.registerWithGoogle as jest.Mock).mockRejectedValueOnce(error);

      const response = await request(app)
        .post('/api/auth/google')
        .send(googleData);

      // HTTP 500 is returned by the global error handler
      expect(response.status).toBe(500);
    });
  });

  // Ide untuk test lainnya:
  // - Test untuk validasi token Google (jika diimplementasikan)
  // - Test untuk callback URL Google OAuth (jika diimplementasikan)
  // - Test untuk refresh token setelah login dengan Google
}); 