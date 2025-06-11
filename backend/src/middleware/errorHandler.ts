import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import logger from '../utils/logger';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const handleZodError = (err: ZodError) => {
  const errors = err.errors.map((e) => {
    return {
      field: e.path.join('.'),
      message: e.message
    };
  });

  return {
    message: 'Validation Error',
    errors
  };
};

const handleJWTError = () => {
  return new AppError('Token tidak valid. Silahkan login kembali', 401);
};

const handleJWTExpiredError = () => {
  return new AppError('Token sudah kadaluarsa. Silahkan login kembali', 401);
};

const handleDuplicateKeyError = (err: any) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  
  const message = `${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' sudah digunakan.`;
  
  return new AppError(message, 400);
};

const handleValidationError = (err: any) => {
  const errors = Object.keys(err.errors).map(field => {
    return {
      field,
      message: err.errors[field].message
    };
  });
  
  return {
    message: 'Validation Error',
    errors
  };
};

const sendErrorDev = (err: any, res: Response) => {
  res.status(err.statusCode || 500).json({
    success: false,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err: any, res: Response) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors && { errors: err.errors })
    });
  } 
  // Programming or other unknown error: don't leak error details
  else {
    // Log error
    logger.error('ERROR 💥:', err);
    
    // Send generic message
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan. Mohon coba lagi nanti.'
    });
  }
};

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;

  // Log all errors
  logger.error(`${err.statusCode} - ${err.message}`, err);

  // Different error handling based on environment
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    // Handle different types of errors
    if (err instanceof ZodError) {
      const validationErrors = handleZodError(err);
      error = new AppError(validationErrors.message, 400);
      error.errors = validationErrors.errors;
    }
    
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
    
    if (err.code === 11000) error = handleDuplicateKeyError(err);
    if (err.name === 'ValidationError') {
      const validationErrors = handleValidationError(err);
      error = new AppError(validationErrors.message, 400);
      error.errors = validationErrors.errors;
    }

    sendErrorProd(error, res);
  }
};
