import prisma from '../config/prisma';
import { io } from '../config/socket';
import logger from '../utils/logger';

/**
 * Send notification to user
 * @param userId User ID to send notification to
 * @param title Title of notification
 * @param message Message content
 * @param type Notification type (booking, chat, payment, system, etc.)
 * @param data Additional data in JSON format
 * @returns Created notification
 */
export const sendNotification = async (
  userId: string,
  title: string,
  message: string,
  type: string,
  data?: Record<string, any>
) => {
  try {
    // Create notification in database
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        data: data || {},
        read: false,
      },
    });

    // Emit notification via Socket.IO
    io.to(`user:${userId}`).emit('notification', {
      id: notification.id,
      title,
      message,
      type,
      data,
      createdAt: notification.createdAt,
    });

    // Return created notification
    return notification;
  } catch (error) {
    logger.error('Notification sending error:', error);
    throw error;
  }
};

/**
 * Mark notification as read
 * @param notificationId Notification ID
 * @param userId User ID
 * @returns Updated notification
 */
export const markNotificationAsRead = async (notificationId: string, userId: string) => {
  try {
    // Find notification
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    // Check if notification belongs to user
    if (!notification || notification.userId !== userId) {
      throw new Error('Notification not found or unauthorized');
    }

    // Update notification
    const updatedNotification = await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });

    return updatedNotification;
  } catch (error) {
    logger.error('Mark notification as read error:', error);
    throw error;
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
 * Mark all notifications as read
 * @param userId User ID
 * @returns Number of notifications updated
 */
export const markAllNotificationsAsRead = async (userId: string) => {
  try {
    const result = await prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: {
        read: true,
      },
    });

    return result.count;
  } catch (error) {
    logger.error('Mark all notifications as read error:', error);
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

/**
 * Get unread notification count
 * @param userId User ID
 * @returns Count of unread notifications
 */
export const getUnreadNotificationCount = async (userId: string) => {
  try {
    const count = await prisma.notification.count({
      where: {
        userId,
        read: false,
      },
    });

    return count;
  } catch (error) {
    logger.error('Get unread notification count error:', error);
    throw error;
  }
};
