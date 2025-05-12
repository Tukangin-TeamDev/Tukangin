import { Request, Response } from 'express';
import { ReviewService, CreateReviewDto } from '../../services/review.service';
import { logger } from '../../utils/logger';
import { ApiError } from '../../utils/api-error';

const reviewService = new ReviewService();

/**
 * @route POST /api/reviews
 * @desc Membuat ulasan baru
 * @access Private (Customer)
 */
export const createReview = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      throw new ApiError(401, 'User belum terautentikasi');
    }

    const reviewData: CreateReviewDto = {
      orderId: req.body.orderId,
      customerId: req.user.id,
      providerId: req.body.providerId,
      rating: req.body.rating,
      comment: req.body.comment,
    };

    const review = await reviewService.createReview(reviewData);

    res.status(201).json({
      success: true,
      data: review,
      message: 'Ulasan berhasil dibuat',
    });
  } catch (error) {
    logger.error('Gagal membuat ulasan:', error);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Terjadi kesalahan server saat membuat ulasan',
      });
    }
  }
};

/**
 * @route GET /api/reviews/:id
 * @desc Mendapatkan ulasan berdasarkan ID
 * @access Public
 */
export const getReviewById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const review = await reviewService.getReviewById(Number(id));

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Ulasan tidak ditemukan',
      });
    }

    return res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    logger.error(`Gagal mendapatkan ulasan dengan ID: ${req.params.id}`, error);
    return res.status(500).json({
      success: false,
      error: 'Terjadi kesalahan server saat mendapatkan ulasan',
    });
  }
};

/**
 * @route GET /api/reviews/order/:orderId
 * @desc Mendapatkan ulasan berdasarkan Order ID
 * @access Public
 */
export const getReviewByOrderId = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const review = await reviewService.getReviewByOrderId(Number(orderId));

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Ulasan tidak ditemukan untuk order ini',
      });
    }

    return res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    logger.error(`Gagal mendapatkan ulasan untuk order ID: ${req.params.orderId}`, error);
    return res.status(500).json({
      success: false,
      error: 'Terjadi kesalahan server saat mendapatkan ulasan',
    });
  }
};

/**
 * @route GET /api/reviews/provider/:providerId
 * @desc Mendapatkan semua ulasan untuk provider
 * @access Public
 */
export const getReviewsByProviderId = async (req: Request, res: Response) => {
  try {
    const { providerId } = req.params;

    const reviews = await reviewService.getReviewsByProviderId(Number(providerId));

    return res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    logger.error(`Gagal mendapatkan ulasan untuk provider ID: ${req.params.providerId}`, error);
    return res.status(500).json({
      success: false,
      error: 'Terjadi kesalahan server saat mendapatkan ulasan provider',
    });
  }
};

/**
 * @route DELETE /api/reviews/:id
 * @desc Menghapus ulasan (admin only)
 * @access Private (Admin)
 */
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await reviewService.deleteReview(Number(id));

    res.status(200).json({
      success: true,
      message: 'Ulasan berhasil dihapus',
    });
  } catch (error) {
    logger.error(`Gagal menghapus ulasan dengan ID: ${req.params.id}`, error);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Terjadi kesalahan server saat menghapus ulasan',
      });
    }
  }
}; 