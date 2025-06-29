import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';
import { handleError } from '../utils/errorHandler';
import { AppError } from '../utils/errorHandler';

const prisma = new PrismaClient();

/**
 * Mendapatkan loyalty point customer
 */
export const getCustomerLoyaltyPoints = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    // Dapatkan customer yang sedang login
    const customer = await prisma.customer.findUnique({
      where: { userId },
      select: {
        id: true,
        fullName: true,
        loyaltyPoints: true,
      },
    });

    if (!customer) {
      return res.status(404).json({
        status: 'error',
        message: 'Customer tidak ditemukan',
      });
    }

    // Hitung tier berdasarkan poin
    let tier = 'Bronze';
    if (customer.loyaltyPoints >= 10000) {
      tier = 'Platinum';
    } else if (customer.loyaltyPoints >= 5000) {
      tier = 'Gold';
    } else if (customer.loyaltyPoints >= 1000) {
      tier = 'Silver';
    }

    // Dapatkan histori transaksi poin
    const pointHistory = await prisma.transaction.findMany({
      where: {
        userId,
        transactionType: {
          in: ['EARNING_POINTS', 'REDEEMING_POINTS'],
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10, // Ambil 10 transaksi terakhir
    });

    return res.status(200).json({
      status: 'success',
      data: {
        customer: {
          id: customer.id,
          fullName: customer.fullName,
          loyaltyPoints: customer.loyaltyPoints,
          tier,
        },
        recentHistory: pointHistory,
      },
    });
  } catch (error) {
    logger.error(`Error in getCustomerLoyaltyPoints: ${error}`);
    return handleError(error, req, res, next);
  }
};

/**
 * Menukarkan loyalty points untuk voucher
 */
export const redeemLoyaltyPoints = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const { pointsToRedeem, voucherType } = req.body;

    // Dapatkan customer yang sedang login
    const customer = await prisma.customer.findUnique({
      where: { userId },
      select: {
        id: true,
        loyaltyPoints: true,
      },
    });

    if (!customer) {
      return res.status(404).json({
        status: 'error',
        message: 'Customer tidak ditemukan',
      });
    }

    // Cek apakah point yang ditukarkan valid
    if (pointsToRedeem <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Jumlah poin yang ditukar tidak valid',
      });
    }

    // Cek apakah customer memiliki cukup poin
    if (customer.loyaltyPoints < pointsToRedeem) {
      return res.status(400).json({
        status: 'error',
        message: 'Poin loyalty tidak cukup',
      });
    }

    // Tentukan nilai voucher berdasarkan tipe dan jumlah poin
    let discountValue = 0;
    const minPoints = 100; // Minimal poin untuk ditukar

    if (pointsToRedeem < minPoints) {
      return res.status(400).json({
        status: 'error',
        message: `Minimal poin yang dapat ditukar adalah ${minPoints}`,
      });
    }

    if (voucherType === 'FIXED_AMOUNT') {
      // Contoh: 100 poin = Rp10.000
      discountValue = Math.floor(pointsToRedeem / 10);
    } else if (voucherType === 'PERCENTAGE') {
      // Contoh: 500 poin = 10% diskon
      discountValue = Math.floor(pointsToRedeem / 50);
      // Maksimal 50% diskon
      if (discountValue > 50) {
        discountValue = 50;
      }
    } else {
      return res.status(400).json({
        status: 'error',
        message: 'Tipe voucher tidak valid',
      });
    }

    // Generate kode promo unik
    const date = new Date();
    const voucherCode = `LOYAL${userId.substring(0, 4)}${date.getTime().toString().substring(8)}`;

    // Set tanggal kedaluwarsa voucher (30 hari dari sekarang)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    // Buat promo baru dari loyalty points
    const voucher = await prisma.promo.create({
      data: {
        code: voucherCode,
        title:
          voucherType === 'FIXED_AMOUNT'
            ? `Voucher Diskon Rp${discountValue.toLocaleString()}`
            : `Voucher Diskon ${discountValue}%`,
        description: `Voucher dari penukaran ${pointsToRedeem} poin loyalty`,
        discountType: voucherType,
        discountValue,
        maxDiscount: voucherType === 'PERCENTAGE' ? 200000 : null, // Maksimal Rp200.000 untuk voucher persentase
        minOrderAmount: voucherType === 'FIXED_AMOUNT' ? discountValue * 2 : 50000, // Minimum pembelanjaan
        startDate: new Date(),
        endDate: expiryDate,
        isActive: true,
        usageLimit: 1, // Hanya bisa digunakan sekali
        applicableToAllServices: true, // Berlaku untuk semua service
        applicableCategoryIds: [],
        applicableServiceIds: [],
        applicableProviderIds: [],
        createdByUserId: userId,
      },
    });

    // Kurangi poin customer
    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        loyaltyPoints: {
          decrement: pointsToRedeem,
        },
      },
    });

    // Catat transaksi penukaran poin
    await prisma.transaction.create({
      data: {
        userId,
        amount: pointsToRedeem,
        type: 'REDEEMING_POINTS',
        status: 'COMPLETED',
        description: `Menukarkan ${pointsToRedeem} poin loyalty untuk voucher ${voucherCode}`,
        referenceId: voucher.id,
        referenceType: 'PROMO',
      },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Penukaran poin berhasil',
      data: {
        voucher,
        pointsRedeemed: pointsToRedeem,
        remainingPoints: customer.loyaltyPoints - pointsToRedeem,
      },
    });
  } catch (error) {
    logger.error(`Error in redeemLoyaltyPoints: ${error}`);
    return handleError(error, req, res, next);
  }
};

/**
 * Mendapatkan history redeem loyalty points
 */
export const getLoyaltyHistory = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const { page = 1, limit = 10, type } = req.query;

    // Konversi ke number
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    // Filter berdasarkan tipe (opsional)
    const typeFilter = type
      ? { transactionType: { in: Array.isArray(type) ? type : [type] } }
      : { transactionType: { in: ['EARNING_POINTS', 'REDEEMING_POINTS'] } };

    // Dapatkan histori transaksi
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        ...typeFilter,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limitNum,
    });

    // Hitung total transaksi untuk pagination
    const totalCount = await prisma.transaction.count({
      where: {
        userId,
        ...typeFilter,
      },
    });

    // Hitung total poin yang didapat dan ditukar
    const pointStats = await prisma.$queryRaw<
      { totalEarned: number; totalRedeemed: number }[]
    >`
      SELECT 
        SUM(CASE WHEN "transactionType" = 'EARNING_POINTS' THEN amount ELSE 0 END) as "totalEarned",
        SUM(CASE WHEN "transactionType" = 'REDEEMING_POINTS' THEN amount ELSE 0 END) as "totalRedeemed"
      FROM "Transaction"
      WHERE "userId" = ${userId}
        AND "transactionType" IN ('EARNING_POINTS', 'REDEEMING_POINTS')
        AND status = 'COMPLETED'
    `;

    return res.status(200).json({
      status: 'success',
      data: {
        transactions,
        pagination: {
          page: pageNum,
          limit: limitNum,
          totalItems: totalCount,
          totalPages: Math.ceil(totalCount / limitNum),
        },
        stats: pointStats[0] || { totalEarned: 0, totalRedeemed: 0 },
      },
    });
  } catch (error) {
    logger.error(`Error in getLoyaltyHistory: ${error}`);
    return handleError(error, req, res, next);
  }
};
