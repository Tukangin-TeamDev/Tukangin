/**
 * Kelas untuk menangani error API dengan status code HTTP
 */
export class ApiError extends Error {
  statusCode: number;
  
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
    
    // Set the prototype explicitly to maintain instanceof behavior
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Fungsi helper untuk membuat error API dengan cepat
 */
export const createApiError = (statusCode: number, message: string): ApiError => {
  return new ApiError(statusCode, message);
}; 