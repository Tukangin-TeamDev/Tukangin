import { PrismaClient, Notification } from '@prisma/client';
import { logger } from '../utils/logger';
import { ApiError } from '../utils/api-error';

const prisma = new PrismaClient();

export interface CreateNotificationDto {
  userId: number;
  message: string;
  type: string;
}

export interface NotificationResponseDto {
  id: number;
  userId: number;
  message: string;
  type: string;
  read: boolean;
  createdAt: Date;
}

export class NotificationService {
  /**
   * Membuat notifikasi baru
   */
  async createNotification(notificationData: CreateNotificationDto): Promise<Notification> {
    try {
      logger.info(`Membuat notifikasi baru untuk user ID: ${notificationData.userId}`);

      // Periksa apakah user ada
      const user = await prisma.user.findUnique({
        where: { id: notificationData.userId },
      });

      if (!user) {
        throw new ApiError(404, 'User tidak ditemukan');
      }

      // Buat notifikasi baru
      const notification = await prisma.notification.create({
        data: {
          userId: notificationData.userId,
          message: notificationData.message,
          type: notificationData.type,
          read: false,
        },
      });

      logger.info(`Notifikasi berhasil dibuat dengan ID: ${notification.id}`);

      // Di sini bisa ditambahkan integrasi dengan WebSocket/Firebase/Email
      // untuk notifikasi real-time

      return notification;
    } catch (error) {
      logger.error('Gagal membuat notifikasi:', error);
      throw error;
    }
  }

  /**
   * Membuat notifikasi untuk banyak user sekaligus
   */
  async createBulkNotifications(userIds: number[], message: string, type: string): Promise<number> {
    try {
      logger.info(`Membuat notifikasi massal untuk ${userIds.length} user`);

      // Membuat data notifikasi untuk setiap user
      const notificationData = userIds.map(userId => ({
        userId,
        message,
        type,
        read: false,
      }));

      // Buat notifikasi secara batch
      const result = await prisma.notification.createMany({
        data: notificationData,
      });

      logger.info(`${result.count} notifikasi berhasil dibuat`);

      return result.count;
    } catch (error) {
      logger.error('Gagal membuat notifikasi massal:', error);
      throw error;
    }
  }

  /**
   * Menandai notifikasi sebagai telah dibaca
   */
  async markAsRead(id: number, userId: number): Promise<Notification> {
    try {
      logger.info(`Menandai notifikasi ID: ${id} sebagai dibaca`);

      // Periksa apakah notifikasi ada dan milik user yang benar
      const notification = await prisma.notification.findFirst({
        where: {
          id,
          userId,
        },
      });

      if (!notification) {
        throw new ApiError(404, 'Notifikasi tidak ditemukan atau Anda tidak memiliki akses');
      }

      // Jika sudah dibaca, tidak perlu diupdate lagi
      if (notification.read) {
        return notification;
      }

      // Update notifikasi menjadi dibaca
      const updatedNotification = await prisma.notification.update({
        where: { id },
        data: {
          read: true,
        },
      });

      logger.info(`Notifikasi ID: ${id} telah ditandai sebagai dibaca`);

      return updatedNotification;
    } catch (error) {
      logger.error(`Gagal menandai notifikasi ID: ${id} sebagai dibaca:`, error);
      throw error;
    }
  }

  /**
   * Menandai semua notifikasi user sebagai telah dibaca
   */
  async markAllAsRead(userId: number): Promise<number> {
    try {
      logger.info(`Menandai semua notifikasi untuk user ID: ${userId} sebagai dibaca`);

      // Update semua notifikasi user menjadi dibaca
      const result = await prisma.notification.updateMany({
        where: {
          userId,
          read: false,
        },
        data: {
          read: true,
        },
      });

      logger.info(`${result.count} notifikasi telah ditandai sebagai dibaca`);

      return result.count;
    } catch (error) {
      logger.error(`Gagal menandai semua notifikasi user ID: ${userId} sebagai dibaca:`, error);
      throw error;
    }
  }

