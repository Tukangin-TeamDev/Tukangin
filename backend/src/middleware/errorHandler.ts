import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default error values
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errorStack = '';

  // Check if error is our AppError
  if ('statusCode' in err) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Add stack trace in development mode
  if (process.env.NODE_ENV === 'development') {
    errorStack = err.stack || '';
  }

  // Log error
  console.error(`[ERROR] ${statusCode} - ${message}`);
  if (errorStack) console.error(errorStack);

  // Send error response
  return res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
    stack: process.env.NODE_ENV === 'development' ? errorStack : undefined,
  });
};
