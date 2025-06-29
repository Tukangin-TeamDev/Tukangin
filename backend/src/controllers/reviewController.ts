import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { AppError } from '../middleware/errorHandler';
import { sendNotification } from '../services/notificationService';
import logger from '../utils/logger';

/**
 * Create review
 */
export const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookingId, rating, comment } = req.body;
    const userId = req.user!.id;

    // Validasi rating
    if (rating < 1 || rating > 5) {
      return next(new AppError('Rating harus antara 1-5', 400));
    }

    // Validasi booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return next(new AppError('Booking tidak ditemukan', 404));
    }

    // Cek apakah booking sudah selesai
    if (booking.status !== 'COMPLETED') {
      return next(new AppError('Booking harus selesai untuk dapat direview', 400));
    }

    // Cek apakah user adalah customer dari booking ini
    if (booking.customerId !== userId) {
      return next(new AppError('Hanya customer yang dapat memberikan review', 403));
    }

    // Cek apakah sudah ada review untuk booking ini
    const existingReview = await prisma.review.findFirst({
      where: { bookingId },
    });

    if (existingReview) {
      return next(new AppError('Review untuk booking ini sudah ada', 400));
    }

    // Buat review dengan transaction
    const review = await prisma.$transaction(async (prisma) => {
      // 1. Buat review
      const newReview = await prisma.review.create({
        data: {
          bookingId,
          customerId: userId,
          providerId: booking.providerId,
          rating,
          comment,
        },
      });

      // 2. Update provider average rating and total reviews
      const serviceProvider = await prisma.serviceProvider.findUnique({
        where: { userId: booking.providerId },
      });

      if (serviceProvider) {
        // Get all reviews for this provider
        const providerReviews = await prisma.review.findMany({
          where: {
            providerId: booking.providerId,
          },
        });

        // Calculate new average rating
        const totalRating = providerReviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / providerReviews.length;

        // Update provider
        await prisma.serviceProvider.update({
          where: { id: serviceProvider.id },
          data: {
            rating: averageRating,
            totalReviews: providerReviews.length,
          },
        });
      }

      return newReview;
    });

    // Kirim notifikasi ke provider
    await sendNotification(
      booking.providerId,
      'Review Baru',
      `Anda mendapatkan rating ${rating} bintang untuk booking #${booking.bookingNumber}`,
      'review',
      { bookingId, reviewId: review.id }
    );

    res.status(201).json({
      success: true,
      message: 'Review berhasil dibuat',
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get review by booking ID
 */
export const getReviewByBooking = async (req: Request, res: Response, next: NextFunction) => {
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
      return next(new AppError('Anda tidak berhak melihat review ini', 403));
    }

    // Get review
    const review = await prisma.review.findFirst({
      where: { bookingId },
      include: {
        customer: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            user: {
              select: {
                email: true,
              },
            },
          },
        },
        provider: {
          select: {
            id: true,
            fullName: true,
            businessName: true,
            avatarUrl: true,
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });

    if (!review) {
      return next(new AppError('Review tidak ditemukan', 404));
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get reviews by provider ID
 */
export const getProviderReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { providerId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Validasi provider
    const provider = await prisma.user.findFirst({
      where: {
        id: providerId,
        role: 'PROVIDER',
      },
    });

    if (!provider) {
      return next(new AppError('Provider tidak ditemukan', 404));
    }

    // Get reviews
    const reviews = await prisma.review.findMany({
      where: {
        providerId: providerId,
      },
      include: {
        booking: {
          select: {
            bookingNumber: true,
            createdAt: true,
          },
        },
        customer: {
          select: {
            fullName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: Number(limit),
    });

    // Hitung total
    const total = await prisma.review.count({
      where: { providerId: providerId },
    });

    // Hitung rata-rata rating
    const ratingData = await prisma.review.aggregate({
      where: { providerId: providerId },
      _avg: { rating: true },
      _count: true,
    });

    res.status(200).json({
      success: true,
      data: {
        reviews,
        stats: {
          averageRating: ratingData._avg.rating || 0,
          totalReviews: ratingData._count,
        },
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
 * Respond to review (provider)
 */
export const respondToReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reviewId } = req.params;
    const { response } = req.body;
    const userId = req.user!.id;

    // Validasi review
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        booking: true,
      },
    });

    if (!review) {
      return next(new AppError('Review tidak ditemukan', 404));
    }

    // Cek apakah user adalah provider yang direview
    if (review.providerId !== userId) {
      return next(
        new AppError('Hanya provider yang direview yang dapat memberikan tanggapan', 403)
      );
    }

    // Cek apakah sudah ada tanggapan
    if (review.response) {
      return next(new AppError('Tanggapan sudah ada, silakan edit tanggapan', 400));
    }

    // Update review
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        response,
      },
    });

    // Kirim notifikasi ke customer
    await sendNotification(
      review.customerId,
      'Tanggapan Review',
      `Provider telah menanggapi review Anda untuk booking #${review.booking.bookingNumber}`,
      'review_response',
      { reviewId, bookingId: review.bookingId }
    );

    res.status(200).json({
      success: true,
      message: 'Tanggapan berhasil ditambahkan',
      data: updatedReview,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Report review (for inappropriate content)
 */
export const reportReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reviewId } = req.params;
    const { reason } = req.body;
    const userId = req.user!.id;

    // Validasi review
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        booking: true,
        customer: {
          select: {
            fullName: true,
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });

    if (!review) {
      return next(new AppError('Review tidak ditemukan', 404));
    }

    // Cek apakah user adalah provider yang direview
    if (review.providerId !== userId && req.user!.role !== 'ADMIN') {
      return next(new AppError('Anda tidak berhak melaporkan review ini', 403));
    }

    // Get admins
    const admins = await prisma.user.findMany({
      where: {
        role: 'ADMIN',
      },
    });

    // Kirim notifikasi ke admin
    for (const admin of admins) {
      await sendNotification(
        admin.id,
        'Laporan Review',
        `Review untuk booking #${review.booking.bookingNumber} dilaporkan: ${reason}`,
        'review_report',
        {
          reviewId,
          bookingId: review.bookingId,
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

/**
 * Delete review (admin only)
 */
export const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reviewId } = req.params;
    const { reason } = req.body;

    // Hanya admin yang boleh menghapus review
    if (req.user!.role !== 'ADMIN') {
      return next(new AppError('Hanya admin yang dapat menghapus review', 403));
    }

    // Validasi review
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        booking: true,
      },
    });

    if (!review) {
      return next(new AppError('Review tidak ditemukan', 404));
    }

    // Hapus review dengan transaction
    await prisma.$transaction(async (prisma) => {
      // 1. Hapus review
      await prisma.review.delete({
        where: { id: reviewId },
      });

      // 2. Update provider average rating
      const serviceProvider = await prisma.serviceProvider.findUnique({
        where: { userId: review.providerId },
      });

      if (serviceProvider) {
        // Get all remaining reviews for this provider
        const providerReviews = await prisma.review.findMany({
          where: {
            providerId: review.providerId,
          },
        });

        // Calculate new average rating
        let averageRating = 0;
        if (providerReviews.length > 0) {
          const totalRating = providerReviews.reduce((sum, review) => sum + review.rating, 0);
          averageRating = totalRating / providerReviews.length;
        }

        // Update provider
        await prisma.serviceProvider.update({
          where: { id: serviceProvider.id },
          data: {
            rating: averageRating,
            totalReviews: providerReviews.length,
          },
        });
      }
    });

    // Kirim notifikasi ke customer dan provider
    await sendNotification(
      review.customerId,
      'Review Dihapus',
      `Review Anda untuk booking #${review.booking.bookingNumber} telah dihapus oleh admin: ${reason}`,
      'review_deleted',
      { bookingId: review.bookingId }
    );

    await sendNotification(
      review.providerId,
      'Review Dihapus',
      `Review untuk booking #${review.booking.bookingNumber} telah dihapus oleh admin: ${reason}`,
      'review_deleted',
      { bookingId: review.bookingId }
    );

    res.status(200).json({
      success: true,
      message: 'Review berhasil dihapus',
    });
  } catch (error) {
    next(error);
  }
};