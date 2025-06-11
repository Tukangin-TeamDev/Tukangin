import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { AppError } from '../middleware/errorHandler';
import { sendNotification } from '../services/notificationService';
import logger from '../utils/logger';

/**
 * Get payment details
 */
export const getPaymentDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { paymentId } = req.params;
    const userId = req.user!.id;

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        booking: true,
        transactions: true
      }
    });

    if (!payment) {
      return next(new AppError('Payment tidak ditemukan', 404));
    }

    // Cek otorisasi
    const isCustomer = payment.booking.customerId === userId;
    const isProvider = payment.booking.providerId === userId;
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    const isAdmin = user?.role === 'ADMIN';

    if (!isCustomer && !isProvider && !isAdmin) {
      return next(new AppError('Anda tidak berhak mengakses payment ini', 403));
    }

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Process payment to escrow
 */
export const processPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { paymentId } = req.params;
    const { paymentMethod, paymentProofUrl } = req.body;
    const userId = req.user!.id;

    // Validasi payment
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        booking: true
      }
    });

    if (!payment) {
      return next(new AppError('Payment tidak ditemukan', 404));
    }

    // Cek apakah user adalah customer dari booking ini
    if (payment.booking.customerId !== userId && req.user!.role !== 'ADMIN') {
      return next(new AppError('Anda tidak berhak memproses payment ini', 403));
    }

    // Cek status payment
    if (payment.status !== 'PENDING') {
      return next(new AppError(`Payment dengan status ${payment.status} tidak dapat diproses`, 400));
    }

    // Proses payment
    const updatedPayment = await prisma.$transaction(async (prisma) => {
      // 1. Update payment ke status ESCROW
      const updated = await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: 'ESCROW',
          paymentMethod,
          paymentProofUrl,
          escrowDate: new Date(),
          escrowNumber: `ESCROW-${Date.now()}`
        }
      });

      // 2. Catat transaksi
      await prisma.transaction.create({
        data: {
          paymentId,
          userId: payment.booking.customerId,
          transactionType: 'ESCROW_IN',
          amount: payment.amount,
          status: 'SUCCESS',
          description: `Dana masuk ke escrow untuk booking #${payment.booking.bookingNumber}`
        }
      });

      return updated;
    });

    // Kirim notifikasi ke provider
    await sendNotification(
      payment.booking.providerId,
      'Pembayaran Diterima',
      `Pembayaran untuk booking #${payment.booking.bookingNumber} telah diterima dan masuk ke escrow`,
      'payment',
      { bookingId: payment.booking.id, paymentId }
    );

    res.status(200).json({
      success: true,
      message: 'Pembayaran berhasil diproses dan dana masuk ke escrow',
      data: {
        id: updatedPayment.id,
        status: updatedPayment.status,
        escrowNumber: updatedPayment.escrowNumber,
        escrowDate: updatedPayment.escrowDate
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Release escrow to provider
 */
export const releaseEscrow = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { paymentId } = req.params;
    const userId = req.user!.id;

    // Validasi payment
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        booking: true
      }
    });

    if (!payment) {
      return next(new AppError('Payment tidak ditemukan', 404));
    }

    // Cek apakah user adalah customer dari booking ini atau admin
    const isCustomer = payment.booking.customerId === userId;
    const isAdmin = req.user!.role === 'ADMIN';

    if (!isCustomer && !isAdmin) {
      return next(new AppError('Anda tidak berhak melepaskan dana escrow ini', 403));
    }

    // Cek status payment
    if (payment.status !== 'ESCROW') {
      return next(new AppError(`Payment dengan status ${payment.status} tidak dapat direlease`, 400));
    }

    // Cek status booking
    if (payment.booking.status !== 'COMPLETED') {
      return next(new AppError('Booking harus dalam status COMPLETED untuk melepaskan dana escrow', 400));
    }

    // Release escrow dengan transaction
    const updatedPayment = await prisma.$transaction(async (prisma) => {
      // 1. Update payment ke status COMPLETED
      const updated = await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: 'COMPLETED',
          releaseDate: new Date()
        }
      });

      // 2. Hitung jumlah yang diterima provider (setelah dipotong platform fee)
      const netAmount = payment.amount - payment.platformFee;
      
      // 3. Tambahkan ke wallet provider
      const providerWallet = await prisma.wallet.findFirst({
        where: { userId: payment.booking.providerId }
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
            userId: payment.booking.providerId,
            balance: netAmount
          }
        });
      }

      // 4. Catat transaksi
      await prisma.transaction.create({
        data: {
          paymentId,
          userId: payment.booking.providerId,
          transactionType: 'ESCROW_OUT',
          amount: netAmount,
          status: 'SUCCESS',
          description: `Dana dari escrow untuk booking #${payment.booking.bookingNumber}`
        }
      });

      return updated;
    });

    // Kirim notifikasi ke provider
    await sendNotification(
      payment.booking.providerId,
      'Dana Escrow Dilepaskan',
      `Dana untuk booking #${payment.booking.bookingNumber} telah dilepaskan ke wallet Anda`,
      'payment',
      { bookingId: payment.booking.id, paymentId }
    );

    res.status(200).json({
      success: true,
      message: 'Dana escrow berhasil dilepaskan ke provider',
      data: {
        id: updatedPayment.id,
        status: updatedPayment.status,
        releaseDate: updatedPayment.releaseDate
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Refund payment to customer
 */
export const refundPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { paymentId } = req.params;
    const { refundReason, refundAmount } = req.body;
    const userId = req.user!.id;

    // Validasi payment
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        booking: true
      }
    });

    if (!payment) {
      return next(new AppError('Payment tidak ditemukan', 404));
    }

    // Hanya admin yang boleh melakukan refund manual
    if (req.user!.role !== 'ADMIN') {
      return next(new AppError('Hanya admin yang dapat melakukan refund', 403));
    }

    // Cek status payment
    if (payment.status !== 'ESCROW') {
      return next(new AppError(`Payment dengan status ${payment.status} tidak dapat direfund`, 400));
    }

    // Validasi jumlah refund
    const maxRefund = payment.amount;
    if (refundAmount <= 0 || refundAmount > maxRefund) {
      return next(new AppError(`Jumlah refund tidak valid. Maksimum ${maxRefund}`, 400));
    }

    // Process refund
    const updatedPayment = await prisma.$transaction(async (prisma) => {
      // 1. Update payment ke status REFUNDED
      const updated = await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: 'REFUNDED',
          refundAmount,
          refundReason,
          refundDate: new Date()
        }
      });

      // 2. Catat transaksi refund
      await prisma.transaction.create({
        data: {
          paymentId,
          userId: payment.booking.customerId,
          transactionType: 'REFUND',
          amount: refundAmount,
          status: 'SUCCESS',
          description: `Refund untuk booking #${payment.booking.bookingNumber}: ${refundReason}`
        }
      });

      return updated;
    });

    // Kirim notifikasi ke customer dan provider
    await sendNotification(
      payment.booking.customerId,
      'Refund Diproses',
      `Refund sebesar ${refundAmount} untuk booking #${payment.booking.bookingNumber} telah diproses`,
      'payment',
      { bookingId: payment.booking.id, paymentId }
    );

    await sendNotification(
      payment.booking.providerId,
      'Booking Direfund',
      `Booking #${payment.booking.bookingNumber} telah direfund ke customer`,
      'payment',
      { bookingId: payment.booking.id, paymentId }
    );

    res.status(200).json({
      success: true,
      message: 'Refund berhasil diproses',
      data: {
        id: updatedPayment.id,
        status: updatedPayment.status,
        refundAmount: updatedPayment.refundAmount,
        refundDate: updatedPayment.refundDate
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get wallet balance and transactions
 */
export const getWallet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Get wallet
    let wallet = await prisma.wallet.findFirst({
      where: { userId }
    });

    if (!wallet) {
      // Create wallet if not exists
      wallet = await prisma.wallet.create({
        data: {
          userId,
          balance: 0
        }
      });
    }

    // Get transactions
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: Number(limit)
    });

    // Count total transactions
    const total = await prisma.transaction.count({
      where: { userId }
    });

    res.status(200).json({
      success: true,
      data: {
        wallet,
        transactions,
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
 * Request wallet withdrawal (provider)
 */
export const withdrawWallet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { amount, bankAccount, bankName, accountName, accountNumber } = req.body;
    const userId = req.user!.id;

    // Validasi user sebagai provider
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || user.role !== 'PROVIDER') {
      return next(new AppError('Hanya provider yang dapat melakukan withdrawal', 403));
    }

    // Get wallet
    const wallet = await prisma.wallet.findFirst({
      where: { userId }
    });

    if (!wallet) {
      return next(new AppError('Wallet tidak ditemukan', 404));
    }

    // Validasi jumlah withdrawal
    if (amount <= 0) {
      return next(new AppError('Jumlah withdrawal harus lebih dari 0', 400));
    }

    if (amount > wallet.balance) {
      return next(new AppError('Saldo tidak mencukupi', 400));
    }

    // Minimal withdrawal 50.000
    if (amount < 50000) {
      return next(new AppError('Minimal withdrawal adalah Rp 50.000', 400));
    }

    // Process withdrawal
    await prisma.$transaction(async (prisma) => {
      // 1. Kurangi saldo wallet
      await prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: { decrement: amount },
          lastWithdraw: new Date()
        }
      });

      // 2. Catat transaksi
      await prisma.transaction.create({
        data: {
          userId,
          transactionType: 'WITHDRAW',
          amount,
          status: 'PENDING', // Status awal pending, akan diubah admin
          description: `Withdrawal ke ${bankName} ${accountNumber}`,
          referenceNumber: `WD-${Date.now()}`
        }
      });
    });

    // Kirim notifikasi ke admin
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: { id: true }
    });

    for (const admin of admins) {
      await sendNotification(
        admin.id,
        'Permintaan Withdrawal',
        `Provider ${user.email} meminta withdrawal sebesar ${amount}`,
        'withdrawal',
        { userId, amount }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Permintaan withdrawal berhasil diproses dan sedang menunggu persetujuan admin',
      data: {
        amount,
        status: 'PENDING',
        timestamp: new Date()
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Process withdrawal (admin)
 */
export const processWithdrawal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { transactionId } = req.params;
    const { status, notes } = req.body;
    const userId = req.user!.id;

    // Hanya admin yang boleh memproses withdrawal
    if (req.user!.role !== 'ADMIN') {
      return next(new AppError('Hanya admin yang dapat memproses withdrawal', 403));
    }

    // Validasi status
    if (status !== 'SUCCESS' && status !== 'FAILED') {
      return next(new AppError('Status tidak valid', 400));
    }

    // Validasi transaksi
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId }
    });

    if (!transaction) {
      return next(new AppError('Transaksi tidak ditemukan', 404));
    }

    if (transaction.transactionType !== 'WITHDRAW') {
      return next(new AppError('Transaksi bukan tipe withdrawal', 400));
    }

    if (transaction.status !== 'PENDING') {
      return next(new AppError(`Transaksi dengan status ${transaction.status} tidak dapat diproses`, 400));
    }

    // Update transaksi
    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        status,
        description: notes ? `${transaction.description} - ${notes}` : transaction.description
      }
    });

    // Jika gagal, kembalikan dana ke wallet
    if (status === 'FAILED') {
      const wallet = await prisma.wallet.findFirst({
        where: { userId: transaction.userId }
      });

      if (wallet) {
        await prisma.wallet.update({
          where: { id: wallet.id },
          data: {
            balance: { increment: transaction.amount }
          }
        });
      }
    }

    // Kirim notifikasi ke provider
    await sendNotification(
      transaction.userId,
      status === 'SUCCESS' ? 'Withdrawal Berhasil' : 'Withdrawal Gagal',
      status === 'SUCCESS'
        ? `Withdrawal sebesar ${transaction.amount} telah berhasil diproses`
        : `Withdrawal sebesar ${transaction.amount} gagal diproses: ${notes}`,
      'withdrawal',
      { transactionId, status }
    );

    res.status(200).json({
      success: true,
      message: `Withdrawal berhasil diproses dengan status ${status}`,
      data: updatedTransaction
    });
  } catch (error) {
    next(error);
  }
}; 