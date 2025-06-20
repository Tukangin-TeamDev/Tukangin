import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../config/prisma';
import { AppError } from '../middleware/errorHandler';
import { generateBookingNumber } from '../utils/generators';
import { calculateDistance } from '../utils/locationHelpers';
import { sendNotification } from '../services/notificationService';
import logger from '../utils/logger';

/**
 * Create a new booking
 */
export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { providerId, services, notes, scheduledDate, locationAddress, locationCoordinates } =
      req.body;

    // Pastikan user adalah customer
    const customerId = req.user!.id;
    const customer = await prisma.user.findUnique({
      where: { id: customerId },
      include: { customer: true },
    });

    if (!customer || customer.role !== 'CUSTOMER') {
      return next(new AppError('Hanya customer yang dapat membuat booking', 403));
    }

    // Validasi provider
    const provider = await prisma.user.findFirst({
      where: {
        id: providerId,
        role: 'PROVIDER',
        isActive: true,
      },
      include: {
        serviceProvider: true,
      },
    });

    if (!provider || !provider.serviceProvider) {
      return next(new AppError('Provider tidak ditemukan', 404));
    }

    // Cek availability provider
    if (!provider.serviceProvider.isAvailable) {
      return next(new AppError('Provider sedang tidak tersedia', 400));
    }

    // Validasi services yang dipilih
    if (!services || !Array.isArray(services) || services.length === 0) {
      return next(new AppError('Pilih minimal satu layanan', 400));
    }

    // Ambil data service yang dipilih
    const serviceIds = services.map(s => s.serviceId);
    const availableServices = await prisma.service.findMany({
      where: {
        id: { in: serviceIds },
        providerId: provider.serviceProvider.id,
        isActive: true,
      },
    });

    if (availableServices.length !== serviceIds.length) {
      return next(new AppError('Beberapa layanan tidak tersedia', 400));
    }

    // Calculate total amount
    let totalAmount = 0;
    const bookingItems = [];

    for (const serviceItem of services) {
      const service = availableServices.find(s => s.id === serviceItem.serviceId);
      if (!service) {
        return next(
          new AppError(`Layanan dengan ID ${serviceItem.serviceId} tidak ditemukan`, 400)
        );
      }

      const quantity = serviceItem.quantity || 1;
      if (quantity < service.minimumOrder) {
        return next(
          new AppError(`Minimal order untuk ${service.name} adalah ${service.minimumOrder}`, 400)
        );
      }

      const itemTotalPrice = service.price * quantity;
      totalAmount += itemTotalPrice;

      bookingItems.push({
        serviceId: service.id,
        quantity: quantity,
        unitPrice: service.price,
        totalPrice: itemTotalPrice,
        notes: serviceItem.notes,
      });
    }

    // Perhitungan estimated arrival jika koordinat lokasi diberikan
    let estimatedArrival = null;
    if (
      locationCoordinates &&
      provider.serviceProvider.latitude &&
      provider.serviceProvider.longitude
    ) {
      const customerCoords = locationCoordinates.split(',').map(Number);
      const providerCoords = [
        provider.serviceProvider.latitude,
        provider.serviceProvider.longitude,
      ];

      // Hitung estimasi waktu berdasarkan jarak dan kecepatan rata-rata
      if (customerCoords.length === 2 && providerCoords.length === 2) {
        const distance = calculateDistance(
          customerCoords[0],
          customerCoords[1],
          providerCoords[0],
          providerCoords[1]
        );

        // Asumsi kecepatan rata-rata 30 km/jam
        const estimatedTravelTimeMs = (distance / 30) * 60 * 60 * 1000;
        estimatedArrival = new Date(Date.now() + estimatedTravelTimeMs);
      }
    }

    // Generate booking number
    const bookingNumber = generateBookingNumber();

    // Create booking with transaction
    const booking = await prisma.$transaction(async prisma => {
      // 1. Buat booking
      const newBooking = await prisma.booking.create({
        data: {
          bookingNumber,
          customerId,
          providerId,
          totalAmount,
          notes,
          scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
          locationAddress,
          locationCoordinates,
          estimatedArrival,
          bookingItems: {
            createMany: {
              data: bookingItems,
            },
          },
        },
        include: {
          bookingItems: true,
        },
      });

      // 2. Buat payment record dengan status PENDING
      const paymentNumber = `PAY-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${Math.floor(10000 + Math.random() * 90000)}`;

      // Platform fee adalah 10% dari total amount
      const platformFee = totalAmount * 0.1;

      await prisma.payment.create({
        data: {
          bookingId: newBooking.id,
          paymentNumber,
          amount: totalAmount,
          platformFee,
          status: 'PENDING',
        },
      });

      return newBooking;
    });

    // Kirim notifikasi ke provider
    await sendNotification(
      providerId,
      'Pesanan Baru',
      `Anda memiliki pesanan baru dengan nomor ${bookingNumber}`,
      'booking',
      { bookingId: booking.id }
    );

    // Kirim response
    res.status(201).json({
      success: true,
      message: 'Booking berhasil dibuat',
      data: {
        id: booking.id,
        bookingNumber: booking.bookingNumber,
        totalAmount,
        estimatedArrival,
        status: booking.status,
      },
    });
  } catch (error) {
    logger.error('Create booking error:', error);
    next(error);
  }
};

