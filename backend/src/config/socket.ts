import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';

// Socket.io server instance
export let io: Server;

interface AuthenticatedSocket extends Socket {
  userId?: string;
  role?: string;
}

/**
 * Inisialisasi Socket.IO dan setup event handlers
 */
export const initSocketIO = (httpServer: HTTPServer): void => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Middleware autentikasi
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error: Token required'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
        id: string;
        role: string;
      };

      // Simpan data user di socket
      socket.userId = decoded.id;
      socket.role = decoded.role;
      next();
    } catch (error) {
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  // Koneksi Socket.IO
  io.on('connection', (socket: AuthenticatedSocket) => {
    const userId = socket.userId;

    if (!userId) {
      socket.disconnect(true);
      return;
    }

    logger.info(`User connected: ${userId}`);

    // Join ke room pribadi
    socket.join(`user_${userId}`);

    // Event untuk tracking lokasi provider
    socket.on('provider:location', (data) => {
      // Validasi data
      if (!data || !data.bookingId || !data.latitude || !data.longitude) {
        return;
      }

      // Emit ke room booking
      io.to(`booking_${data.bookingId}`).emit('tracking:update', {
        providerId: userId,
        latitude: data.latitude,
        longitude: data.longitude,
        timestamp: new Date(),
      });
    });

    // Event untuk join ke room booking
    socket.on('booking:join', (bookingId) => {
      if (!bookingId) return;
      
      socket.join(`booking_${bookingId}`);
      logger.info(`User ${userId} joined booking room ${bookingId}`);
    });

    // Event untuk leave room booking
    socket.on('booking:leave', (bookingId) => {
      if (!bookingId) return;
      
      socket.leave(`booking_${bookingId}`);
      logger.info(`User ${userId} left booking room ${bookingId}`);
    });

    // Event disconnect
    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${userId}`);
    });
  });

  logger.info('Socket.IO initialized');
};

/**
 * Kirim event booking update ke room booking
 */
export const sendBookingUpdate = (
  bookingId: string,
  status: string,
  data: any = {}
): void => {
  if (!io) {
    logger.warn('Socket.IO not initialized, cannot send booking update');
    return;
  }

  io.to(`booking_${bookingId}`).emit('booking:update', {
    bookingId,
    status,
    ...data,
    timestamp: new Date(),
  });
};

/**
 * Kirim event chat message ke room booking
 */
export const sendChatMessage = (
  bookingId: string,
  message: {
    id: string;
    senderId: string;
    message: string;
    attachmentUrl?: string;
    createdAt: Date;
  }
): void => {
  if (!io) {
    logger.warn('Socket.IO not initialized, cannot send chat message');
    return;
  }

  io.to(`booking_${bookingId}`).emit('chat:message', message);
};
