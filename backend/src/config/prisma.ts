import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

// Inisialisasi PrismaClient
const prisma = new PrismaClient({
  // Konfigurasi logging
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'info',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
});

// Log query di development mode
if (process.env.NODE_ENV !== 'production') {
  prisma.$on('query', (e: any) => {
    logger.debug(`Query: ${e.query}`);
    logger.debug(`Duration: ${e.duration}ms`);
  });
}

// Log error
prisma.$on('error', (e: any) => {
  logger.error(`Prisma Error: ${e.message}`);
});

// Log warn
prisma.$on('warn', (e: any) => {
  logger.warn(`Prisma Warning: ${e.message}`);
});

export default prisma;
