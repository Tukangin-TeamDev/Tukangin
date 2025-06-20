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

// Prisma model interfaces (match schema.prisma)
export interface User {
  id: string;
  email: string;
  password?: string | null;
  phoneNumber: string;
  isActive: boolean;
  role: Role;
  createdAt: string;
  updatedAt: string;
  twoFactorEnabled: boolean;
  emailVerified: boolean;
  verificationToken?: string | null;
  verifiedAt?: string | null;
  provider?: Provider | null;
  providerAccountId?: string | null;
  resetToken?: string | null;
  resetTokenExpiry?: string | null;
  customer?: Customer | null;
  serviceProvider?: ServiceProvider | null;
  admin?: Admin | null;
  // notifications, devices, otpCodes, wallet handled separately
}

export enum Provider {
  EMAIL = 'EMAIL',
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK',
}

export interface Customer {
  id: string;
  userId: string;
  fullName: string;
  address?: string | null;
  avatarUrl?: string | null;
  loyaltyPoints: number;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceProvider {
  id: string;
  userId: string;
  fullName: string;
  businessName?: string | null;
  address?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  isVerified: boolean;
  walletBalance: number;
  rating: number;
  totalReviews: number;
  isAvailable: boolean;
  latitude?: number | null;
  longitude?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Admin {
  id: string;
  userId: string;
  fullName: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  providerId: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  categoryId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  parentId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  customerId: string;
  providerId: string;
  status: BookingStatus;
  totalAmount: number;
  address: string;
  latitude: number;
  longitude: number;
  notes?: string | null;
  scheduledAt?: string | null;
  completedAt?: string | null;
  bookingNumber: string;
  estimatedArrival?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  status: PaymentStatus;
  paymentMethod?: string | null;
  transactionId?: string | null;
  platformFee: number;
  escrowNumber?: string | null;
  escrowDate?: string | null;
  releaseDate?: string | null;
  paymentProofUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  bookingId: string;
  paymentId: string;
  invoiceNumber: string;
  totalAmount: number;
  tax: number;
  discount: number;
  issuedAt: string;
  dueAt: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  providerId: string;
  rating: number;
  comment?: string | null;
  response?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Dispute {
  id: string;
  bookingId: string;
  customerId: string;
  reason: string;
  description: string;
  status: DisputeStatus;
  resolution?: string | null;
  createdAt: string;
  updatedAt: string;
}
