import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { ApiResponse } from '../types/common.types';
import { ZodError } from 'zod';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// Custom Error class untuk error yang diketahui
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
 * Middleware untuk menangani semua error di aplikasi
 */
export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(`${err.name}: ${err.message}`);
  logger.error(err.stack || 'No stack trace available');

  // Default error response
  let statusCode = 500;
  let message = 'Terjadi kesalahan pada server';
  let errorType = 'ServerError';

  // Tangani AppError (error kustom yang dilempar oleh aplikasi)
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorType = 'ApplicationError';
  }

  // Tangani Zod validation errors
  else if (err instanceof ZodError) {
    statusCode = 400;
    message = err.errors[0]?.message || 'Validasi data gagal';
    errorType = 'ValidationError';
  }

  // Tangani Prisma errors
  else if (err instanceof PrismaClientKnownRequestError) {
    statusCode = 400;

    // P2002: Unique constraint failed
    if (err.code === 'P2002') {
      const target = err.meta?.target as string[];
      message = `${target?.join(', ')} sudah digunakan`;
    }
    // P2025: Record not found
    else if (err.code === 'P2025') {
      message = 'Data yang diminta tidak ditemukan';
      statusCode = 404;
    } else {
      message = 'Database error';
    }

    errorType = 'DatabaseError';
  }

  // Tangani JWT errors
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token tidak valid';
    errorType = 'AuthenticationError';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token sudah kedaluwarsa';
    errorType = 'AuthenticationError';
  }

  // Kirim response error yang terstruktur
  const response: ApiResponse<null> = {
    success: false,
    error: message,
    message: `${errorType}: ${message}`,
  };

  // Jika bukan production, tambahkan stack trace ke response
  if (process.env.NODE_ENV !== 'production') {
    response.message = `${errorType}: ${message}\n${err.stack}`;
  }

  return res.status(statusCode).json(response);
};
