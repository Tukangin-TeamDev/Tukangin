/**
 * Enum untuk tipe layanan
 */
export enum ServiceType {
  FIXED = 'FIXED',
  CONSULTATIVE = 'CONSULTATIVE',
}

/**
 * Tipe data untuk request pembuatan layanan baru
 */
export type CreateServiceDto = {
  providerId: number;
  name: string;
  description: string;
  serviceType: ServiceType;
  fixedPrice?: number;
  media?: string;
};

/**
 * Tipe data untuk update informasi layanan
 */
export type UpdateServiceDto = {
  name?: string;
  description?: string;
  serviceType?: ServiceType;
  fixedPrice?: number;
  media?: string;
};

/**
 * Tipe data untuk response layanan
 */
export type ServiceResponseDto = {
  id: number;
  providerId: number;
  providerName?: string;
  name: string;
  description: string;
  serviceType: ServiceType;
  fixedPrice?: number;
  media?: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Tipe data untuk filter pencarian layanan
 */
export type ServiceFilterDto = {
  providerId?: number;
  serviceType?: ServiceType;
  search?: string;
  page?: number;
  limit?: number;
};
