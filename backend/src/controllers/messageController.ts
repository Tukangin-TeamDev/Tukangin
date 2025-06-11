import { Request, Response, NextFunction } from 'express';
import { io } from '../config/socket';
import prisma from '../config/prisma';
import { AppError } from '../middleware/errorHandler';
import { uploadFileToStorage, getFileType } from '../utils/fileUpload';
import { sendNotification } from '../services/notificationService';
import logger from '../utils/logger';

/**
 * Send message
 */
export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookingId, content, receiverId } = req.body;
    const senderId = req.user!.id;

    // Validasi booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return next(new AppError('Booking tidak ditemukan', 404));
    }

    // Cek apakah user terlibat dalam booking ini
    if (booking.customerId !== senderId && booking.providerId !== senderId) {
      return next(new AppError('Anda tidak terlibat dalam booking ini', 403));
    }

    // Validasi receiver ID
    if (receiverId !== booking.customerId && receiverId !== booking.providerId) {
      return next(new AppError('Penerima tidak valid', 400));
    }

    // Handle attachment jika ada
    let attachmentUrl = null;
    let attachmentType = null;

    if (req.file) {
      const fileType = getFileType(req.file.mimetype);

      if (!fileType) {
        return next(new AppError('Format file tidak didukung', 400));
      }

      // Upload file ke cloud storage
      const uploadResult = await uploadFileToStorage(
        req.file.buffer,
        `messages/${bookingId}/${Date.now()}_${req.file.originalname}`,
        req.file.mimetype
      );

      attachmentUrl = uploadResult.url;
      attachmentType = fileType;
    }

    // Buat pesan
    const message = await prisma.message.create({
      data: {
        bookingId,
        senderId,
        receiverId,
        content,
        attachmentUrl,
        attachmentType,
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            role: true,
            customer: {
              select: {
                fullName: true,
                avatarUrl: true,
              },
            },
            provider: {
              select: {
                fullName: true,
                businessName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    // Emit pesan via Socket.IO
    io.to(`booking:${bookingId}`).emit('new_message', message);

    // Kirim notifikasi ke penerima
    let senderName = 'User';
    if (message.sender.role === 'CUSTOMER' && message.sender.customer) {
      senderName = message.sender.customer.fullName;
    } else if (message.sender.role === 'PROVIDER' && message.sender.provider) {
      senderName =
        message.sender.provider.fullName || message.sender.provider.businessName || 'Provider';
    }

    await sendNotification(
      receiverId,
      'Pesan Baru',
      `${senderName}: ${content.substring(0, 100)}${content.length > 100 ? '...' : ''}`,
      'message',
      { bookingId, messageId: message.id }
    );

    res.status(201).json({
      success: true,
      message: 'Pesan berhasil dikirim',
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get messages by booking ID
 */
export const getMessagesByBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user!.id;
    const { page = 1, limit = 50 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Validasi booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return next(new AppError('Booking tidak ditemukan', 404));
    }

    // Cek apakah user terlibat dalam booking ini atau admin
    const isAdmin = req.user!.role === 'ADMIN';

    if (booking.customerId !== userId && booking.providerId !== userId && !isAdmin) {
      return next(new AppError('Anda tidak berhak melihat pesan untuk booking ini', 403));
    }

    // Get messages
    const messages = await prisma.message.findMany({
      where: { bookingId },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            role: true,
            customer: {
              select: {
                fullName: true,
                avatarUrl: true,
              },
            },
            provider: {
              select: {
                fullName: true,
                businessName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: Number(limit),
    });

    // Hitung total pesan
    const total = await prisma.message.count({ where: { bookingId } });

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        bookingId,
        receiverId: userId,
        read: false,
      },
      data: { read: true },
    });

    res.status(200).json({
      success: true,
      data: {
        messages,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get unread message count
 */
export const getUnreadMessageCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    const count = await prisma.message.count({
      where: {
        receiverId: userId,
        read: false,
      },
    });

    res.status(200).json({
      success: true,
      data: { unreadCount: count },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark message as read
 */
export const markMessageAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { messageId } = req.params;
    const userId = req.user!.id;

    // Validasi pesan
    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      return next(new AppError('Pesan tidak ditemukan', 404));
    }

    // Cek apakah user adalah penerima pesan
    if (message.receiverId !== userId) {
      return next(new AppError('Anda tidak berhak menandai pesan ini', 403));
    }

    // Update pesan
    await prisma.message.update({
      where: { id: messageId },
      data: { read: true },
    });

    res.status(200).json({
      success: true,
      message: 'Pesan berhasil ditandai sebagai telah dibaca',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark all messages as read for a booking
 */
export const markAllMessagesAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user!.id;

    // Validasi booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return next(new AppError('Booking tidak ditemukan', 404));
    }

    // Cek apakah user terlibat dalam booking ini
    if (booking.customerId !== userId && booking.providerId !== userId) {
      return next(new AppError('Anda tidak terlibat dalam booking ini', 403));
    }

    // Update pesan
    await prisma.message.updateMany({
      where: {
        bookingId,
        receiverId: userId,
        read: false,
      },
      data: { read: true },
    });

    res.status(200).json({
      success: true,
      message: 'Semua pesan berhasil ditandai sebagai telah dibaca',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Report message
 */
export const reportMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { messageId } = req.params;
    const { reason } = req.body;
    const userId = req.user!.id;

    // Validasi pesan
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: {
        booking: true,
        sender: {
          select: {
            email: true,
            customer: {
              select: {
                fullName: true,
              },
            },
            provider: {
              select: {
                fullName: true,
                businessName: true,
              },
            },
          },
        },
      },
    });

    if (!message) {
      return next(new AppError('Pesan tidak ditemukan', 404));
    }

    // Cek apakah user terlibat dalam booking ini
    const booking = message.booking;
    if (booking.customerId !== userId && booking.providerId !== userId) {
      return next(new AppError('Anda tidak terlibat dalam booking ini', 403));
    }

    // Get admins
    const admins = await prisma.user.findMany({
      where: {
        role: 'ADMIN',
        admin: {
          adminRole: 'MODERATOR',
        },
      },
    });

    // Kirim notifikasi ke admin
    for (const admin of admins) {
      await sendNotification(
        admin.id,
        'Laporan Pesan',
        `Pesan di booking #${booking.bookingNumber} dilaporkan: ${reason}`,
        'message_report',
        {
          bookingId: booking.id,
          messageId,
          reportedBy: userId,
          reason,
        }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Laporan berhasil dikirim dan akan ditinjau oleh admin',
    });
  } catch (error) {
    next(error);
  }
};