  /**
   * Mendapatkan daftar notifikasi untuk user
   */
  async getNotificationsByUserId(
    userId: number,
    limit: number = 10,
    offset: number = 0
  ): Promise<{
    notifications: NotificationResponseDto[];
    meta: {
      total: number;
      limit: number;
      offset: number;
      unreadCount: number;
    };
  }> {
    try {
      // Mendapatkan daftar notifikasi, diurutkan dari yang terbaru
      const [notifications, total, unreadCount] = await Promise.all([
        prisma.notification.findMany({
          where: { userId },
          orderBy: {
            createdAt: 'desc',
          },
          skip: offset,
          take: limit,
        }),
        prisma.notification.count({
          where: { userId },
        }),
        prisma.notification.count({
          where: {
            userId,
            read: false,
          },
        }),
      ]);

      // Mapping ke response DTO
      const notificationResponses: NotificationResponseDto[] = notifications.map(notification => ({
        id: notification.id,
        userId: notification.userId,
        message: notification.message,
        type: notification.type,
        read: notification.read,
        createdAt: notification.createdAt,
      }));

      return {
        notifications: notificationResponses,
        meta: {
          total,
          limit,
          offset,
          unreadCount,
        },
      };
    } catch (error) {
      logger.error(`Gagal mendapatkan notifikasi untuk user ID: ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Menghapus notifikasi
   */
  async deleteNotification(id: number, userId: number): Promise<void> {
    try {
      logger.info(`Menghapus notifikasi ID: ${id}`);

      // Periksa apakah notifikasi ada dan milik user yang benar
      const notification = await prisma.notification.findFirst({
        where: {
          id,
          userId,
        },
      });

      if (!notification) {
        throw new ApiError(404, 'Notifikasi tidak ditemukan atau Anda tidak memiliki akses');
      }

      // Hapus notifikasi
      await prisma.notification.delete({
        where: { id },
      });

      logger.info(`Notifikasi ID: ${id} berhasil dihapus`);
    } catch (error) {
      logger.error(`Gagal menghapus notifikasi ID: ${id}:`, error);
      throw error;
    }
  }

  /**
   * Menghapus semua notifikasi yang sudah dibaca
   */
  async deleteReadNotifications(userId: number): Promise<number> {
    try {
      logger.info(`Menghapus semua notifikasi yang sudah dibaca untuk user ID: ${userId}`);

      // Hapus semua notifikasi yang sudah dibaca
      const result = await prisma.notification.deleteMany({
        where: {
          userId,
          read: true,
        },
      });

      logger.info(`${result.count} notifikasi yang sudah dibaca berhasil dihapus`);

      return result.count;
    } catch (error) {
      logger.error(`Gagal menghapus notifikasi yang sudah dibaca untuk user ID: ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Notifikasi untuk event order (sistem)
   */
  async sendOrderStatusNotification(orderId: number): Promise<Notification | null> {
    try {
      // Ambil data order
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          customer: true,
          provider: {
            include: {
              user: true,
            },
          },
          service: true,
        },
      });

      if (!order) {
        logger.error(`Order ID: ${orderId} tidak ditemukan untuk notifikasi`);
        return null;
      }

      let message = '';
      let type = '';
      let userId: number;

      // Menentukan pesan dan tipe notifikasi berdasarkan status order
      switch (order.status) {
        case 'PENDING':
          // Notifikasi ke provider bahwa ada order baru
          message = `Order baru untuk layanan "${order.service.name}" dari ${order.customer.name}`;
          type = 'NEW_ORDER';
          userId = order.provider.user.id;
          break;
        case 'ACCEPTED':
          // Notifikasi ke customer bahwa order diterima
          message = `Order "${order.service.name}" telah diterima oleh ${order.provider.user.name}`;
          type = 'ORDER_ACCEPTED';
          userId = order.customerId;
          break;
        case 'IN_PROGRESS':
          // Notifikasi ke customer bahwa order sedang dikerjakan
          message = `Order "${order.service.name}" sedang dikerjakan oleh ${order.provider.user.name}`;
          type = 'ORDER_IN_PROGRESS';
          userId = order.customerId;
          break;
        case 'COMPLETED':
          // Notifikasi ke provider bahwa order selesai
          message = `Order "${order.service.name}" telah diselesaikan`;
          type = 'ORDER_COMPLETED';
          userId = order.provider.user.id;
          break;
        case 'DISPUTED':
          // Notifikasi ke provider bahwa ada dispute
          message = `Dispute dibuat untuk order "${order.service.name}"`;
          type = 'ORDER_DISPUTED';
          userId = order.provider.user.id;
          break;
        case 'CANCELLED':
          // Notifikasi ke provider bahwa order dibatalkan
          message = `Order "${order.service.name}" telah dibatalkan`;
          type = 'ORDER_CANCELLED';
          userId = order.provider.user.id;
          break;
        default:
          return null;
      }

      // Buat notifikasi
      return await this.createNotification({
        userId,
        message,
        type,
      });
    } catch (error) {
      logger.error(`Gagal mengirim notifikasi status order ID: ${orderId}:`, error);
      throw error;
    }
  }
}
