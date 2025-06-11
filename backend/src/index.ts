import express, { Application } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import routes from './routes';
import { errorMiddleware } from './middleware/errorHandler';
import { initSocketIO } from './config/socket';
import logger from './utils/logger';

// Environment variables
const PORT = parseInt(process.env.PORT || '8080', 10);
const NODE_ENV = process.env.NODE_ENV || 'development';

// Initialize Express app
const app: Application = express();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
initSocketIO(server);

// Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(
  helmet({
    contentSecurityPolicy: NODE_ENV === 'production' ? undefined : false,
  })
);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API routes
app.use('/api', routes);

// Error handling middleware
app.use(errorMiddleware);

// Start the server
server.listen(PORT, () => {
  logger.info(`Server running in ${NODE_ENV} mode on port ${PORT}`);
});
