/**
 * Tipe data untuk standardisasi response API
 */
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: PaginationMeta;
};

/**
 * Tipe data untuk metadata pagination
 */
export type PaginationMeta = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

/**
 * Tipe data untuk konfigurasi aplikasi
 */
export type AppConfig = {
  port: number;
  jwtSecret: string;
  jwtExpiration: string;
  jwtRefreshExpiration: string;
  nodeEnv: string;
  frontendUrl: string;
};

/**
 * Tipe data untuk notifikasi
 */
export type NotificationDto = {
  userId: number;
  message: string;
  type: string;
};

/**
 * Tipe data untuk audit log
 */
export type AuditLogDto = {
  userId: number;
  action: string;
  details?: string;
};

/**
 * Tipe data untuk dispute
 */
export type DisputeDto = {
  orderId: number;
  customerId: number;
  providerId: number;
  description: string;
  status: string;
  resolutionNote?: string;
};
