import { Request, Response, NextFunction } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ZodError } from 'zod';
import logger from './logger';

/**
 * Custom Error class untuk error aplikasi
 */
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

/**
 * Menangani error dari Prisma
 */
const handlePrismaError = (error: PrismaClientKnownRequestError) => {
  // Handle different Prisma error codes
  switch (error.code) {
    case 'P2002':
      return new AppError(`Duplikat data: ${error.meta?.target}`, 400);
    case 'P2003':
      return new AppError('Constraint gagal: Foreign key constraint', 400);
    case 'P2025':
      return new AppError('Data tidak ditemukan', 404);
    default:
      return new AppError('Database error', 500);
  }
};

/**
 * Menangani error dari Zod validation
 */
const handleZodError = (error: ZodError) => {
  const message = error.errors.map(err => `${err.path}: ${err.message}`).join(', ');
  return new AppError(`Validasi gagal: ${message}`, 400);
};

/**
 * Menangani error secara umum
 */
export const handleError = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error
  logger.error(`${error.stack || error}`);

  // Handle specific error types
  if (error instanceof ZodError) {
    const appError = handleZodError(error);
    return sendError(appError, req, res);
  }

  if (error instanceof PrismaClientKnownRequestError) {
    const appError = handlePrismaError(error);
    return sendError(appError, req, res);
  }

  if (error instanceof AppError) {
    return sendError(error, req, res);
  }

  // Untuk error yang tidak dikenali
  const defaultError = new AppError(error.message || 'Terjadi kesalahan server', error.statusCode || 500);
  return sendError(defaultError, req, res);
};

/**
 * Send error response ke client
 */
const sendError = (error: AppError, req: Request, res: Response) => {
  // Development vs Production error handler
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (isDevelopment) {
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
      stack: error.stack,
      error,
    });
  } else {
    // Production: tidak menampilkan detail teknis
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.isOperational ? error.message : 'Terjadi kesalahan server',
    });
  }
};

/**
 * Middleware untuk menangkap error di Express
 */
export const errorMiddleware = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  handleError(error, req, res, next);
}; 