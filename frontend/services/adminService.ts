import api from '@/lib/api';

export interface AdminDashboardStats {
  totalUsers: number;
  totalProviders: number;
  totalCustomers: number;
  totalBookings: number;
  totalRevenue: number;
  activeBookings: number;
  completedBookings: number;
  cancelledBookings: number;
}

export interface UserData {
  id: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
  profile?: {
    fullName: string;
    avatarUrl?: string;
    [key: string]: any;
  };
}

export interface CategoryData {
  id?: string;
  name: string;
  description?: string;
  imageUrl?: string;
  parentId?: string | null;
}

/**
 * Admin service for handling admin-related API requests
 */
const adminService = {
  /**
   * Get dashboard statistics
   * @returns Dashboard stats
   */
  getDashboardStats: async (): Promise<AdminDashboardStats> => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },

  /**
   * Get users list
   * @param role Filter by role (optional)
   * @param page Page number
   * @param limit Items per page
   * @returns List of users
   */
  getUsers: async (
    role?: string,
    page = 1,
    limit = 10
  ): Promise<{ users: UserData[]; total: number; page: number; limit: number }> => {
    const roleParam = role ? `&role=${role}` : '';
    const response = await api.get(`/admin/users?page=${page}&limit=${limit}${roleParam}`);
    return response.data;
  },

  /**
   * Get user details
   * @param id User ID
   * @returns User details
   */
  getUserDetails: async (id: string): Promise<UserData> => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data.user;
  },

  /**
   * Update user status (activate/deactivate)
   * @param id User ID
   * @param isActive Active status
   * @returns Updated user
   */
  updateUserStatus: async (
    id: string,
    isActive: boolean
  ): Promise<{ success: boolean; user: UserData }> => {
    const response = await api.put(`/admin/users/${id}/status`, { isActive });
    return response.data;
  },

  /**
   * Get all categories
   * @returns List of categories
   */
  getCategories: async (): Promise<{ categories: any[] }> => {
    const response = await api.get('/admin/categories');
    return response.data;
  },

  /**
   * Create category
   * @param categoryData Category data
   * @returns Created category
   */
  createCategory: async (categoryData: CategoryData): Promise<any> => {
    const response = await api.post('/admin/categories', categoryData);
    return response.data;
  },

  /**
   * Update category
   * @param id Category ID
   * @param categoryData Category data
   * @returns Updated category
   */
  updateCategory: async (id: string, categoryData: CategoryData): Promise<any> => {
    const response = await api.put(`/admin/categories/${id}`, categoryData);
    return response.data;
  },

  /**
   * Delete category
   * @param id Category ID
   * @returns Success response
   */
  deleteCategory: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/admin/categories/${id}`);
    return response.data;
  },

  /**
   * Get all bookings
   * @param status Filter by status (optional)
   * @param page Page number
   * @param limit Items per page
   * @returns List of bookings
   */
  getAllBookings: async (
    status?: string,
    page = 1,
    limit = 10
  ): Promise<{ bookings: any[]; total: number; page: number; limit: number }> => {
    const statusParam = status ? `&status=${status}` : '';
    const response = await api.get(`/admin/bookings?page=${page}&limit=${limit}${statusParam}`);
    return response.data;
  },

  /**
   * Get disputes
   * @param status Filter by status (optional)
   * @param page Page number
   * @param limit Items per page
   * @returns List of disputes
   */
  getDisputes: async (
    status?: string,
    page = 1,
    limit = 10
  ): Promise<{ disputes: any[]; total: number; page: number; limit: number }> => {
    const statusParam = status ? `&status=${status}` : '';
    const response = await api.get(`/admin/disputes?page=${page}&limit=${limit}${statusParam}`);
    return response.data;
  },

  /**
   * Resolve dispute
   * @param id Dispute ID
   * @param resolution Resolution details
   * @returns Resolved dispute
   */
  resolveDispute: async (
    id: string,
    resolution: string
  ): Promise<{ success: boolean; dispute: any }> => {
    const response = await api.put(`/admin/disputes/${id}/resolve`, { resolution });
    return response.data;
  },
};

export default adminService;
