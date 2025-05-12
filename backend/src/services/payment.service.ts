import { PrismaClient, Payment, OrderStatus } from '@prisma/client';
import { logger } from '../utils/logger';
import { ApiError } from '../utils/api-error';
import { OrderService } from './order.service';

const prisma = new PrismaClient();
const orderService = new OrderService();

export class PaymentService {
  /**
   * Inisiasi pembayaran untuk order
   */
  async initiatePayment(orderId: number, amount: number): Promise<Payment> {
    try {
      logger.info(`Menginisiasi pembayaran untuk order ID: ${orderId}`);

      // Periksa apakah order ada
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { payment: true },
      });

      if (!order) {
        throw new ApiError(404, 'Order tidak ditemukan');
      }

      // Periksa apakah order sudah memiliki pembayaran
      if (order.payment) {
        throw new ApiError(400, 'Pembayaran untuk order ini sudah diinisiasi');
      }

      // Buat pembayaran baru
      const payment = await prisma.payment.create({
        data: {
          orderId,
          amount,
          status: 'PENDING', // Status awal PENDING
        },
      });

      logger.info(`Pembayaran berhasil diinisiasi dengan ID: ${payment.id}`);

      return payment;
    } catch (error) {
      logger.error('Gagal menginisiasi pembayaran:', error);
      throw error;
    }
  }

  /**
   * Proses pembayaran setelah konfirmasi dari gateway pembayaran
   */
  async processPayment(paymentId: number, transactionId: string): Promise<Payment> {
    try {
      logger.info(`Memproses pembayaran ID: ${paymentId} dengan transaction ID: ${transactionId}`);

      // Periksa apakah pembayaran ada
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: { order: true },
      });

      if (!payment) {
        throw new ApiError(404, 'Pembayaran tidak ditemukan');
      }

      // Update status pembayaran menjadi COMPLETED
      const updatedPayment = await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: 'COMPLETED',
          transactionId,
        },
      });

      // Update status order menjadi ACCEPTED jika sebelumnya PENDING
      if (payment.order.status === OrderStatus.PENDING) {
        await orderService.updateOrderStatus(payment.order.id, OrderStatus.ACCEPTED);
        logger.info(`Order ${payment.order.id} telah diubah statusnya menjadi ACCEPTED`);
      }

      logger.info(`Pembayaran ID: ${paymentId} berhasil diproses`);

      return updatedPayment;
    } catch (error) {
      logger.error('Gagal memproses pembayaran:', error);
      throw error;
    }
  }

  /**
   * Proses rilis dana escrow setelah order selesai
   */
  async releaseEscrow(orderId: number): Promise<Payment> {
    try {
      logger.info(`Memproses rilis escrow untuk order ID: ${orderId}`);

      // Periksa apakah order ada dan sudah COMPLETED
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { payment: true },
      });

      if (!order) {
        throw new ApiError(404, 'Order tidak ditemukan');
      }

      if (order.status !== OrderStatus.COMPLETED) {
        throw new ApiError(400, 'Order belum selesai, escrow tidak dapat dilepaskan');
      }

      if (!order.payment) {
        throw new ApiError(400, 'Tidak ada pembayaran terkait dengan order ini');
      }

      // Update status pembayaran menjadi RELEASED
      const payment = await prisma.payment.update({
        where: { id: order.payment.id },
        data: {
          status: 'RELEASED',
        },
      });

      logger.info(`Escrow berhasil dilepaskan untuk order ID: ${orderId}`);

      return payment;
    } catch (error) {
      logger.error('Gagal melepaskan escrow:', error);
      throw error;
    }
  }

  /**
   * Refund pembayaran jika terjadi pembatalan
   */
  async refundPayment(orderId: number, reason: string): Promise<Payment> {
    try {
      logger.info(`Memproses refund untuk order ID: ${orderId}`);

      // Periksa apakah order ada
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { payment: true },
      });

      if (!order) {
        throw new ApiError(404, 'Order tidak ditemukan');
      }

      if (!order.payment) {
        throw new ApiError(400, 'Tidak ada pembayaran terkait dengan order ini');
      }

      // Periksa status pembayaran
      if (order.payment.status === 'REFUNDED') {
        throw new ApiError(400, 'Pembayaran sudah direfund sebelumnya');
      }

      // Update status order menjadi CANCELLED
      await orderService.updateOrderStatus(orderId, OrderStatus.CANCELLED);

      // Update status pembayaran menjadi REFUNDED
      const payment = await prisma.payment.update({
        where: { id: order.payment.id },
        data: {
          status: 'REFUNDED',
          // Simpan alasan refund di transactionId
          transactionId: `REFUND: ${reason}`,
        },
      });

      logger.info(`Pembayaran berhasil direfund untuk order ID: ${orderId}`);

      return payment;
    } catch (error) {
      logger.error('Gagal melakukan refund:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan detail pembayaran berdasarkan ID
   */
  async getPaymentById(id: number): Promise<Payment | null> {
    try {
      return await prisma.payment.findUnique({
        where: { id },
      });
    } catch (error) {
      logger.error(`Gagal mendapatkan detail pembayaran ID: ${id}`, error);
      throw error;
    }
  }

  /**
   * Mendapatkan pembayaran berdasarkan Order ID
   */
  async getPaymentByOrderId(orderId: number): Promise<Payment | null> {
    try {
      return await prisma.payment.findUnique({
        where: { orderId },
      });
    } catch (error) {
      logger.error(`Gagal mendapatkan pembayaran untuk order ID: ${orderId}`, error);
      throw error;
    }
  }
} 