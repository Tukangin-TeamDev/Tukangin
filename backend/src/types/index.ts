import { Role, DocumentType, KYCStatus, LoginType, ServiceType, ServiceStatus, OrderStatus, EscrowStatus, TransactionType, WalletTxType, Gender, RequestStatus } from '@prisma/client';
import { Request } from 'express';

// Re-export semua enum dari Prisma untuk memudahkan import
export {
  Role,
  DocumentType,
  KYCStatus,
  LoginType,
  ServiceType,
  ServiceStatus,
  OrderStatus,
  EscrowStatus,
  TransactionType,
  WalletTxType,
  Gender,
  RequestStatus
};

// Enum tambahan yang tidak ada di Prisma Client
export enum Unit {
  hour = 'hour',
  project = 'project',
  unit = 'unit',
  custom = 'custom'
}

// Tipe untuk user yang terautentikasi
export interface AuthUser {
  id: string;
  role: Role;
  emailVerified: boolean;
}

// Request dengan user terautentikasi
export interface AuthRequest extends Request {
  user?: AuthUser;
}

// Response untuk login
export interface LoginResponse {
  requiresTwoFactor?: boolean;
  userId?: string;
  accessToken?: string;
  refreshToken?: string;
}

// Response untuk registrasi
export interface RegisterResponse {
  userId: string;
  verificationToken: string;
}

// Data untuk upload dokumen KYC
export interface KYCDocumentUpload {
  providerId: string;
  type: DocumentType;
  fileUrl: string;
}

// Data untuk verifikasi dokumen KYC
export interface KYCVerification {
  documentId: string;
  isApproved: boolean;
  notes?: string;
}

// Data untuk Google OAuth
export interface GoogleAuthData {
  id: string;
  email: string;
  name?: string;
  picture?: string;
}

// Data untuk file upload
export interface FileUpload {
  fileName: string;
  fileType: string;
  fileSize: number;
  buffer: Buffer;
}

// Error aplikasi terstruktur
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
} 