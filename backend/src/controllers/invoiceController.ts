import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { AppError } from '../middleware/errorHandler';
import { generateInvoiceNumber } from '../utils/generators';
import { sendEmail } from '../services/emailService';
import logger from '../utils/logger';

/**
 * Generate invoice for completed booking
 */
export const generateInvoice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user!.id;

    // Validasi booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        customer: true,
        provider: {
          select: {
            userId: true,
            fullName: true,
            businessName: true,
            isVerified: true,
          },
        },
        services: {
          include: {
            service: true,
          },
        },
        payments: {
          where: {
            status: 'COMPLETED',
          },
          take: 1,
        },
        requotes: true,
      },
    });

    if (!booking) {
      return next(new AppError('Booking tidak ditemukan', 404));
    }

    // Cek apakah user adalah customer, provider dari booking ini atau admin
    const isCustomer = booking.customerId === userId;
    const isProvider = booking.provider.userId === userId;
    const isAdmin = req.user!.role === 'ADMIN';

    if (!isCustomer && !isProvider && !isAdmin) {
      return next(new AppError('Anda tidak berhak mengakses data ini', 403));
    }

    // Cek apakah booking sudah selesai
    if (booking.status !== 'COMPLETED') {
      return next(new AppError('Invoice hanya bisa dibuat untuk booking yang sudah selesai', 400));
    }

    // Cek apakah pembayaran sudah selesai
    if (booking.payments.length === 0) {
      return next(new AppError('Pembayaran belum selesai', 400));
    }

    // Cek apakah invoice sudah ada
    const existingInvoice = await prisma.invoice.findFirst({
      where: {
        bookingId,
      },
    });

    if (existingInvoice) {
      return next(new AppError('Invoice untuk booking ini sudah dibuat', 400));
    }

    // Generate invoice number
    const invoiceNumber = generateInvoiceNumber();

    // Hitung total awal dari services
    let subtotal = booking.services.reduce((sum: number, item: any) => {
      return sum + item.price * item.quantity;
    }, 0);

    // Tambahkan biaya dari requote yang diterima
    const acceptedRequotes = booking.requotes.filter((r: any) => r.status === 'ACCEPTED');
    const requoteAmount = acceptedRequotes.reduce((sum: number, req: any) => sum + req.amount, 0);
    subtotal += requoteAmount;

    // Hitung tax (11%)
    const tax = subtotal * 0.11;

    // Total dengan tax
    const totalAmount = subtotal + tax;

    // Set invoice due date (7 hari dari sekarang)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    // Buat invoice
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        bookingId,
        paymentId: booking.payments[0].id,
        totalAmount,
        tax,
        issuedAt: new Date(),
        dueAt: dueDate,
        status: 'PAID', // Karena payment sudah completed
      },
    });

    // Kirim email invoice jika user adalah customer
    if (isCustomer) {
      // Dalam implementasi sebenarnya, kita akan menghasilkan PDF dan mengirimkan sebagai lampiran
      await sendEmail({
        to: req.user!.email,
        subject: `Invoice #${invoiceNumber} untuk layanan Tukangin`,
        text: `Invoice #${invoiceNumber} untuk booking #${booking.bookingNumber}\nTotal: Rp ${totalAmount.toLocaleString('id-ID')}\nTerima kasih telah menggunakan layanan Tukangin!`,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Invoice berhasil dibuat',
      data: invoice,
    });
  } catch (error) {
    logger.error('Generate invoice error:', error);
    next(error);
  }
};

/**
 * Get invoice by ID
 */
export const getInvoiceById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { invoiceId } = req.params;
    const userId = req.user!.id;

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        booking: {
          include: {
            customer: true,
            provider: true,
            services: {
              include: {
                service: true,
              },
            },
            requotes: {
              where: {
                status: 'ACCEPTED',
              },
            },
          },
        },
        payment: true,
      },
    });

    if (!invoice) {
      return next(new AppError('Invoice tidak ditemukan', 404));
    }

    // Cek otorisasi
    const isCustomer = invoice.booking.customer.userId === userId;
    const isProvider = invoice.booking.provider.userId === userId;
    const isAdmin = req.user!.role === 'ADMIN';

    if (!isCustomer && !isProvider && !isAdmin) {
      return next(new AppError('Anda tidak berhak mengakses invoice ini', 403));
    }

    res.status(200).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    logger.error('Get invoice error:', error);
    next(error);
  }
};

/**
 * Download invoice as PDF
 */
export const downloadInvoice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { invoiceId } = req.params;
    const userId = req.user!.id;

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        booking: {
          include: {
            customer: true,
            provider: true,
          },
        },
        payment: true,
      },
    });

    if (!invoice) {
      return next(new AppError('Invoice tidak ditemukan', 404));
    }

    // Cek otorisasi
    const isCustomer = invoice.booking.customer.userId === userId;
    const isProvider = invoice.booking.provider.userId === userId;
    const isAdmin = req.user!.role === 'ADMIN';

    if (!isCustomer && !isProvider && !isAdmin) {
      return next(new AppError('Anda tidak berhak mengakses invoice ini', 403));
    }

    // Di implementasi sebenarnya kita akan menghasilkan PDF dengan library seperti PDFKit
    // Untuk sementara kita hanya mengirimkan response JSON
    res.status(200).json({
      success: true,
      message: 'Fitur download PDF akan diimplementasikan pada fase berikutnya',
      data: {
        invoiceId,
        invoiceNumber: invoice.invoiceNumber,
        totalAmount: invoice.totalAmount,
      },
    });
  } catch (error) {
    logger.error('Download invoice error:', error);
    next(error);
  }
};

/**
 * Get all invoices for current user
 */
export const getUserInvoices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { status, page = 1, limit = 10 } = req.query;

    // Filter berdasarkan peran user
    const filter: any = {};

    if (req.user!.role === 'CUSTOMER') {
      filter.booking = {
        customer: {
          userId,
        },
      };
    } else if (req.user!.role === 'PROVIDER') {
      filter.booking = {
        provider: {
          userId,
        },
      };
    }

    // Filter status jika ada
    if (status) {
      filter.status = status;
    }

    // Hitung total
    const totalInvoices = await prisma.invoice.count({
      where: filter,
    });

    // Ambil data dengan pagination
    const skip = (Number(page) - 1) * Number(limit);
    const invoices = await prisma.invoice.findMany({
      where: filter,
      include: {
        booking: {
          select: {
            bookingNumber: true,
            status: true,
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
      skip,
      take: Number(limit),
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({
      success: true,
      data: {
        invoices,
        pagination: {
          total: totalInvoices,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(totalInvoices / Number(limit)),
        },
      },
    });
  } catch (error) {
    logger.error('Get user invoices error:', error);
    next(error);
  }
};