/**
 * Get booking details
 */
export const getBookingDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user!.id;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        bookingItems: {
          include: {
            service: true,
          },
        },
        customer: {
          select: {
            id: true,
            email: true,
            customer: {
              select: {
                fullName: true,
                avatarUrl: true,
              },
            },
          },
        },
        provider: {
          select: {
            id: true,
            email: true,
            provider: {
              select: {
                fullName: true,
                businessName: true,
                avatarUrl: true,
                isVerified: true,
              },
            },
          },
        },
        payment: true,
        trackingUpdates: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!booking) {
      return next(new AppError('Booking tidak ditemukan', 404));
    }

    // Cek apakah user adalah customer, provider, atau admin
    const isCustomer = booking.customerId === userId;
    const isProvider = booking.providerId === userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    const isAdmin = user?.role === 'ADMIN';

    if (!isCustomer && !isProvider && !isAdmin) {
      return next(new AppError('Anda tidak berhak mengakses booking ini', 403));
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all bookings for user
 */
export const getUserBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Cek role user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return next(new AppError('User tidak ditemukan', 404));
    }

    // Siapkan filter berdasarkan role dan status
    const filter: any = {};

    if (user.role === 'CUSTOMER') {
      filter.customerId = userId;
    } else if (user.role === 'PROVIDER') {
      filter.providerId = userId;
    } else {
      // Admin dapat melihat semua booking
    }

    if (status) {
      filter.status = status;
    }

    // Ambil booking
    const bookings = await prisma.booking.findMany({
      where: filter,
      include: {
        customer: {
          select: {
            id: true,
            email: true,
            customer: {
              select: {
                fullName: true,
                avatarUrl: true,
              },
            },
          },
        },
        provider: {
          select: {
            id: true,
            email: true,
            provider: {
              select: {
                fullName: true,
                businessName: true,
                avatarUrl: true,
              },
            },
          },
        },
        payment: {
          select: {
            status: true,
            amount: true,
          },
        },
      },
      orderBy: {
        bookingDate: 'desc',
      },
      skip,
      take: Number(limit),
    });

    // Hitung total
    const total = await prisma.booking.count({
      where: filter,
    });

    res.status(200).json({
      success: true,
      data: bookings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update booking status (provider)
 */
export const updateBookingStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookingId } = req.params;
    const { status, location, notes } = req.body;
    const userId = req.user!.id;

    // Validasi booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        payment: true,
      },
    });

    if (!booking) {
      return next(new AppError('Booking tidak ditemukan', 404));
    }

    // Cek apakah user adalah provider dari booking ini atau admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const isProvider = booking.providerId === userId;
    const isAdmin = user?.role === 'ADMIN';
    const isCustomer = booking.customerId === userId;

    if (!isProvider && !isAdmin && !isCustomer) {
      return next(new AppError('Anda tidak berhak mengubah status booking ini', 403));
    }

    // Validasi transisi status
    let isValidTransition = false;
    const currentStatus = booking.status;

    // Provider only transitions
    if (isProvider) {
      if (
        (currentStatus === 'PENDING' && status === 'ACCEPTED') ||
        (currentStatus === 'PENDING' && status === 'DECLINED') ||
        (currentStatus === 'ACCEPTED' && status === 'EN_ROUTE') ||
        (currentStatus === 'EN_ROUTE' && status === 'ON_SITE') ||
        (currentStatus === 'ON_SITE' && status === 'IN_PROGRESS') ||
        (currentStatus === 'IN_PROGRESS' && status === 'COMPLETED')
      ) {
        isValidTransition = true;
      }
    }

    // Customer only transitions
    if (isCustomer) {
      if (
        (currentStatus === 'PENDING' && status === 'CANCELLED') ||
        (currentStatus === 'ACCEPTED' && status === 'CANCELLED') ||
        (currentStatus === 'COMPLETED' && status === 'REVIEWED')
      ) {
        isValidTransition = true;
      }
    }

    // Admin can make any transition
    if (isAdmin) {
      isValidTransition = true;
    }

    if (!isValidTransition) {
      return next(
        new AppError(`Tidak dapat mengubah status dari ${currentStatus} ke ${status}`, 400)
      );
    }

    // Update booking dengan transaction
    const updatedBooking = await prisma.$transaction(async prisma => {
      // 1. Update booking status
      const updated = await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: status as any,
        },
      });

      // 2. Tambah tracking update
      await prisma.trackingUpdate.create({
        data: {
          bookingId,
          status: status as any,
          location,
          notes,
        },
      });

      // 3. Jika status menjadi COMPLETED, catat waktu penyelesaian
      if (status === 'COMPLETED') {
        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            completionTime: new Date(),
          },
        });
      }

      // 4. Jika status menjadi ON_SITE, catat waktu kedatangan actual
      if (status === 'ON_SITE') {
        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            actualArrival: new Date(),
          },
        });
      }

      // 5. Update payment status jika perlu
      if (status === 'COMPLETED' && booking.payment?.status === 'ESCROW') {
        await prisma.payment.update({
          where: { bookingId },
          data: {
            status: 'COMPLETED',
            releaseDate: new Date(),
          },
        });

        // Hitung jumlah yang diterima provider (setelah dipotong platform fee)
        const netAmount = booking.payment.amount - booking.payment.platformFee;

        // Tambahkan ke wallet provider
        const providerWallet = await prisma.wallet.findFirst({
          where: { userId: booking.providerId },
        });

        if (providerWallet) {
          await prisma.wallet.update({
            where: { id: providerWallet.id },
            data: {
              balance: { increment: netAmount },
            },
          });
        } else {
          await prisma.wallet.create({
            data: {
              userId: booking.providerId,
              balance: netAmount,
            },
          });
        }

        // Catat transaksi
        await prisma.transaction.create({
          data: {
            paymentId: booking.payment.id,
            userId: booking.providerId,
            transactionType: 'ESCROW_OUT',
            amount: netAmount,
            status: 'SUCCESS',
            description: `Dana dari escrow untuk booking #${booking.bookingNumber}`,
          },
        });
      }

      return updated;
    });

    // Kirim notifikasi
    let notificationTitle = '';
    let notificationMessage = '';
    let recipientId = '';

    if (status === 'ACCEPTED') {
      notificationTitle = 'Booking Diterima';
      notificationMessage = `Booking #${booking.bookingNumber} telah diterima oleh provider`;
      recipientId = booking.customerId;
    } else if (status === 'DECLINED') {
      notificationTitle = 'Booking Ditolak';
      notificationMessage = `Booking #${booking.bookingNumber} ditolak oleh provider`;
      recipientId = booking.customerId;
    } else if (status === 'EN_ROUTE') {
      notificationTitle = 'Provider dalam Perjalanan';
      notificationMessage = `Provider sedang dalam perjalanan ke lokasi Anda`;
      recipientId = booking.customerId;
    } else if (status === 'ON_SITE') {
      notificationTitle = 'Provider Tiba';
      notificationMessage = `Provider telah tiba di lokasi Anda`;
      recipientId = booking.customerId;
    } else if (status === 'COMPLETED') {
      notificationTitle = 'Layanan Selesai';
      notificationMessage = `Layanan untuk booking #${booking.bookingNumber} telah selesai`;
      recipientId = booking.customerId;
    } else if (status === 'CANCELLED') {
      notificationTitle = 'Booking Dibatalkan';
      notificationMessage = `Booking #${booking.bookingNumber} telah dibatalkan`;
      recipientId = booking.providerId;
    }

    if (notificationTitle && recipientId) {
      await sendNotification(
        recipientId,
        notificationTitle,
        notificationMessage,
        'booking_status',
        { bookingId }
      );
    }

    res.status(200).json({
      success: true,
      message: `Status booking berhasil diubah menjadi ${status}`,
      data: {
        id: updatedBooking.id,
        status: updatedBooking.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel booking (customer)
 */
export const cancelBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookingId } = req.params;
    const { reason } = req.body;
    const userId = req.user!.id;

    // Validasi booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        payment: true,
      },
    });

    if (!booking) {
      return next(new AppError('Booking tidak ditemukan', 404));
    }

    // Cek apakah user adalah customer dari booking ini atau admin
    if (booking.customerId !== userId && req.user!.role !== 'ADMIN') {
      return next(new AppError('Anda tidak berhak membatalkan booking ini', 403));
    }

    // Cek apakah booking masih dapat dibatalkan
    if (booking.status !== 'PENDING' && booking.status !== 'ACCEPTED') {
      return next(new AppError('Booking ini tidak dapat dibatalkan', 400));
    }

    // Hitung cancellation fee jika ada
    let cancellationFee = 0;
    if (booking.status === 'ACCEPTED') {
      // Cancellation fee 5% dari total amount jika sudah diterima provider
      cancellationFee = booking.totalAmount * 0.05;
    }

    // Update booking dengan transaction
    const cancelledBooking = await prisma.$transaction(async prisma => {
      // 1. Update booking status
      const updated = await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: 'CANCELLED',
          cancellationReason: reason,
          cancellationFee,
        },
      });

      // 2. Tambah tracking update
      await prisma.trackingUpdate.create({
        data: {
          bookingId,
          status: 'CANCELLED',
          notes: reason,
        },
      });

      // 3. Update payment status jika perlu
      if (booking.payment) {
        if (booking.payment.status === 'ESCROW') {
          // Refund dengan potongan cancellation fee
          const refundAmount = booking.payment.amount - cancellationFee;

          await prisma.payment.update({
            where: { id: booking.payment.id },
            data: {
              status: 'REFUNDED',
              refundAmount,
              refundReason: 'Booking dibatalkan oleh customer',
              refundDate: new Date(),
            },
          });

          // Catat transaksi refund
          await prisma.transaction.create({
            data: {
              paymentId: booking.payment.id,
              userId: booking.customerId,
              transactionType: 'REFUND',
              amount: refundAmount,
              status: 'SUCCESS',
              description: `Refund untuk pembatalan booking #${booking.bookingNumber}`,
            },
          });
        } else if (booking.payment.status === 'PENDING') {
          await prisma.payment.update({
            where: { id: booking.payment.id },
            data: {
              status: 'FAILED',
            },
          });
        }
      }

      return updated;
    });

    // Kirim notifikasi ke provider
    await sendNotification(
      booking.providerId,
      'Booking Dibatalkan',
      `Booking #${booking.bookingNumber} telah dibatalkan oleh customer`,
      'booking_status',
      { bookingId }
    );

    res.status(200).json({
      success: true,
      message: 'Booking berhasil dibatalkan',
      data: {
        id: cancelledBooking.id,
        status: cancelledBooking.status,
        cancellationFee,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create on-site requote (provider)
 */
export const createRequote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookingId } = req.params;
    const { newAmount, reason } = req.body;
    const userId = req.user!.id;

    // Validasi booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return next(new AppError('Booking tidak ditemukan', 404));
    }

    // Cek apakah user adalah provider dari booking ini atau admin
    if (booking.providerId !== userId && req.user!.role !== 'ADMIN') {
      return next(new AppError('Anda tidak berhak membuat requote untuk booking ini', 403));
    }

    // Cek status booking harus ON_SITE
    if (booking.status !== 'ON_SITE') {
      return next(new AppError('Requote hanya dapat dibuat ketika status booking ON_SITE', 400));
    }

    // Validasi jumlah baru
    if (newAmount <= 0 || newAmount <= booking.totalAmount) {
      return next(new AppError('Jumlah baru harus lebih besar dari jumlah awal', 400));
    }

    // Buat requote
    const requote = await prisma.requote.create({
      data: {
        bookingId,
        originalAmount: booking.totalAmount,
        newAmount,
        reason,
      },
    });

    // Kirim notifikasi ke customer
    await sendNotification(
      booking.customerId,
      'Permintaan Perubahan Harga',
      `Provider mengajukan perubahan harga untuk booking #${booking.bookingNumber}`,
      'requote',
      { bookingId, requoteId: requote.id }
    );

    res.status(201).json({
      success: true,
      message: 'Requote berhasil dibuat',
      data: requote,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Response to requote (customer)
 */
export const respondRequote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { requoteId } = req.params;
    const { accept } = req.body;
    const userId = req.user!.id;

    // Validasi requote
    const requote = await prisma.requote.findUnique({
      where: { id: requoteId },
      include: {
        booking: true,
      },
    });

    if (!requote) {
      return next(new AppError('Requote tidak ditemukan', 404));
    }

    // Cek apakah user adalah customer dari booking ini
    if (requote.booking.customerId !== userId && req.user!.role !== 'ADMIN') {
      return next(new AppError('Anda tidak berhak merespon requote ini', 403));
    }

    // Cek apakah requote masih PENDING
    if (requote.status !== 'PENDING') {
      return next(new AppError('Requote ini sudah direspon', 400));
    }

    const newStatus = accept ? 'ACCEPTED' : 'REJECTED';

    // Update requote dan booking jika diterima
    if (accept) {
      await prisma.$transaction(async prisma => {
        // 1. Update requote
        await prisma.requote.update({
          where: { id: requoteId },
          data: {
            status: newStatus,
            respondedAt: new Date(),
          },
        });

        // 2. Update booking amount
        await prisma.booking.update({
          where: { id: requote.bookingId },
          data: {
            totalAmount: requote.newAmount,
          },
        });

        // 3. Update payment
        const payment = await prisma.payment.findUnique({
          where: { bookingId: requote.bookingId },
        });

        if (payment) {
          // Jika payment masih PENDING, update amount
          if (payment.status === 'PENDING') {
            await prisma.payment.update({
              where: { id: payment.id },
              data: {
                amount: requote.newAmount,
              },
            });
          }
          // Jika payment sudah ESCROW, perlu tambahan untuk selisih
          else if (payment.status === 'ESCROW') {
            const additionalAmount = requote.newAmount - requote.originalAmount;
            // Tetapkan platform fee pada tambahan (10%)
            const additionalPlatformFee = additionalAmount * 0.1;

            await prisma.payment.update({
              where: { id: payment.id },
              data: {
                amount: requote.newAmount,
                platformFee: payment.platformFee + additionalPlatformFee,
              },
            });

            // Catat transaksi tambahan
            await prisma.transaction.create({
              data: {
                paymentId: payment.id,
                userId: requote.booking.customerId,
                transactionType: 'PAYMENT',
                amount: additionalAmount,
                status: 'SUCCESS',
                description: `Pembayaran tambahan untuk booking #${requote.booking.bookingNumber}`,
              },
            });
          }
        }
      });
    } else {
      // Jika ditolak, hanya update status requote
      await prisma.requote.update({
        where: { id: requoteId },
        data: {
          status: newStatus,
          respondedAt: new Date(),
        },
      });
    }

    // Kirim notifikasi ke provider
    await sendNotification(
      requote.booking.providerId,
      accept ? 'Requote Diterima' : 'Requote Ditolak',
      accept
        ? `Requote untuk booking #${requote.booking.bookingNumber} telah diterima`
        : `Requote untuk booking #${requote.booking.bookingNumber} ditolak oleh customer`,
      'requote_response',
      { bookingId: requote.bookingId, requoteId }
    );

    res.status(200).json({
      success: true,
      message: accept ? 'Requote diterima' : 'Requote ditolak',
      data: {
        id: requoteId,
        status: newStatus,
        bookingId: requote.bookingId,
      },
    });
  } catch (error) {
    next(error);
  }
};
