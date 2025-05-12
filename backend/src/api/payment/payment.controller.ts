import { Request, Response } from 'express';
import { PaymentService } from '../../services/payment.service';
import { logger } from '../../utils/logger';
import { ApiError } from '../../utils/api-error';

const paymentService = new PaymentService();

/**
 * @route POST /api/payment/initiate
 * @desc Inisiasi pembayaran untuk order
 * @access Private
 */
export const initiatePayment = async (req: Request, res: Response) => {
  try {
    const { orderId, amount } = req.body;

    if (!orderId || !amount) {
      throw new ApiError(400, 'Order ID dan jumlah pembayaran diperlukan');
    }

    const payment = await paymentService.initiatePayment(Number(orderId), Number(amount));

    res.status(201).json({
      success: true,
      data: payment,
      message: 'Pembayaran berhasil diinisiasi',
    });
  } catch (error) {
    logger.error('Gagal inisiasi pembayaran:', error);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Terjadi kesalahan server saat inisiasi pembayaran',
      });
    }
  }
};

/**
 * @route POST /api/payment/process
 * @desc Proses pembayaran setelah konfirmasi dari gateway pembayaran
 * @access Private
 */
export const processPayment = async (req: Request, res: Response) => {
  try {
    const { paymentId, transactionId } = req.body;

    if (!paymentId || !transactionId) {
      throw new ApiError(400, 'Payment ID dan Transaction ID diperlukan');
    }

    const payment = await paymentService.processPayment(Number(paymentId), transactionId);

    res.status(200).json({
      success: true,
      data: payment,
      message: 'Pembayaran berhasil diproses',
    });
  } catch (error) {
    logger.error('Gagal memproses pembayaran:', error);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Terjadi kesalahan server saat memproses pembayaran',
      });
    }
  }
};

/**
 * @route POST /api/payment/release-escrow/:orderId
 * @desc Proses rilis dana escrow setelah order selesai
 * @access Private (Admin)
 */
export const releaseEscrow = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      throw new ApiError(400, 'Order ID diperlukan');
    }

    const payment = await paymentService.releaseEscrow(Number(orderId));

    res.status(200).json({
      success: true,
      data: payment,
      message: 'Dana escrow berhasil dilepaskan',
    });
  } catch (error) {
    logger.error('Gagal melepaskan escrow:', error);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Terjadi kesalahan server saat melepaskan escrow',
      });
    }
  }
};

/**
 * @route POST /api/payment/refund/:orderId
 * @desc Refund pembayaran jika terjadi pembatalan
 * @access Private (Admin)
 */
export const refundPayment = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    if (!orderId) {
      throw new ApiError(400, 'Order ID diperlukan');
    }

    if (!reason) {
      throw new ApiError(400, 'Alasan refund diperlukan');
    }

    const payment = await paymentService.refundPayment(Number(orderId), reason);

    res.status(200).json({
      success: true,
      data: payment,
      message: 'Pembayaran berhasil direfund',
    });
  } catch (error) {
    logger.error('Gagal melakukan refund:', error);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Terjadi kesalahan server saat melakukan refund',
      });
    }
  }
};

/**
 * @route GET /api/payment/:id
 * @desc Mendapatkan detail pembayaran berdasarkan ID
 * @access Private
 */
export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new ApiError(400, 'Payment ID diperlukan');
    }

    const payment = await paymentService.getPaymentById(Number(id));

    if (!payment) {
      throw new ApiError(404, 'Pembayaran tidak ditemukan');
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    logger.error('Gagal mendapatkan detail pembayaran:', error);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Terjadi kesalahan server saat mendapatkan detail pembayaran',
      });
    }
  }
};

/**
 * @route GET /api/payment/order/:orderId
 * @desc Mendapatkan pembayaran berdasarkan Order ID
 * @access Private
 */
export const getPaymentByOrderId = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      throw new ApiError(400, 'Order ID diperlukan');
    }

    const payment = await paymentService.getPaymentByOrderId(Number(orderId));

    if (!payment) {
      throw new ApiError(404, 'Pembayaran tidak ditemukan untuk order ini');
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    logger.error('Gagal mendapatkan pembayaran berdasarkan order ID:', error);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Terjadi kesalahan server saat mendapatkan pembayaran',
      });
    }
  }
}; 