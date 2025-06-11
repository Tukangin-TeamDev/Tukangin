import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../config/prisma';
import { AppError } from '../middleware/errorHandler';
import { uploadFileToStorage, getFileType } from '../utils/fileUpload';
import { sendNotification } from '../services/notificationService';
import logger from '../utils/logger';

/**
 * Create dispute/ticket
 */
export const createDispute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookingId, title, description } = req.body;
    const userId = req.user!.id;

    // Validasi booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        payment: true,
        dispute: true
      }
    });

    if (!booking) {
      return next(new AppError('Booking tidak ditemukan', 404));
    }

    // Cek apakah user terlibat dalam booking ini
    if (booking.customerId !== userId && booking.providerId !== userId) {
      return next(new AppError('Anda tidak terlibat dalam booking ini', 403));
    }

    // Cek apakah sudah ada dispute untuk booking ini
    if (booking.dispute) {
      return next(new AppError('Dispute untuk booking ini sudah ada', 400));
    }

    // Buat dispute
    const dispute = await prisma.dispute.create({
      data: {
        bookingId,
        userId,
        title,
        description
      }
    });

    // Handle attachments jika ada
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        const fileType = getFileType(file.mimetype);
        
        if (!fileType) {
          continue; // Skip file dengan format tidak didukung
        }
        
        // Upload file ke cloud storage
        const uploadResult = await uploadFileToStorage(
          file.buffer,
          `disputes/${bookingId}/${Date.now()}_${file.originalname}`,
          file.mimetype
        );

        // Simpan attachment
        await prisma.disputeAttachment.create({
          data: {
            disputeId: dispute.id,
            fileUrl: uploadResult.url,
            fileName: file.originalname,
            fileType: fileType
          }
        });
      }
    }

    // Kirim notifikasi ke pihak lain yang terlibat
    const otherUserId = booking.customerId === userId ? booking.providerId : booking.customerId;
    
    await sendNotification(
      otherUserId,
      'Dispute Dibuat',
      `Dispute telah dibuat untuk booking #${booking.bookingNumber}: ${title}`,
      'dispute',
      { bookingId, disputeId: dispute.id }
    );

    // Kirim notifikasi ke admin
    const admins = await prisma.user.findMany({
      where: {
        role: 'ADMIN',
        admin: {
          adminRole: 'SUPPORT'
        }
      }
    });

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
      data: dispute
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get dispute by booking ID
 */
