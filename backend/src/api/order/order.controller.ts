import { Request, Response } from 'express';
import * as orderService from '../../services/order.service';
import { 
  OrderStatus, 
  CreateOrderDto, 
  CreateConsultativeOrderDto, 
  OrderResponseDto, 
  OrderFilterDto 
} from '../../types/order.types';
import { ServiceType } from '../../types/service.types';
import { ApiResponse } from '../../types/common.types';

/**
 * Mendapatkan daftar order dengan filter
 */
export const getOrders = async (req: Request, res: Response): Promise<Response> => {
  try {
    const filter: OrderFilterDto = {
      customerId: req.query.customerId ? parseInt(req.query.customerId as string) : undefined,
      providerId: req.query.providerId ? parseInt(req.query.providerId as string) : undefined,
      status: req.query.status as OrderStatus | undefined,
      orderType: req.query.orderType as ServiceType | undefined,
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
    };
    
    const { orders, meta } = await orderService.getOrders(filter);
    
    const response: ApiResponse<any[]> = {
      success: true,
      data: orders,
      meta,
    };
    
    return res.status(200).json(response);
  } catch (error: any) {
    console.error('Error getting orders:', error);
    
    const response: ApiResponse<null> = {
      success: false,
      error: error.message || 'Terjadi kesalahan saat mengambil data order',
    };
    
    return res.status(500).json(response);
  }
};

/**
 * Mendapatkan detail order berdasarkan ID
 */
export const getOrderById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const orderId = parseInt(req.params.id);
    
    if (isNaN(orderId)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'ID order tidak valid',
      };
      return res.status(400).json(response);
    }
    
    const order = await orderService.getOrderById(orderId);
    
    if (!order) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Order tidak ditemukan',
      };
      return res.status(404).json(response);
    }
    
    const response: ApiResponse<OrderResponseDto> = {
      success: true,
      data: order,
    };
    
    return res.status(200).json(response);
  } catch (error: any) {
    console.error('Error getting order by ID:', error);
    
    const response: ApiResponse<null> = {
      success: false,
      error: error.message || 'Terjadi kesalahan saat mengambil data order',
    };
    
    return res.status(500).json(response);
  }
};

/**
 * Membuat order baru
 */
export const createOrder = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Perbedaan antara fixed-price dan konsultatif ditentukan oleh service yang dipilih
    const { serviceId, customerId, description, scheduledAt, negotiationNote } = req.body;
    
    // Validasi input dasar
    if (!serviceId || !customerId) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'ServiceId dan customerId harus diisi',
      };
      return res.status(400).json(response);
    }

    // Periksa apakah order ini konsultatif (dengan negotiationNote) atau fixed-price
    const orderData: CreateOrderDto | CreateConsultativeOrderDto = negotiationNote 
      ? { 
          serviceId: parseInt(serviceId), 
          customerId: parseInt(customerId), 
          description, 
          scheduledAt, 
          negotiationNote 
        } as CreateConsultativeOrderDto
      : { 
          serviceId: parseInt(serviceId), 
          customerId: parseInt(customerId), 
          description, 
          scheduledAt 
        } as CreateOrderDto;

    const order = await orderService.createOrder(orderData);
    
    const response: ApiResponse<OrderResponseDto> = {
      success: true,
      data: order,
      message: 'Order berhasil dibuat',
    };
    
    return res.status(201).json(response);
  } catch (error: any) {
    console.error('Error creating order:', error);
    
    const response: ApiResponse<null> = {
      success: false,
      error: error.message || 'Terjadi kesalahan saat membuat order',
    };
    
    return res.status(500).json(response);
  }
};

/**
 * Konfirmasi order selesai (trigger release escrow)
 */
export const confirmOrder = async (req: Request, res: Response): Promise<Response> => {
  try {
    const orderId = parseInt(req.params.id);
    const customerId = req.user?.id; // Diambil dari middleware authentication
    
    if (isNaN(orderId) || !customerId) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'ID order tidak valid atau Anda tidak memiliki akses',
      };
      return res.status(400).json(response);
    }
    
    const order = await orderService.confirmOrder(orderId, customerId);
    
    const response: ApiResponse<OrderResponseDto> = {
      success: true,
      data: order,
      message: 'Order berhasil dikonfirmasi selesai dan pembayaran telah diproses',
    };
    
    return res.status(200).json(response);
  } catch (error: any) {
    console.error('Error confirming order:', error);
    
    const response: ApiResponse<null> = {
      success: false,
      error: error.message || 'Terjadi kesalahan saat konfirmasi order',
    };
    
    return res.status(400).json(response); // Gunakan 400 karena kemungkinan kesalahan validasi
  }
};

/**
 * Membuat dispute untuk order
 */
export const createDispute = async (req: Request, res: Response): Promise<Response> => {
  try {
    const orderId = parseInt(req.params.id);
    const customerId = req.user?.id; // Diambil dari middleware authentication
    const { description } = req.body;
    
    if (isNaN(orderId) || !customerId || !description) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'ID order tidak valid, deskripsi wajib diisi, atau Anda tidak memiliki akses',
      };
      return res.status(400).json(response);
    }
    
    const dispute = await orderService.createDispute(orderId, customerId, description);
    
    const response: ApiResponse<any> = {
      success: true,
      data: dispute,
      message: 'Dispute berhasil dibuat',
    };
    
    return res.status(201).json(response);
  } catch (error: any) {
    console.error('Error creating dispute:', error);
    
    const response: ApiResponse<null> = {
      success: false,
      error: error.message || 'Terjadi kesalahan saat membuat dispute',
    };
    
    return res.status(400).json(response); // Gunakan 400 karena kemungkinan kesalahan validasi
  }
}; 