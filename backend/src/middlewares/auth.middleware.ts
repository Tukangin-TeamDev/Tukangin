import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth.config';
import { PrismaClient } from '@prisma/client';
import { Role, AuthUser } from '../types';

const prisma = new PrismaClient();

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, authConfig.jwtSecret) as { id: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, role: true, emailVerified: true },
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (!user.emailVerified) {
      return res.status(403).json({ message: 'Email not verified' });
    }

    req.user = {
      id: user.id,
      role: user.role,
      emailVerified: user.emailVerified,
    } as AuthUser;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const checkRole = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!roles.includes((req.user as AuthUser).role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
};

export const rateLimiter = (maxAttempts: number, windowMs: number) => {
  const attempts = new Map();

  return async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip;
    const now = Date.now();
    const userAttempts = attempts.get(ip) || [];

    // Clean old attempts
    const validAttempts = userAttempts.filter((timestamp: number) => now - timestamp < windowMs);

    if (validAttempts.length >= maxAttempts) {
      return res.status(429).json({
        message: 'Too many attempts. Please try again later.',
        nextValidRequest: new Date(validAttempts[0] + windowMs),
      });
    }

    validAttempts.push(now);
    attempts.set(ip, validAttempts);
    next();
  };
};
