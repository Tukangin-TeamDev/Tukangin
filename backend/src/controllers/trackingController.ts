import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { AppError } from '../middleware/errorHandler';
import { sendNotification } from '../services/notificationService';
import { calculateETA } from '../utils/locationHelpers';
import logger from '../utils/logger';

/**
 * Update provider's location during EN_ROUTE status
 */
export const updateProviderLocation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookingId } = req.params;
    const { latitude, longitude } = req.body;
    const userId = req.user!.id;

    // Validasi booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        provider: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!booking) {
      return next(new AppError('Booking tidak ditemukan', 404));
    }

    // Pastikan user adalah provider dari booking ini
    if (booking.provider.userId !== userId) {
      return next(new AppError('Anda tidak memiliki akses untuk memperbarui lokasi', 403));
    }

    // Pastikan booking dalam status EN_ROUTE
    if (booking.status !== 'EN_ROUTE') {
      return next(new AppError('Update lokasi hanya dapat dilakukan saat status EN_ROUTE', 400));
    }

    // Simpan update lokasi
    const statusUpdate = await prisma.statusUpdate.create({
      data: {
        bookingId,
        status: 'LOCATION_UPDATE',
        latitude,
        longitude,
        notes: 'Provider updated location',
      },
    });

    // Hitung ETA baru
    const customerCoords = {
      latitude: booking.latitude,
      longitude: booking.longitude,
    };

    const providerCoords = {
      latitude,
      longitude,
    };

    const eta = calculateETA(providerCoords, customerCoords);

    // Update ETA di booking jika berubah signifikan
    if (Math.abs(eta.getTime() - (booking.estimatedArrival?.getTime() || 0)) > 5 * 60 * 1000) {
      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          estimatedArrival: eta,
        },
      });

      // Notifikasi customer tentang perubahan ETA
      await sendNotification(
        booking.customerId,
        'ETA Diperbarui',
        `Perkiraan kedatangan provider telah diperbarui menjadi ${eta.toLocaleTimeString('id-ID')}`,
        'booking',
        { bookingId: booking.id }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Lokasi berhasil diperbarui',
      data: {
        id: statusUpdate.id,
        latitude,
        longitude,
        estimatedArrival: eta,
      },
    });
  } catch (error) {
    logger.error('Update provider location error:', error);
    next(error);
  }
};

/**
 * Get live tracking data for a booking
 */
export const getTrackingData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user!.id;

    // Validasi booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        provider: {
          select: {
            userId: true,
            fullName: true,
          },
        },
        customer: {
          select: {
            userId: true,
          },
        },
        statusUpdates: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          where: {
            status: 'LOCATION_UPDATE',
          },
        },
      },
    });

    if (!booking) {
      return next(new AppError('Booking tidak ditemukan', 404));
    }

    // Pastikan user adalah customer atau provider dari booking ini
    if (booking.customer.userId !== userId && booking.provider.userId !== userId) {
      return next(new AppError('Anda tidak memiliki akses untuk melihat tracking', 403));
    }

    // Pastikan booking dalam status EN_ROUTE
    if (booking.status !== 'EN_ROUTE') {
      return next(new AppError('Tracking hanya tersedia saat status EN_ROUTE', 400));
    }

    // Ambil lokasi terakhir provider
    const lastLocation = booking.statusUpdates.length > 0 ? booking.statusUpdates[0] : null;

    res.status(200).json({
      success: true,
      data: {
        bookingId,
        status: booking.status,
        estimatedArrival: booking.estimatedArrival,
        customerLocation: {
          latitude: booking.latitude,
          longitude: booking.longitude,
          address: booking.address,
        },
        providerLocation: lastLocation
          ? {
              latitude: lastLocation.latitude,
              longitude: lastLocation.longitude,
              updatedAt: lastLocation.createdAt,
            }
          : null,
      },
    });
  } catch (error) {
    logger.error('Get tracking data error:', error);
    next(error);
  }
};
