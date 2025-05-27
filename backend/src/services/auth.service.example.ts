import { User, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth.config';
import { UserRepository } from './user.repository';
import { LoginResponse, RegisterResponse } from '../types';
import { AppError } from '../types';

/**
 * Contoh implementasi Auth Service dengan Repository Pattern
 */
export class AuthServiceWithRepository {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Registrasi pengguna baru
   */
  async register(email: string, password: string, fullName: string, role: string): Promise<RegisterResponse> {
    // Cek apakah email sudah digunakan
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError('Email already registered', 409);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Generate token verifikasi
    const verificationToken = this.generateRandomToken();

    // Buat user baru dengan profilenya
    const user = await this.userRepository.createWithProfile(
      {
        email,
        passwordHash,
        role: role as Role,
        verificationToken,
        emailVerified: false
      },
      {
        fullName,
        phone: 'not-set'
      }
    );

    // TODO: Kirim email verifikasi
    
    return { 
      userId: user.id, 
      verificationToken 
    };
  }

  /**
   * Login pengguna
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    // Cari user berdasarkan email
    const user = await this.userRepository.findByEmail(email);
    if (!user || !user.passwordHash) {
      throw new AppError('Invalid credentials', 401);
    }

    // Cek apakah akun terkunci
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new AppError('Account is locked. Try again later', 403);
    }

    // Validasi password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      await this.handleFailedLogin(user.id);
      throw new AppError('Invalid credentials', 401);
    }

    // Cek 2FA
    if (user.twoFactorEnabled) {
      return { requiresTwoFactor: true, userId: user.id };
    }

    // Reset failed login attempts
    await this.resetFailedAttempts(user.id);
    
    // Generate tokens
    return this.generateTokens(user);
  }

  // Metode private untuk keperluan internal service
  private generateRandomToken(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  private async handleFailedLogin(userId: string): Promise<void> {
    // Implementasi lebih detail menggunakan repository
  }

  private async resetFailedAttempts(userId: string): Promise<void> {
    // Implementasi lebih detail menggunakan repository
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