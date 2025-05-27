import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import kycRoutes from './routes/kyc.routes';
import { errorHandler } from './middlewares/error.middleware';
import { prismaErrorHandler } from './middlewares/prisma.middleware';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/kyc', kycRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Tukangin API' });
});

// Error handlers - order matters!
app.use(prismaErrorHandler); // Prisma errors first
app.use(errorHandler); // Generic errors last

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
