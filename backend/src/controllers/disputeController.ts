import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../config/prisma';
import { AppError } from '../middleware/errorHandler';
import { sendNotification } from '../services/notificationService';
import logger from '../utils/logger';
import { uploadFileToStorage, getFileType } from '../utils/fileUpload';

/**
 * Create dispute/ticket
 */
export const createDispute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookingId, reason, description } = req.body;
    const userId = req.user!.id;

    // Validasi booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        disputes: true,
      },
    });

    if (!booking) {
      return next(new AppError('Booking tidak ditemukan', 404));
    }

    // Cek apakah user terlibat dalam booking ini
    if (booking.customerId !== userId && booking.providerId !== userId) {
      return next(new AppError('Anda tidak terlibat dalam booking ini', 403));
    }

    // Cek apakah sudah ada dispute untuk booking ini
    if (booking.disputes && booking.disputes.length > 0) {
      return next(new AppError('Dispute untuk booking ini sudah ada', 400));
    }

    // Buat dispute
    const dispute = await prisma.dispute.create({
      data: {
        bookingId,
        customerId: booking.customerId,
        reason,
        description,
        status: 'OPEN',
      },
    });

    // Handle attachments jika ada
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        const fileType = getFileType(file.mimetype);
        if (!fileType) continue;
        const uploadResult = await uploadFileToStorage(
          file.buffer,
          `disputes/${bookingId}/${Date.now()}_${file.originalname}`,
          file.mimetype
        );
        await prisma.disputeAttachment.create({
          data: {
            disputeId: dispute.id,
            fileUrl: uploadResult.url,
            fileName: file.originalname,
            fileType: fileType,
          },
        });
      }
    }

    // Kirim notifikasi ke pihak lain yang terlibat
    const otherUserId = booking.customerId === userId ? booking.providerId : booking.customerId;
    await sendNotification(
      otherUserId,
      'Dispute Dibuat',
      `Dispute telah dibuat untuk booking #${booking.bookingNumber}: ${reason}`,
      'dispute',
      { bookingId, disputeId: dispute.id }
    );

    // Kirim notifikasi ke admin
    const admins = await prisma.user.findMany({ where: { role: 'ADMIN' } });
    for (const admin of admins) {
      await sendNotification(
        admin.id,
        'Dispute Baru',
        `Dispute baru dibuat untuk booking #${booking.bookingNumber}`,
        'dispute',
        { bookingId, disputeId: dispute.id }
      );
    }

    res.status(201).json({
      success: true,
      message: 'Dispute berhasil dibuat',
      data: dispute,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get dispute by booking ID
 */
export const getDisputeByBooking = async (req: Request, res: Response, next: NextFunction) => {
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

    // Cek apakah user terlibat dalam booking ini atau admin
    const isInvolved = booking.customerId === userId || booking.providerId === userId;
    const isAdmin = req.user!.role === 'ADMIN';

    if (!isInvolved && !isAdmin) {
      return next(new AppError('Anda tidak berhak melihat dispute ini', 403));
    }

    // Get dispute (tanpa attachments di include)
    const dispute = await prisma.dispute.findFirst({
      where: { bookingId },
      include: {
        booking: {
          select: {
            bookingNumber: true,
            totalAmount: true,
            status: true,
          },
        },
        customer: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!dispute) {
      return next(new AppError('Dispute tidak ditemukan', 404));
    }

    // Ambil attachments dengan query terpisah
    const attachments = await prisma.disputeAttachment.findMany({
      where: { disputeId: dispute.id },
    });

    res.status(200).json({
      success: true,
      data: {
        ...dispute,
        attachments,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all disputes (admin)
 */
export const getAllDisputes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    if (req.user!.role !== 'ADMIN') {
      return next(new AppError('Hanya admin yang dapat mengakses semua dispute', 403));
    }

    const filter: any = {};
    if (status) {
      filter.status = status;
    }

    const disputes = await prisma.dispute.findMany({
      where: filter,
      include: {
        booking: {
          select: {
            bookingNumber: true,
            totalAmount: true,
            status: true,
          },
        },
        customer: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: Number(limit),
    });

    const total = await prisma.dispute.count({
      where: filter,
    });

    res.status(200).json({
      success: true,
      data: {
        disputes,
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
 * Get disputes by user ID
 */
export const getUserDisputes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return next(new AppError('User tidak ditemukan', 404));
    }

    let filter: any = {};
    if (status) filter.status = status;

    if (user.role === 'CUSTOMER') {
      filter.customerId = userId;
    } else if (user.role === 'PROVIDER') {
      // Dapatkan bookingId yang providerId-nya userId
      const providerBookings = await prisma.booking.findMany({
        where: { providerId: userId },
        select: { id: true },
      });
      filter.bookingId = { in: providerBookings.map(b => b.id) };
    }

    const disputes = await prisma.dispute.findMany({
      where: filter,
      include: {
        booking: {
          select: {
            bookingNumber: true,
            totalAmount: true,
            status: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: Number(limit),
    });

    const total = await prisma.dispute.count({
      where: filter,
    });

    res.status(200).json({
      success: true,
      data: {
        disputes,
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
 * Resolve dispute (admin)
 */
export const resolveDispute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { disputeId } = req.params;
    const { resolution, status, refundAmount } = req.body;

    if (req.user!.role !== 'ADMIN') {
      return next(new AppError('Hanya admin yang dapat menyelesaikan dispute', 403));
    }

    // Validasi status
    const validStatuses = ['IN_REVIEW', 'RESOLVED', 'REJECTED'];
    if (!validStatuses.includes(status)) {
      return next(new AppError('Status tidak valid', 400));
    }

    const dispute = await prisma.dispute.findUnique({
      where: { id: disputeId },
      include: {
        booking: {
          include: {
            payments: true,
          },
        },
      },
    });

    if (!dispute) {
      return next(new AppError('Dispute tidak ditemukan', 404));
    }

    if (dispute.status !== 'OPEN' && dispute.status !== 'IN_REVIEW') {
      return next(new AppError('Dispute ini sudah diselesaikan', 400));
    }

    await prisma.$transaction(async prisma => {
      await prisma.dispute.update({
        where: { id: disputeId },
        data: {
          status: status as any,
          resolution,
        },
      });

      // Refund jika status RESOLVED dan refundAmount diberikan
      if (status === 'RESOLVED' && refundAmount) {
        const payment = dispute.booking.payments[0];
        if (!payment) {
          throw new AppError('Payment tidak ditemukan', 404);
        }
        if (payment.status !== 'ESCROW') {
          throw new AppError('Hanya payment dengan status ESCROW yang dapat direfund', 400);
        }
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'REFUNDED',
          },
        });
        await prisma.transaction.create({
          data: {
            paymentId: payment.id,
            userId: dispute.booking.customerId,
            transactionType: 'REFUND',
            amount: refundAmount,
            status: 'SUCCESS',
            description: `Refund karena dispute: ${resolution}`,
          },
        });
      }
    });

    // Notifikasi ke customer dan provider
    await sendNotification(
      dispute.booking.customerId,
      'Dispute Diselesaikan',
      `Dispute untuk booking #${dispute.booking.bookingNumber} telah diselesaikan oleh admin`,
      'dispute_resolved',
      { bookingId: dispute.booking.id, disputeId }
    );
    await sendNotification(
      dispute.booking.providerId,
      'Dispute Diselesaikan',
      `Dispute untuk booking #${dispute.booking.bookingNumber} telah diselesaikan oleh admin`,
      'dispute_resolved',
      { bookingId: dispute.booking.id, disputeId }
    );

    res.status(200).json({
      success: true,
      message: 'Dispute berhasil diselesaikan',
      data: {
        disputeId,
        status,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add dispute attachment
 */
export const addDisputeAttachment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { disputeId } = req.params;
    const userId = req.user!.id;

    const dispute = await prisma.dispute.findUnique({
      where: { id: disputeId },
      include: {
        booking: true,
      },
    });

    if (!dispute) {
      return next(new AppError('Dispute tidak ditemukan', 404));
    }

    const isInvolved =
      dispute.booking.customerId === userId || dispute.booking.providerId === userId;
    const isAdmin = req.user!.role === 'ADMIN';

    if (!isInvolved && !isAdmin) {
      return next(new AppError('Anda tidak berhak menambahkan attachment ke dispute ini', 403));
    }

    if (dispute.status !== 'OPEN' && dispute.status !== 'IN_REVIEW') {
      return next(
        new AppError('Tidak dapat menambahkan attachment ke dispute yang sudah diselesaikan', 400)
      );
    }

    if (!req.file) {
      return next(new AppError('File tidak ditemukan', 400));
    }

    const file = req.file;
    const fileType = getFileType(file.mimetype);

    if (!fileType) {
      return next(new AppError('Format file tidak didukung', 400));
    }

    const uploadResult = await uploadFileToStorage(
      file.buffer,
      `disputes/${dispute.bookingId}/${Date.now()}_${file.originalname}`,
      file.mimetype
    );

    const attachment = await prisma.disputeAttachment.create({
      data: {
        disputeId,
        fileUrl: uploadResult.url,
        fileName: file.originalname,
        fileType,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Attachment berhasil ditambahkan',
      data: attachment,
    });
  } catch (error) {
    next(error);
  }
};
