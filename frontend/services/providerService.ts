import api from '@/lib/api';

export interface Service {
  id?: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  categoryId: string;
  isActive?: boolean;
}

export interface ServiceResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  categoryId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  provider?: {
    id: string;
    fullName: string;
    businessName?: string;
    rating?: number;
  };
  category?: {
    id: string;
    name: string;
  };
}

export interface ServiceListResponse {
  services: ServiceResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface BookingResponse {
  id: string;
  status: string;
  totalAmount: number;
  address: string;
  scheduledAt?: string;
  completedAt?: string;
  bookingNumber: string;
  estimatedArrival?: string;
  createdAt: string;
  customer: {
    id: string;
    fullName: string;
    avatarUrl?: string;
  };
  services: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
}

/**
 * Provider service for handling provider-related API requests
 */
const providerService = {
  /**
   * Get provider's services
   * @param page Page number
   * @param limit Items per page
   * @returns List of services
   */
  getServices: async (page = 1, limit = 10): Promise<ServiceListResponse> => {
    const response = await api.get(`/services/provider?page=${page}&limit=${limit}`);
    return response.data;
  },

  /**
   * Get service by ID
   * @param id Service ID
   * @returns Service details
   */
  getServiceById: async (id: string): Promise<ServiceResponse> => {
    const response = await api.get(`/services/${id}`);
    return response.data;
  },

  /**
   * Create new service
   * @param serviceData Service data
   * @returns Created service
   */
  createService: async (serviceData: Service): Promise<ServiceResponse> => {
    const response = await api.post('/services', serviceData);
    return response.data;
  },

  /**
   * Update service
   * @param id Service ID
   * @param serviceData Service data
   * @returns Updated service
   */
  updateService: async (id: string, serviceData: Partial<Service>): Promise<ServiceResponse> => {
    const response = await api.put(`/services/${id}`, serviceData);
    return response.data;
  },

  /**
   * Delete service
   * @param id Service ID
   * @returns Success response
   */
  deleteService: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  },

  /**
   * Get provider's bookings
   * @param status Filter by status (optional)
   * @param page Page number
   * @param limit Items per page
   * @returns List of bookings
   */
  getBookings: async (
    status?: string,
    page = 1,
    limit = 10
  ): Promise<{ bookings: BookingResponse[]; total: number; page: number; limit: number }> => {
    const statusParam = status ? `&status=${status}` : '';
    const response = await api.get(`/bookings/provider?page=${page}&limit=${limit}${statusParam}`);
    return response.data;
  },

  /**
   * Update booking status
   * @param id Booking ID
   * @param status New status
   * @returns Updated booking
   */
  updateBookingStatus: async (
    id: string,
    status: string
  ): Promise<{ success: boolean; booking: BookingResponse }> => {
    const response = await api.put(`/bookings/${id}/status`, { status });
    return response.data;
  },

  /**
   * Get provider earnings
   * @param period Period (week, month, year)
   * @returns Earnings data
   */
  getEarnings: async (
    period = 'month'
  ): Promise<{
    total: number;
    pending: number;
    completed: number;
    transactions: Array<{
      id: string;
      amount: number;
      status: string;
      date: string;
      bookingId?: string;
    }>;
  }> => {
    const response = await api.get(`/payments/earnings?period=${period}`);
    return response.data;
  },
};

export default providerService;
