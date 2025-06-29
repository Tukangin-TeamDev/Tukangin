import api from '@/lib/api';
import { BookingResponse } from './providerService';

export interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  parentId?: string | null;
  subcategories?: Category[];
}

export interface SearchServiceParams {
  query?: string;
  categoryId?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  page?: number;
  limit?: number;
}

export interface ServiceSearchResponse {
  services: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    unit: string;
    categoryId: string;
    isActive: boolean;
    provider: {
      id: string;
      fullName: string;
      businessName?: string;
      rating: number;
      isAvailable: boolean;
      avatarUrl?: string;
    };
    category: {
      id: string;
      name: string;
    };
  }>;
  total: number;
  page: number;
  limit: number;
}

export interface CreateBookingData {
  providerId: string;
  address: string;
  latitude: number;
  longitude: number;
  scheduledAt?: string;
  notes?: string;
  services: Array<{
    serviceId: string;
    quantity: number;
  }>;
}

export interface ReviewData {
  bookingId: string;
  rating: number;
  comment?: string;
}

/**
 * Customer service for handling customer-related API requests
 */
const customerService = {
  /**
   * Get all categories
   * @returns List of categories
   */
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    return response.data.categories;
  },

  /**
   * Search for services
   * @param params Search parameters
   * @returns Search results
   */
  searchServices: async (params: SearchServiceParams): Promise<ServiceSearchResponse> => {
    const queryParams = new URLSearchParams();

    if (params.query) queryParams.append('query', params.query);
    if (params.categoryId) queryParams.append('categoryId', params.categoryId);
    if (params.location) queryParams.append('location', params.location);
    if (params.minPrice) queryParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
    if (params.rating) queryParams.append('rating', params.rating.toString());

    queryParams.append('page', (params.page || 1).toString());
    queryParams.append('limit', (params.limit || 10).toString());

    const response = await api.get(`/services/search?${queryParams.toString()}`);
    return response.data;
  },

  /**
   * Get service details
   * @param id Service ID
   * @returns Service details
   */
  getServiceDetails: async (id: string): Promise<any> => {
    const response = await api.get(`/services/${id}`);
    return response.data;
  },

  /**
   * Create booking
   * @param bookingData Booking data
   * @returns Created booking
   */
  createBooking: async (bookingData: CreateBookingData): Promise<BookingResponse> => {
    const response = await api.post('/bookings', bookingData);
    return response.data.booking;
  },

  /**
   * Get customer bookings
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
    const response = await api.get(`/bookings/customer?page=${page}&limit=${limit}${statusParam}`);
    return response.data;
  },

  /**
   * Get booking details
   * @param id Booking ID
   * @returns Booking details
   */
  getBookingDetails: async (id: string): Promise<BookingResponse> => {
    const response = await api.get(`/bookings/${id}`);
    return response.data.booking;
  },

  /**
   * Cancel booking
   * @param id Booking ID
   * @param reason Cancellation reason
   * @returns Success response
   */
  cancelBooking: async (
    id: string,
    reason: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.post(`/bookings/${id}/cancel`, { reason });
    return response.data;
  },

  /**
   * Submit review
   * @param reviewData Review data
   * @returns Created review
   */
  submitReview: async (reviewData: ReviewData): Promise<any> => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },
};

export default customerService;
