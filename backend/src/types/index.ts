export interface TokenPayload {
  id: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface UserResponse {
  id: string;
  email: string;
  role: string;
  phoneNumber: string;
}

export interface AuthResponse {
  success: boolean;
  data?: UserResponse;
  token?: string;
  message?: string;
}

export enum Role {
  CUSTOMER = 'CUSTOMER',
  PROVIDER = 'PROVIDER',
  ADMIN = 'ADMIN',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  EN_ROUTE = 'EN_ROUTE',
  ON_SITE = 'ON_SITE',
  IN_PROGRESS = 'IN_PROGRESS',
  REQUOTE = 'REQUOTE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  DISPUTED = 'DISPUTED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  ESCROW = 'ESCROW',
  COMPLETED = 'COMPLETED',
  REFUNDED = 'REFUNDED',
  FAILED = 'FAILED',
}

export enum DisputeStatus {
  OPEN = 'OPEN',
  IN_REVIEW = 'IN_REVIEW',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
}
