import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Import database connection
import { connectDB } from './config/prisma';

// Import routes
import indexRouter from './routes';

// Import middlewares
import { errorHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

// Initialize express app
const app: Express = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB()
  .then(() => {
    console.log('Connected to database');
  })
  .catch((err) => {
    console.error('Failed to connect to database', err);
    process.exit(1);
  });

// Middlewares
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', indexRouter);

// Error handling middleware
app.use(errorHandler);

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Socket.IO events
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
  
  // Handle chat messages
  socket.on('send_message', (data) => {
    socket.to(data.bookingId).emit('receive_message', data);
  });

  // Handle location tracking
  socket.on('update_location', (data) => {
    socket.to(data.bookingId).emit('provider_location', data);
  });

  // Join booking room for real-time updates
  socket.on('join_booking', (bookingId) => {
    socket.join(bookingId);
  });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
}); 