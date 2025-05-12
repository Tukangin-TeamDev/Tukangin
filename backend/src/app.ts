import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';
import session from 'express-session';
import passport from './config/passport.config';
import { errorHandler } from './middleware/error.middleware';
import { logger } from './utils/logger';

// Rute API
import authRoutes from './api/auth/auth.routes';
import userRoutes from './api/user/user.routes';
import providerRoutes from './api/provider/provider.routes';
import serviceRoutes from './api/service/service.routes';
import orderRoutes from './api/order/order.routes';
import paymentRoutes from './api/payment/payment.routes';
import chatRoutes from './api/chat/chat.routes';
import reviewRoutes from './api/review/review.routes';
import adminRoutes from './api/admin/admin.routes';

const app: Application = express();

// Middleware untuk logging requests
app.use((req: Request, res: Response, next) => {
  logger.info(`${req.method} ${req.url}`);
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
  });
  
  next();
});

// Middleware untuk parsing body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware untuk parsing cookies
app.use(cookieParser());

// CORS (Cross-Origin Resource Sharing)
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

// Helmet untuk header keamanan
app.use(helmet());

// Express Session
app.use(session({
  secret: process.env.JWT_SECRET || 'secret-session-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 24 jam
    httpOnly: true,
  }
}));

// Inisialisasi Passport
app.use(passport.initialize());
app.use(passport.session());

// Rate limiter untuk mencegah abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 1000, // limit tiap IP ke 1000 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429, 
    error: 'Terlalu banyak request, coba lagi nanti'
  },
});

// Terapkan rate limiting ke semua requests
app.use(limiter);

// Middleware untuk file statis
app.use('/static', express.static(path.join(__dirname, '../public')));

// API Routes
const apiPrefix = '/api';
app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/users`, userRoutes);
app.use(`${apiPrefix}/providers`, providerRoutes);
app.use(`${apiPrefix}/services`, serviceRoutes);
app.use(`${apiPrefix}/orders`, orderRoutes);
app.use(`${apiPrefix}/payments`, paymentRoutes);
app.use(`${apiPrefix}/chat`, chatRoutes);
app.use(`${apiPrefix}/reviews`, reviewRoutes);
app.use(`${apiPrefix}/admin`, adminRoutes);

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Base route
app.get('/', (_req, res) => {
  res.send('TUKANGIN API Server');
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    message: 'Endpoint tidak ditemukan'
  });
});

// Global error handler
app.use(errorHandler);

export default app; 