import { ServiceType } from './service.types';

/**
 * Enum untuk status order
 */
export enum OrderStatus {
  PENDING = "PENDING",
  NEGOTIATION = "NEGOTIATION",
  ACCEPTED = "ACCEPTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  DISPUTED = "DISPUTED",
  CANCELLED = "CANCELLED"
}

/**
 * Tipe data untuk request pembuatan order baru
 */
export type CreateOrderDto = {
  customerId: number;
  serviceId: number;
  description?: string;
  scheduledAt?: Date;
};

/**
 * Tipe data untuk request pembuatan order konsultatif
 */
export type CreateConsultativeOrderDto = CreateOrderDto & {
  negotiationNote?: string;
};

/**
 * Tipe data untuk update informasi order
 */
export type UpdateOrderDto = {
  status?: OrderStatus;
  scheduledAt?: Date;
  description?: string;
  negotiationNote?: string;
  escrowAmount?: number;
};

/**
 * Tipe data untuk response order
 */
export type OrderResponseDto = {
  id: number;
  customerId: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  providerId: number;
  providerName?: string;
  providerEmail?: string;
  providerPhone?: string;
  serviceId: number;
  serviceName?: string;
  serviceDescription?: string;
  orderType: ServiceType;
  status: OrderStatus;
  scheduledAt?: Date | null;
  description?: string | null;
  escrowAmount: number;
  negotiationNote?: string | null;
  paymentStatus?: string | null;
  paymentAmount?: number | null;
  hasDispute?: boolean;
  disputeStatus?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Tipe data untuk filter pencarian order
 */
export type OrderFilterDto = {
  customerId?: number;
  providerId?: number;
  status?: OrderStatus;
  orderType?: ServiceType;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
};

/**
 * Tipe data untuk pembayaran
 */
export type PaymentDto = {
  orderId: number;
  amount: number;
  status: string;
  transactionId?: string;
};

/**
 * Tipe data untuk review
 */
export type ReviewDto = {
  orderId: number;
  customerId: number;
  providerId: number;
  rating: number;
  comment?: string;
}; 