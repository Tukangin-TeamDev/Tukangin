import { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { AppError } from '../types';

/**
 * Middleware untuk menghandle error dari Prisma
 */
export const prismaErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Error yang dikenal dari Prisma
    switch (error.code) {
      case 'P2002': // Unique constraint failed
        return res.status(409).json({
          status: 'error',
          message: 'Data sudah ada (unique constraint violation)',
          fields: error.meta?.target || []
        });
      case 'P2025': // Record not found
        return res.status(404).json({
          status: 'error',
          message: 'Data tidak ditemukan'
        });
      case 'P2003': // Foreign key constraint failed
        return res.status(409).json({
          status: 'error',
          message: 'Data terkait tidak ditemukan (foreign key constraint failed)'
        });
      default:
        console.error('Prisma error:', error);
        return res.status(500).json({
          status: 'error',
          message: 'Database error',
          code: error.code
        });
    }
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    // Error validasi dari Prisma
    return res.status(400).json({
      status: 'error',
      message: 'Validasi data gagal',
      error: error.message
    });
  } else if (error instanceof AppError) {
    // Gunakan error handler umum untuk AppError
    return next(error);
  }

  next(error);
}; 