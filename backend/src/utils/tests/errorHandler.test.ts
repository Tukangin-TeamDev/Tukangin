import { Request, Response } from 'express';
import { AppError, handleError } from '../errorHandler';
import logger from '../logger';

jest.mock('../logger', () => ({
  error: jest.fn(),
}));

describe('Error Handler', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle AppError correctly', () => {
    const errorMessage = 'Test error';
    const errorCode = 400;
    const appError = new AppError(errorMessage, errorCode);

    handleError(
      appError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(logger.error).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(errorCode);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'error',
        message: errorMessage,
      })
    );
  });

  it('should handle unknown errors with 500 status code', () => {
    const errorMessage = 'Unknown error';
    const error = new Error(errorMessage);

    handleError(
      error,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(logger.error).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'error',
        message: errorMessage,
      })
    );
  });
}); 