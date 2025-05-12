import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { logger } from '../utils/logger';
import { AuditLogDto } from '../types/common.types';

/**
 * Middleware untuk mencatat aktivitas penting ke audit log
 * @param action Tipe aksi yang dilakukan
 * @param getDetails Fungsi untuk mendapatkan detail tambahan dari request
 */
export const auditLog = (
  action: string,
  getDetails?: (req: Request) => Record<string, any>
) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Hanya mencatat jika user terautentikasi
      if (req.user && req.user.id) {
        // Ekstrak detail tambahan jika fungsi tersedia
        const details = getDetails ? JSON.stringify(getDetails(req)) : null;
        
        // Simpan log ke database
        const logData: AuditLogDto = {
          userId: req.user.id,
          action,
          details: details || undefined,
        };
        
        // Buat log asinkron (tidak menunggu hasil)
        prisma.auditLog.create({ data: logData })
          .catch(err => {
            logger.error(`Failed to create audit log: ${err.message}`);
          });
      }
      
      next();
    } catch (error) {
      logger.error('Error creating audit log:', error);
      // Lanjut ke middleware berikutnya bahkan jika error
      next();
    }
  };
};

/**
 * Mencatat aktivitas administratif ke audit log
 * 
 * @param action Aksi yang dicatat
 * @param details Detail aktivitas
 * @param userId ID user yang melakukan aksi
 * @returns Promise yang resolve ketika log dicatat
 */
export const createAdminAuditLog = async (
  action: string,
  details: Record<string, any>,
  userId: number
) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        details: JSON.stringify(details),
      },
    });
    
    logger.info(`Admin action logged: ${action} by user ${userId}`);
  } catch (error) {
    logger.error(`Failed to log admin action: ${error}`);
  }
}; 