import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticator } from 'otplib';
import { authConfig } from '../config/auth.config';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { LoginResponse, Role, LoginType, RegisterResponse } from '../types';

const prisma = new PrismaClient();

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

export class AuthService {
  async register(email: string, password: string, fullName: string, role: string): Promise<RegisterResponse> {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: role as Role,
        verificationToken,
        profile: {
          create: {
            fullName,
            phone: 'not-set' // Default value untuk memenuhi required field
          }
        }
      }
    });

    // TODO: Send verification email
    return { userId: user.id, verificationToken };
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const user = await prisma.user.findUnique({ 
      where: { email },
      include: { profile: true }
    });

    if (!user || !user.passwordHash) {
      throw new Error('Invalid credentials');
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new Error('Account is locked. Try again later');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      await this.handleFailedLogin(user.id);
      throw new Error('Invalid credentials');
    }

    if (user.twoFactorEnabled) {
      return { requiresTwoFactor: true, userId: user.id };
    }

    await this.resetFailedAttempts(user.id);
    return this.generateTokens(user);
  }

  async verifyEmail(token: string): Promise<boolean> {
    const user = await prisma.user.findFirst({ where: { verificationToken: token } });
    if (!user) {
      throw new Error('Invalid verification token');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, verificationToken: null }
    });

    return true;
  }

  async forgotPassword(email: string): Promise<string | undefined> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return; // Don't reveal if email exists
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    await prisma.user.update({
      where: { id: user.id },
      data: { resetPasswordToken: resetToken }
    });

    // TODO: Send reset password email
    return resetToken;
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const user = await prisma.user.findFirst({ 
      where: { resetPasswordToken: token } 
    });

    if (!user) {
      throw new Error('Invalid reset token');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        passwordHash,
        resetPasswordToken: null
      }
    });

    return true;
  }

  async setup2FA(userId: string): Promise<string> {
    const secret = authenticator.generateSecret();
    await prisma.user.update({
      where: { id: userId },
      data: { 
        twoFactorSecret: secret,
        twoFactorEnabled: false
      }
    });

    return secret;
  }

  async verify2FA(userId: string, token: string): Promise<LoginResponse> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user?.twoFactorSecret) {
      throw new Error('2FA not set up');
    }

    const isValid = authenticator.verify({ 
      token, 
      secret: user.twoFactorSecret 
    });

    if (!isValid) {
      throw new Error('Invalid 2FA token');
    }

    if (!user.twoFactorEnabled) {
      await prisma.user.update({
        where: { id: userId },
        data: { twoFactorEnabled: true }
      });
    }

    return this.generateTokens(user);
  }

  async googleLogin(idToken: string): Promise<LoginResponse> {
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throw new Error('Invalid Google token');
      }

      let user = await prisma.user.findUnique({
        where: { email: payload.email }
      });

      if (!user) {
        // Buat user baru jika belum ada
        user = await prisma.user.create({
          data: {
            email: payload.email,
            emailVerified: true,
            loginType: LoginType.google,
            role: Role.customer,
            profile: {
              create: {
                fullName: payload.name || 'Google User',
                phone: 'not-set'
              }
            }
          }
        });
      } else if (user.loginType !== LoginType.google) {
        throw new Error('Email already registered with different method');
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new Error('Google authentication failed');
    }
  }

  private async handleFailedLogin(userId: string): Promise<void> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    const attempts = (user.failedLoginAttempts || 0) + 1;
    const updates: any = { failedLoginAttempts: attempts };

    if (attempts >= authConfig.maxLoginAttempts) {
      updates.lockedUntil = new Date(Date.now() + authConfig.lockoutDuration);
    }

    await prisma.user.update({
      where: { id: userId },
      data: updates
    });
  }

  private async resetFailedAttempts(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { 
        failedLoginAttempts: 0,
        lockedUntil: null
      }
    });
  }

  private generateTokens(user: User): LoginResponse {
    const accessToken = jwt.sign(
      { id: user.id },
      authConfig.jwtSecret,
      { expiresIn: authConfig.jwtExpiration }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      authConfig.jwtSecret,
      { expiresIn: authConfig.jwtRefreshExpiration }
    );

    return { accessToken, refreshToken };
  }
} 