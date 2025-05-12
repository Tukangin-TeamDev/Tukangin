import { Request, Response } from 'express';
import { googleAuth } from '../../../src/api/auth/auth.controller';
import * as authService from '../../../src/api/auth/auth.service';

// Mock auth service
jest.mock('../../../src/api/auth/auth.service');

// Mock audit middleware
jest.mock('../../../src/middleware/audit.middleware', () => ({
  createAdminAuditLog: jest.fn().mockResolvedValue(undefined),
}));

describe('Google Auth Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      body: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('googleAuth', () => {
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

    it('should return 400 if googleId, email, or name is missing', async () => {
      // Setup (missing googleId)
      mockRequest.body = {
        email: googleData.email,
        name: googleData.name,
      };

      // Execute
      await googleAuth(mockRequest as Request, mockResponse as Response, mockNext);

      // Verify
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'Data Google tidak lengkap',
        })
      );

      // Setup (missing email)
      mockRequest.body = {
        googleId: googleData.googleId,
        name: googleData.name,
      };

      // Execute
      await googleAuth(mockRequest as Request, mockResponse as Response, mockNext);

      // Verify
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'Data Google tidak lengkap',
        })
      );

      // Setup (missing name)
      mockRequest.body = {
        googleId: googleData.googleId,
        email: googleData.email,
      };

      // Execute
      await googleAuth(mockRequest as Request, mockResponse as Response, mockNext);

      // Verify
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'Data Google tidak lengkap',
        })
      );
    });

    it('should login existing user if loginWithGoogle succeeds', async () => {
      // Setup
      mockRequest.body = googleData;
      (authService.loginWithGoogle as jest.Mock).mockResolvedValueOnce(mockLoginResult);

      // Execute
      await googleAuth(mockRequest as Request, mockResponse as Response, mockNext);

      // Verify
      expect(authService.loginWithGoogle).toHaveBeenCalledWith(
        googleData.googleId,
        googleData.email
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockLoginResult,
          message: 'Login dengan Google berhasil',
        })
      );
    });

    it('should register new user if loginWithGoogle fails', async () => {
      // Setup
      mockRequest.body = googleData;
      (authService.loginWithGoogle as jest.Mock).mockRejectedValueOnce(
        new Error('User not found')
      );
      (authService.registerWithGoogle as jest.Mock).mockResolvedValueOnce(mockRegisterResult);

      // Execute
      await googleAuth(mockRequest as Request, mockResponse as Response, mockNext);

      // Verify
      expect(authService.loginWithGoogle).toHaveBeenCalledWith(
        googleData.googleId,
        googleData.email
      );
      expect(authService.registerWithGoogle).toHaveBeenCalledWith(googleData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockRegisterResult,
          message: 'Registrasi dengan Google berhasil',
        })
      );
    });

    it('should call next with error if both login and register fail', async () => {
      // Setup
      mockRequest.body = googleData;
      const testError = new Error('Test error');
      (authService.loginWithGoogle as jest.Mock).mockRejectedValueOnce(testError);
      (authService.registerWithGoogle as jest.Mock).mockRejectedValueOnce(testError);

      // Execute
      await googleAuth(mockRequest as Request, mockResponse as Response, mockNext);

      // Verify
      expect(mockNext).toHaveBeenCalledWith(testError);
    });
  });
}); 