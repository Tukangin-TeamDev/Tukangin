import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  // Jika AppError, gunakan statusCode dan pesan yang sudah ditentukan
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
  }

  // Untuk error lainnya, kirim 500 Internal Server Error
  return res.status(500).json({
    status: 'error',
    message: 'Terjadi kesalahan pada server'
  });
}; 