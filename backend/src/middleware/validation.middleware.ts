import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ApiResponse } from '../types/common.types';

/**
 * Middleware untuk validasi request menggunakan Zod schema
 * @param schema Zod schema untuk validasi
 */
export const validateRequest = (schema: z.ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        const errorMessage = result.error.errors[0].message;

        const response: ApiResponse<null> = {
          success: false,
          error: 'Validasi gagal',
          message: errorMessage,
        };

        return res.status(400).json(response);
      }

      // Update request body dengan data yang sudah divalidasi dan dikonversi oleh Zod
      req.body = result.data;
      return next();
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Terjadi kesalahan saat validasi data',
      };

      return res.status(500).json(response);
    }
  };
};