export const getDisputeByBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user!.id;

    // Validasi booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
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

    // Get dispute
    const dispute = await prisma.dispute.findUnique({
      where: { bookingId },
      include: {
        booking: true,
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            customer: {
              select: {
                fullName: true,
                avatarUrl: true
              }
            },
            provider: {
              select: {
                fullName: true,
                businessName: true,
                avatarUrl: true
              }
            }
          }
        },
        admin: {
          select: {
            id: true,
            email: true,
            admin: {
              select: {
                fullName: true,
                adminRole: true
              }
            }
          }
        },
        attachments: true
      }
    });

    if (!dispute) {
      return next(new AppError('Dispute tidak ditemukan', 404));
    }

    res.status(200).json({
      success: true,
      data: dispute
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all disputes (admin)
 */
export const getAllDisputes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Hanya admin yang boleh mengakses semua dispute
    if (req.user!.role !== 'ADMIN') {
      return next(new AppError('Hanya admin yang dapat mengakses semua dispute', 403));
    }

    // Siapkan filter
    const filter: any = {};
    if (status) {
      filter.status = status;
    }

    // Get disputes
    const disputes = await prisma.dispute.findMany({
      where: filter,
      include: {
        booking: {
          select: {
            bookingNumber: true,
            totalAmount: true,
            status: true
          }
        },
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            customer: {
              select: {
                fullName: true
              }
            },
            provider: {
              select: {
                fullName: true,
                businessName: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: Number(limit)
    });

    // Hitung total
    const total = await prisma.dispute.count({
      where: filter
    });

    res.status(200).json({
      success: true,
      data: {
        disputes,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get disputes by user ID
 */
export const getUserDisputes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Siapkan filter
    const filter: any = {};
    
    // Cek role user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return next(new AppError('User tidak ditemukan', 404));
    }

    // Get disputes sesuai role
    let bookingFilter = {};
    
    if (user.role === 'CUSTOMER') {
      bookingFilter = {
        customerId: userId
      };
    } else if (user.role === 'PROVIDER') {
      bookingFilter = {
        providerId: userId
      };
    }

    if (status) {
      filter.status = status;
    }

    // Get disputes
    const disputes = await prisma.dispute.findMany({
      where: {
        ...filter,
        booking: bookingFilter
      },
      include: {
        booking: {
          select: {
            bookingNumber: true,
            totalAmount: true,
            status: true,
            bookingDate: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: Number(limit)
    });

    // Hitung total
    const total = await prisma.dispute.count({
      where: {
        ...filter,
        booking: bookingFilter
      }
    });

    res.status(200).json({
      success: true,
      data: {
        disputes,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Resolve dispute (admin)
 */
export const resolveDispute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { disputeId } = req.params;
    const { resolution, status, refundAmount } = req.body;
    const adminId = req.user!.id;

    // Hanya admin yang boleh menyelesaikan dispute
    if (req.user!.role !== 'ADMIN') {
      return next(new AppError('Hanya admin yang dapat menyelesaikan dispute', 403));
    }

    // Validasi status
    const validStatuses = [
      'RESOLVED_REFUND',
      'RESOLVED_RELEASE',
      'RESOLVED_PARTIAL',
      'REJECTED'
    ];
    
    if (!validStatuses.includes(status)) {
      return next(new AppError('Status tidak valid', 400));
    }

    // Validasi dispute
    const dispute = await prisma.dispute.findUnique({
      where: { id: disputeId },
      include: {
        booking: {
          include: {
            payment: true
          }
        }
      }
    });

    if (!dispute) {
      return next(new AppError('Dispute tidak ditemukan', 404));
    }

    // Cek apakah dispute masih dalam status PENDING atau IN_REVIEW
    if (dispute.status !== 'PENDING' && dispute.status !== 'IN_REVIEW') {
      return next(new AppError('Dispute ini sudah diselesaikan', 400));
    }

    // Selesaikan dispute dengan transaction
    await prisma.$transaction(async (prisma) => {
      // 1. Update dispute
      await prisma.dispute.update({
        where: { id: disputeId },
        data: {
          status: status as any,
          resolution,
          adminId,
          resolvedAt: new Date()
        }
      });

      // 2. Process refund if needed
      if (status === 'RESOLVED_REFUND' || status === 'RESOLVED_PARTIAL') {
        // Validasi jumlah refund
        if (status === 'RESOLVED_PARTIAL' && !refundAmount) {
          throw new AppError('Jumlah refund harus ditentukan untuk partial refund', 400);
        }

        const payment = dispute.booking.payment;
        if (!payment) {
          throw new AppError('Payment tidak ditemukan', 404);
        }

        // Hanya payment dengan status ESCROW yang dapat direfund
        if (payment.status !== 'ESCROW') {
          throw new AppError('Hanya payment dengan status ESCROW yang dapat direfund', 400);
        }

        // Tentukan jumlah refund
        const amountToRefund = status === 'RESOLVED_REFUND'
          ? payment.amount // Full refund
          : Number(refundAmount); // Partial refund

        // Validasi jumlah refund untuk partial
        if (status === 'RESOLVED_PARTIAL' && (amountToRefund <= 0 || amountToRefund >= payment.amount)) {
          throw new AppError('Jumlah partial refund tidak valid', 400);
        }

        // Update payment
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'REFUNDED',
            refundAmount: amountToRefund,
            refundReason: resolution,
            refundDate: new Date()
          }
        });

        // Catat transaksi refund
        await prisma.transaction.create({
          data: {
            paymentId: payment.id,
            userId: dispute.booking.customerId,
            transactionType: 'REFUND',
            amount: amountToRefund,
            status: 'SUCCESS',
            description: `Refund karena dispute: ${resolution}`
          }
        });

        // Jika partial refund, release sisa dana ke provider
        if (status === 'RESOLVED_PARTIAL') {
          const remainingAmount = payment.amount - amountToRefund;
          const netAmount = remainingAmount - (remainingAmount * 0.1); // Platform fee 10%

          // Tambahkan ke wallet provider
          const providerWallet = await prisma.wallet.findFirst({
            where: { userId: dispute.booking.providerId }
          });

          if (providerWallet) {
            await prisma.wallet.update({
              where: { id: providerWallet.id },
              data: {
                balance: { increment: netAmount }
              }
            });
          } else {
            await prisma.wallet.create({
              data: {
                userId: dispute.booking.providerId,
                balance: netAmount
              }
            });
          }

          // Catat transaksi
          await prisma.transaction.create({
            data: {
              paymentId: payment.id,
              userId: dispute.booking.providerId,
              transactionType: 'ESCROW_OUT',
              amount: netAmount,
              status: 'SUCCESS',
              description: `Dana dari partial refund untuk booking #${dispute.booking.bookingNumber}`
            }
          });
        }
      }
      // 3. Release escrow to provider if needed
      else if (status === 'RESOLVED_RELEASE') {
        const payment = dispute.booking.payment;
        if (!payment) {
          throw new AppError('Payment tidak ditemukan', 404);
        }

        // Hanya payment dengan status ESCROW yang dapat direlease
        if (payment.status !== 'ESCROW') {
          throw new AppError('Hanya payment dengan status ESCROW yang dapat direlease', 400);
        }

        // Update payment
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'COMPLETED',
            releaseDate: new Date()
          }
        });

        // Hitung jumlah yang diterima provider (setelah dipotong platform fee)
        const netAmount = payment.amount - payment.platformFee;
        
        // Tambahkan ke wallet provider
        const providerWallet = await prisma.wallet.findFirst({
          where: { userId: dispute.booking.providerId }
        });

        if (providerWallet) {
          await prisma.wallet.update({
            where: { id: providerWallet.id },
            data: {
              balance: { increment: netAmount }
            }
          });
        } else {
          await prisma.wallet.create({
            data: {
              userId: dispute.booking.providerId,
              balance: netAmount
            }
          });
        }

        // Catat transaksi
        await prisma.transaction.create({
          data: {
            paymentId: payment.id,
            userId: dispute.booking.providerId,
            transactionType: 'ESCROW_OUT',
            amount: netAmount,
            status: 'SUCCESS',
            description: `Dana dari escrow untuk booking #${dispute.booking.bookingNumber}`
          }
        });
      }
    });

    // Kirim notifikasi ke customer dan provider
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
        resolvedAt: new Date()
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add dispute attachment
 */
export const addDisputeAttachment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { disputeId } = req.params;
    const userId = req.user!.id;

    // Validasi dispute
    const dispute = await prisma.dispute.findUnique({
      where: { id: disputeId },
      include: {
        booking: true
      }
    });

    if (!dispute) {
      return next(new AppError('Dispute tidak ditemukan', 404));
    }

    // Cek apakah user terlibat dalam booking ini atau admin
    const isInvolved = dispute.booking.customerId === userId || dispute.booking.providerId === userId;
    const isAdmin = req.user!.role === 'ADMIN';

    if (!isInvolved && !isAdmin) {
      return next(new AppError('Anda tidak berhak menambahkan attachment ke dispute ini', 403));
    }

    // Cek apakah dispute masih dalam status PENDING atau IN_REVIEW
    if (dispute.status !== 'PENDING' && dispute.status !== 'IN_REVIEW') {
      return next(new AppError('Tidak dapat menambahkan attachment ke dispute yang sudah diselesaikan', 400));
    }

    // Handle file jika ada
    if (!req.file) {
      return next(new AppError('File tidak ditemukan', 400));
    }

    const file = req.file;
    const fileType = getFileType(file.mimetype);
    
    if (!fileType) {
      return next(new AppError('Format file tidak didukung', 400));
    }
    
    // Upload file ke cloud storage
    const uploadResult = await uploadFileToStorage(
      file.buffer,
      `disputes/${dispute.bookingId}/${Date.now()}_${file.originalname}`,
      file.mimetype
    );

    // Simpan attachment
    const attachment = await prisma.disputeAttachment.create({
      data: {
        disputeId,
        fileUrl: uploadResult.url,
        fileName: file.originalname,
        fileType
      }
    });

    res.status(201).json({
      success: true,
      message: 'Attachment berhasil ditambahkan',
      data: attachment
    });
  } catch (error) {
    next(error);
  }
};

// Model for dispute attachment (akan ditambahkan ke schema.prisma)
// model DisputeAttachment {
//   id        String   @id @default(uuid())
//   disputeId String
//   fileUrl   String
//   fileName  String
//   fileType  String
//   createdAt DateTime @default(now())
//
//   dispute   Dispute  @relation(fields: [disputeId], references: [id], onDelete: Cascade)
// } 