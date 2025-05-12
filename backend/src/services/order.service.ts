import { PrismaClient, OrderStatus as PrismaOrderStatus, Order, Payment, Service, Dispute, User, ProviderProfile } from '@prisma/client';
import { 
  CreateOrderDto, 
  CreateConsultativeOrderDto, 
  OrderResponseDto, 
  UpdateOrderDto,
  OrderFilterDto,
  OrderStatus
} from "../types/order.types";
import { ServiceType } from "../types/service.types";
import { logger } from '../utils/logger';
import { ApiError } from '../utils/api-error';

const prisma = new PrismaClient();

// Tipe untuk hasil query order dengan relasi
type OrderWithRelations = Order & {
  customer: Pick<User, 'name' | 'email' | 'phone'>;
  provider: ProviderProfile & {
    user: Pick<User, 'name' | 'email' | 'phone'>;
  };
  service: Service;
  payment?: Payment | null;
  dispute?: Dispute | null;
};

export class OrderService {
  /**
   * Mendapatkan order berdasarkan ID
   */
  async getOrderById(id: number): Promise<OrderResponseDto | null> {
    try {
      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          customer: {
            select: {
              name: true,
              email: true,
              phone: true,
            }
          },
          provider: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                  phone: true,
                }
              }
            }
          },
          service: true,
          payment: true,
          dispute: true,
        }
      });

      if (!order) {
        return null;
      }

      // Transformasi data menggunakan fungsi helper
      return this.mapOrderToResponseDto(order as OrderWithRelations);
    } catch (error) {
      logger.error(`Gagal mendapatkan order ID: ${id}`, error);
      throw error;
    }
  }

  /**
   * Mendapatkan daftar order dengan filter
   */
  async getOrders(filter: OrderFilterDto): Promise<{ 
    orders: OrderResponseDto[]; 
    meta: { page: number; limit: number; totalItems: number; totalPages: number; };
  }> {
    try {
      const { 
        customerId, 
        providerId, 
        status, 
        orderType, 
        startDate, 
        endDate, 
        page = 1, 
        limit = 10 
      } = filter;

      const skip = (page - 1) * limit;
      
      const where: Record<string, any> = {};
      
      if (customerId) {
        where.customerId = customerId;
      }
      
      if (providerId) {
        where.providerId = providerId;
      }
      
      if (status) {
        where.status = status;
      }
      
      if (orderType) {
        where.orderType = orderType;
      }
      
      if (startDate || endDate) {
        where.createdAt = {};
        
        if (startDate) {
          where.createdAt.gte = new Date(startDate);
        }
        
        if (endDate) {
          where.createdAt.lte = new Date(endDate);
        }
      }
      
      const [orders, total] = await Promise.all([
        prisma.order.findMany({
          where,
          include: {
            customer: {
              select: {
                name: true,
              }
            },
            provider: {
              include: {
                user: {
                  select: {
                    name: true,
                  }
                }
              }
            },
            service: {
              select: {
                name: true,
                serviceType: true,
              }
            },
            payment: {
              select: {
                status: true,
                amount: true,
              }
            },
          },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.order.count({ where }),
      ]);
      
      return {
        orders: orders.map((order) => ({
          id: order.id,
          customerId: order.customerId,
          customerName: order.customer.name,
          providerId: order.providerId,
          providerName: order.provider.user.name,
          serviceId: order.serviceId,
          serviceName: order.service.name,
          orderType: order.orderType as ServiceType,
          status: order.status as OrderStatus,
          escrowAmount: order.escrowAmount,
          scheduledAt: order.scheduledAt,
          description: order.description,
          negotiationNote: order.negotiationNote,
          paymentStatus: order.payment?.status,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        })),
        meta: {
          page,
          limit,
          totalItems: total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Gagal mendapatkan daftar order', error);
      throw error;
    }
  }

  /**
   * Membuat order baru (fixed-price atau konsultatif)
   */
  async createOrder(orderData: CreateOrderDto | CreateConsultativeOrderDto): Promise<OrderResponseDto> {
    try {
      // Cek apakah layanan ada
      const service = await prisma.service.findUnique({
        where: { id: orderData.serviceId },
        include: {
          providerProfile: true,
        }
      });

      if (!service) {
        throw new ApiError(404, 'Layanan tidak ditemukan');
      }

      // Cek apakah customer ada
      const customer = await prisma.user.findUnique({
        where: { id: orderData.customerId }
      });

      if (!customer) {
        throw new ApiError(404, 'Customer tidak ditemukan');
      }

      // Gunakan providerId dari service
      const providerId = service.providerProfile.id;

      // Tentukan status awal dan escrowAmount berdasarkan tipe order
      let initialStatus: PrismaOrderStatus;
      let escrowAmount: number;

      if (service.serviceType === 'FIXED') {
        if (!service.fixedPrice) {
          throw new ApiError(400, 'Harga tidak tersedia untuk layanan ini');
        }
        initialStatus = PrismaOrderStatus.PENDING;
        escrowAmount = service.fixedPrice;
      } else {
        // Untuk order konsultatif
        initialStatus = PrismaOrderStatus.NEGOTIATION;
        escrowAmount = 0; // Akan ditentukan setelah negosiasi
      }

      // Buat order baru
      const newOrder = await prisma.order.create({
        data: {
          customerId: orderData.customerId,
          providerId,
          serviceId: orderData.serviceId,
          orderType: service.serviceType,
          status: initialStatus,
          escrowAmount,
          description: 'description' in orderData ? orderData.description : undefined,
          scheduledAt: 'scheduledAt' in orderData && orderData.scheduledAt ? 
            new Date(orderData.scheduledAt instanceof Date ? orderData.scheduledAt.toISOString() : orderData.scheduledAt) : 
            undefined,
        },
        include: {
          customer: {
            select: {
              name: true,
              email: true,
              phone: true,
            }
          },
          provider: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                  phone: true,
                }
              }
            }
          },
          service: true,
        }
      });

      logger.info(`Order baru berhasil dibuat dengan ID: ${newOrder.id}`);

      return this.mapOrderToResponseDto(newOrder as OrderWithRelations);
    } catch (error) {
      logger.error('Gagal membuat order baru', error);
      throw error;
    }
  }

  /**
   * Update order yang sudah ada
   */
  async updateOrder(id: number, updateData: UpdateOrderDto): Promise<OrderResponseDto> {
    try {
      // Cek apakah order ada
      const order = await prisma.order.findUnique({
        where: { id }
      });

      if (!order) {
        throw new ApiError(404, 'Order tidak ditemukan');
      }

      // Jika mengubah status, validasi transisi status
      if (updateData.status && updateData.status !== order.status) {
        this.validateStatusTransition(order.status as PrismaOrderStatus, updateData.status as unknown as PrismaOrderStatus);
      }

      // Update order
      const updatedOrder = await prisma.order.update({
        where: { id },
        data: {
          status: updateData.status as PrismaOrderStatus,
          scheduledAt: updateData.scheduledAt ? new Date(updateData.scheduledAt instanceof Date ? updateData.scheduledAt.toISOString() : updateData.scheduledAt) : undefined,
          escrowAmount: updateData.escrowAmount,
          negotiationNote: updateData.negotiationNote,
          description: updateData.description,
        },
        include: {
          customer: {
            select: {
              name: true,
              email: true,
              phone: true,
            }
          },
          provider: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                  phone: true,
                }
              }
            }
          },
          service: true,
          payment: true,
          dispute: true,
        }
      });

      logger.info(`Order ID: ${id} berhasil diupdate`);

      return this.mapOrderToResponseDto(updatedOrder as OrderWithRelations);
    } catch (error) {
      logger.error(`Gagal update order ID: ${id}`, error);
      throw error;
    }
  }

  /**
   * Konfirmasi order selesai oleh customer
   */
  async confirmOrder(id: number, customerId: number): Promise<OrderResponseDto> {
    try {
      // Cek apakah order ada dan dimiliki oleh customer yang benar
      const order = await prisma.order.findFirst({
        where: {
          id,
          customerId,
        },
        include: {
          payment: true,
        }
      });

      if (!order) {
        throw new ApiError(404, 'Order tidak ditemukan atau Anda tidak memiliki akses');
      }

      // Cek apakah status order valid (harus IN_PROGRESS)
      if (order.status !== PrismaOrderStatus.IN_PROGRESS) {
        throw new ApiError(400, 'Hanya order dengan status IN_PROGRESS yang dapat dikonfirmasi selesai');
      }

      // Update status order menjadi COMPLETED
      const completedOrder = await prisma.order.update({
        where: { id },
        data: {
          status: PrismaOrderStatus.COMPLETED,
        },
        include: {
          customer: {
            select: {
              name: true,
              email: true,
              phone: true,
            }
          },
          provider: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                  phone: true,
                }
              }
            }
          },
          service: true,
          payment: true,
          dispute: true,
        }
      });

      logger.info(`Order ID: ${id} telah dikonfirmasi selesai oleh customer`);

      return this.mapOrderToResponseDto(completedOrder as OrderWithRelations);
    } catch (error) {
      logger.error(`Gagal konfirmasi order ID: ${id}`, error);
      throw error;
    }
  }

  /**
   * Membuat dispute untuk order
   */
  async createDispute(
    orderId: number, 
    customerId: number, 
    description: string
  ): Promise<any> {
    try {
      // Cek apakah order ada dan dimiliki oleh customer yang benar
      const order = await prisma.order.findFirst({
        where: {
          id: orderId,
          customerId,
        },
        include: {
          dispute: true,
          provider: true,
        }
      });

      if (!order) {
        throw new ApiError(404, 'Order tidak ditemukan atau Anda tidak memiliki akses');
      }

      // Cek apakah sudah ada dispute untuk order ini
      if (order.dispute) {
        throw new ApiError(400, 'Dispute sudah ada untuk order ini');
      }

      // Cek status order (harus ACCEPTED, IN_PROGRESS, atau COMPLETED)
      const validStatus: PrismaOrderStatus[] = [
        PrismaOrderStatus.ACCEPTED, 
        PrismaOrderStatus.IN_PROGRESS, 
        PrismaOrderStatus.COMPLETED
      ];
      
      if (!validStatus.includes(order.status as PrismaOrderStatus)) {
        throw new ApiError(400, 'Dispute hanya dapat dibuat untuk order dengan status ACCEPTED, IN_PROGRESS, atau COMPLETED');
      }

      // Buat dispute baru
      const newDispute = await prisma.dispute.create({
        data: {
          orderId,
          customerId,
          providerId: order.providerId,
          description,
          status: 'OPEN',
        }
      });

      // Update status order menjadi DISPUTED
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: PrismaOrderStatus.DISPUTED,
        }
      });

      logger.info(`Dispute baru dibuat untuk order ID: ${orderId}`);

      return newDispute;
    } catch (error) {
      logger.error(`Gagal membuat dispute untuk order ID: ${orderId}`, error);
      throw error;
    }
  }

  /**
   * Mengubah status order
   */
  async updateOrderStatus(id: number, newStatus: PrismaOrderStatus): Promise<Order> {
    try {
      // Cek apakah order ada
      const order = await prisma.order.findUnique({
        where: { id }
      });

      if (!order) {
        throw new ApiError(404, 'Order tidak ditemukan');
      }

      // Validasi transisi status
      this.validateStatusTransition(order.status as PrismaOrderStatus, newStatus);

      // Update status
      const updatedOrder = await prisma.order.update({
        where: { id },
        data: {
          status: newStatus,
        }
      });

      logger.info(`Status order ID: ${id} diubah menjadi ${newStatus}`);

      return updatedOrder;
    } catch (error) {
      logger.error(`Gagal mengubah status order ID: ${id}`, error);
      throw error;
    }
  }

  /**
   * Validasi transisi status order
   */
  private validateStatusTransition(currentStatus: PrismaOrderStatus, newStatus: PrismaOrderStatus): void {
    // Validasi transisi status berdasarkan state machine
    const validTransitions: Record<PrismaOrderStatus, PrismaOrderStatus[]> = {
      [PrismaOrderStatus.PENDING]: [PrismaOrderStatus.ACCEPTED, PrismaOrderStatus.CANCELLED],
      [PrismaOrderStatus.NEGOTIATION]: [PrismaOrderStatus.ACCEPTED, PrismaOrderStatus.CANCELLED],
      [PrismaOrderStatus.ACCEPTED]: [PrismaOrderStatus.IN_PROGRESS, PrismaOrderStatus.CANCELLED, PrismaOrderStatus.DISPUTED],
      [PrismaOrderStatus.IN_PROGRESS]: [PrismaOrderStatus.COMPLETED, PrismaOrderStatus.DISPUTED],
      [PrismaOrderStatus.COMPLETED]: [PrismaOrderStatus.DISPUTED],
      [PrismaOrderStatus.DISPUTED]: [PrismaOrderStatus.COMPLETED, PrismaOrderStatus.CANCELLED],
      [PrismaOrderStatus.CANCELLED]: []
    };

    if (!validTransitions[currentStatus].includes(newStatus)) {
      throw new ApiError(400, `Tidak dapat mengubah status dari ${currentStatus} menjadi ${newStatus}`);
    }
  }

  /**
   * Transformasi data order ke response DTO
   */
  private mapOrderToResponseDto(order: OrderWithRelations): OrderResponseDto {
    return {
      id: order.id,
      customerId: order.customerId,
      customerName: order.customer.name,
      customerEmail: order.customer.email,
      customerPhone: order.customer.phone || undefined,
      providerId: order.providerId,
      providerName: order.provider.user.name,
      providerEmail: order.provider.user.email,
      providerPhone: order.provider.user.phone || undefined,
      serviceId: order.serviceId,
      serviceName: order.service.name,
      serviceDescription: order.service.description,
      orderType: order.orderType as ServiceType,
      status: order.status as OrderStatus,
      escrowAmount: order.escrowAmount,
      scheduledAt: order.scheduledAt,
      description: order.description,
      negotiationNote: order.negotiationNote,
      paymentStatus: order.payment?.status,
      paymentAmount: order.payment?.amount,
      hasDispute: !!order.dispute,
      disputeStatus: order.dispute?.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}

// Export fungsi lama juga untuk menjaga backward compatibility
export const getOrderById = async (id: number): Promise<OrderResponseDto | null> => {
  const orderService = new OrderService();
  return orderService.getOrderById(id);
};

export const getOrders = async (filter: OrderFilterDto): Promise<{ 
  orders: OrderResponseDto[]; 
  meta: { page: number; limit: number; totalItems: number; totalPages: number; };
}> => {
  const orderService = new OrderService();
  return orderService.getOrders(filter);
};

export const createOrder = async (orderData: CreateOrderDto | CreateConsultativeOrderDto): Promise<OrderResponseDto> => {
  const orderService = new OrderService();
  return orderService.createOrder(orderData);
};

export const updateOrder = async (id: number, updateData: UpdateOrderDto): Promise<OrderResponseDto> => {
  const orderService = new OrderService();
  return orderService.updateOrder(id, updateData);
};

export const confirmOrder = async (id: number, customerId: number): Promise<OrderResponseDto> => {
  const orderService = new OrderService();
  return orderService.confirmOrder(id, customerId);
};

export const createDispute = async (
  orderId: number, 
  customerId: number, 
  description: string
): Promise<any> => {
  const orderService = new OrderService();
  return orderService.createDispute(orderId, customerId, description);
};
