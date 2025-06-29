import prisma from '../config/prisma';
import { io } from '../config/socket';
import logger from '../utils/logger';

interface NotificationMetadata {
  [key: string]: any;
}

/**
 * Mengirim notifikasi ke pengguna
 * @param userId ID pengguna yang akan menerima notifikasi
 * @param title Judul notifikasi
 * @param message Pesan notifikasi
 * @param type Tipe notifikasi ('booking', 'payment', 'message', 'system', dll)
 * @param metadata Data tambahan untuk notifikasi (untuk deeplink/action)
 * @returns Boolean sukses atau tidak
 */
export const sendNotification = async (
  userId: string,
  title: string,
  message: string,
  type: string,
  metadata?: NotificationMetadata
): Promise<boolean> => {
  try {
    // Simpan notifikasi ke database
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });

    // Kirim notifikasi melalui WebSocket
    io.to(`user_${userId}`).emit('notification', {
      id: notification.id,
      title,
      message,
      type,
      metadata: notification.metadata,
      createdAt: notification.createdAt,
    });

    // Jika kamu menggunakan push notification (FCM, APN), kode akan di sini
    // Cari device tokens dan kirim push
    const userDevices = await prisma.device.findMany({
      where: {
        userId,
      },
    });

    if (userDevices.length > 0) {
      // Contoh implementasi akan memanggil Firebase atau service push notification lainnya
      // await sendPushNotification(userDevices, title, message, metadata);
      logger.info(`Push notification akan dikirim ke ${userDevices.length} device`);
    }

    return true;
  } catch (error) {
    logger.error('Error sending notification:', error);
    return false;
  }
};

/**
 * Menandai notifikasi sebagai telah dibaca
 * @param notificationId ID notifikasi
 * @param userId ID pengguna (untuk verifikasi)
 * @returns Boolean sukses atau tidak
 */
export const markNotificationAsRead = async (
  notificationId: string,
  userId: string
): Promise<boolean> => {
  try {
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!notification) {
      return false;
    }

    await prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        isRead: true,
      },
    });

    return true;
  } catch (error) {
    logger.error('Error marking notification as read:', error);
    return false;
  }
};

/**
 * Menandai semua notifikasi pengguna sebagai telah dibaca
 * @param userId ID pengguna
 * @returns Boolean sukses atau tidak
 */
export const markAllNotificationsAsRead = async (userId: string): Promise<boolean> => {
  try {
    await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return true;
  } catch (error) {
    logger.error('Error marking all notifications as read:', error);
    return false;
  }
};

/**
 * Mengambil jumlah notifikasi yang belum dibaca
 * @param userId ID pengguna
 * @returns Jumlah notifikasi yang belum dibaca
 */
export const getUnreadNotificationCount = async (userId: string): Promise<number> => {
  try {
    const count = await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    return count;
  } catch (error) {
    logger.error('Error getting unread notification count:', error);
    return 0;
  }
};

/**
 * Get user notifications
 * @param userId User ID
 * @param page Page number
 * @param limit Limit per page
 * @returns Notifications and pagination info
 */
export const getUserNotifications = async (
  userId: string,
  page: number = 1,
  limit: number = 10
) => {
  try {
    const skip = (page - 1) * limit;

    // Get notifications
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });

    // Count total notifications
    const total = await prisma.notification.count({
      where: { userId },
    });

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    logger.error('Get user notifications error:', error);
    throw error;
  }
};

/**
 * Delete notification
 * @param notificationId Notification ID
 * @param userId User ID
 * @returns Boolean indicating if deletion was successful
 */
export const deleteNotification = async (notificationId: string, userId: string) => {
  try {
    // Find notification
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    // Check if notification belongs to user
    if (!notification || notification.userId !== userId) {
      throw new Error('Notification not found or unauthorized');
    }

    // Delete notification
    await prisma.notification.delete({
      where: { id: notificationId },
    });

    return true;
  } catch (error) {
    logger.error('Delete notification error:', error);
    throw error;
  }
};
