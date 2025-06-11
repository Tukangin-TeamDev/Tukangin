import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import logger from '../utils/logger';

let io: Server;

export const initSocketIO = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Socket.IO middleware untuk autentikasi
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    // Jika token tidak ada, tolak koneksi
    if (!token) {
      return next(new Error('Authentication error'));
    }

    // Sebenarnya di sini dilakukan validasi token, tapi untuk sementara dibiarkan dulu
    // Kode untuk validasi token akan ditambahkan nanti

    next();
  });

  // Handle connections
  io.on('connection', socket => {
    logger.info(`Socket connected: ${socket.id}`);

    // Join room
    socket.on('join_room', roomId => {
      socket.join(roomId);
      logger.info(`Socket ${socket.id} joined room: ${roomId}`);
    });

    // Leave room
    socket.on('leave_room', roomId => {
      socket.leave(roomId);
      logger.info(`Socket ${socket.id} left room: ${roomId}`);
    });

    // Disconnect
    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });

  logger.info('Socket.IO initialized');
  return io;
};

export { io };
