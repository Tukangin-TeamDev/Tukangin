import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';
import { ApiError } from '../utils/api-error';

const prisma = new PrismaClient();

export interface CreateReviewDto {
  orderId: number;
  customerId: number;
  providerId: number;
  rating: number;
  comment?: string;
}

export interface ReviewResponseDto {
  id: number;
  orderId: number;
  customerId: number;
  customerName: string;
  providerId: number;
  providerName: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}

export class ReviewService {
  /**
   * Membuat ulasan baru
   */
  async createReview(reviewData: CreateReviewDto): Promise<ReviewResponseDto> {
    try {
      logger.info(`Membuat ulasan baru untuk order ID: ${reviewData.orderId}`);

      // Validasi rating 1-5
      if (reviewData.rating < 1 || reviewData.rating > 5) {
        throw new ApiError(400, 'Rating harus di antara 1-5');
      }

      // Cek apakah order ada dan selesai
      const order = await prisma.order.findUnique({
        where: { id: reviewData.orderId },
        include: {
          review: true,
          customer: true,
          provider: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!order) {
        throw new ApiError(404, 'Order tidak ditemukan');
      }

      // Cek apakah order sudah selesai (COMPLETED)
      if (order.status !== 'COMPLETED') {
        throw new ApiError(400, 'Hanya order yang telah selesai yang dapat diulas');
      }

      // Cek apakah customer adalah pemilik order
      if (order.customerId !== reviewData.customerId) {
        throw new ApiError(403, 'Anda tidak memiliki akses untuk mengulas order ini');
      }

      // Cek apakah ulasan sudah ada
      if (order.review) {
        throw new ApiError(400, 'Order ini sudah memiliki ulasan');
      }

      // Buat ulasan baru
      const review = await prisma.review.create({
        data: {
          orderId: reviewData.orderId,
          customerId: reviewData.customerId,
          providerId: reviewData.providerId,
          rating: reviewData.rating,
          comment: reviewData.comment || null,
        },
        include: {
          customer: true,
          providerProfile: {
            include: {
              user: true,
            },
          },
        },
      });

      // Update rating rata-rata provider
      await this.updateProviderRating(reviewData.providerId);

      logger.info(`Ulasan berhasil dibuat dengan ID: ${review.id}`);

      return {
        id: review.id,
        orderId: review.orderId,
        customerId: review.customerId,
        customerName: review.customer.name,
        providerId: review.providerId,
        providerName: review.providerProfile.user.name,
        rating: review.rating,
        comment: review.comment || undefined,
        createdAt: review.createdAt,
      };
    } catch (error) {
      logger.error('Gagal membuat ulasan:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan ulasan berdasarkan ID
   */
  async getReviewById(id: number): Promise<ReviewResponseDto | null> {
    try {
      const review = await prisma.review.findUnique({
        where: { id },
        include: {
          customer: true,
          providerProfile: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!review) {
        return null;
      }

      return {
        id: review.id,
        orderId: review.orderId,
        customerId: review.customerId,
        customerName: review.customer.name,
        providerId: review.providerId,
        providerName: review.providerProfile.user.name,
        rating: review.rating,
        comment: review.comment || undefined,
        createdAt: review.createdAt,
      };
    } catch (error) {
      logger.error(`Gagal mendapatkan ulasan dengan ID: ${id}`, error);
      throw error;
    }
  }

  /**
   * Mendapatkan ulasan berdasarkan Order ID
   */
  async getReviewByOrderId(orderId: number): Promise<ReviewResponseDto | null> {
    try {
      const review = await prisma.review.findUnique({
        where: { orderId },
        include: {
          customer: true,
          providerProfile: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!review) {
        return null;
      }

      return {
        id: review.id,
        orderId: review.orderId,
        customerId: review.customerId,
        customerName: review.customer.name,
        providerId: review.providerId,
        providerName: review.providerProfile.user.name,
        rating: review.rating,
        comment: review.comment || undefined,
        createdAt: review.createdAt,
      };
    } catch (error) {
      logger.error(`Gagal mendapatkan ulasan untuk order ID: ${orderId}`, error);
      throw error;
    }
  }

  /**
   * Mendapatkan semua ulasan untuk provider
   */
  async getReviewsByProviderId(providerId: number): Promise<ReviewResponseDto[]> {
    try {
      const reviews = await prisma.review.findMany({
        where: { providerId },
        include: {
          customer: true,
          providerProfile: {
            include: {
              user: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return reviews.map((review) => ({
        id: review.id,
        orderId: review.orderId,
        customerId: review.customerId,
        customerName: review.customer.name,
        providerId: review.providerId,
        providerName: review.providerProfile.user.name,
        rating: review.rating,
        comment: review.comment || undefined,
        createdAt: review.createdAt,
      }));
    } catch (error) {
      logger.error(`Gagal mendapatkan ulasan untuk provider ID: ${providerId}`, error);
      throw error;
    }
  }

  /**
   * Menghapus ulasan (admin only)
   */
  async deleteReview(id: number): Promise<void> {
    try {
      logger.info(`Menghapus ulasan dengan ID: ${id}`);

      // Cek apakah ulasan ada
      const review = await prisma.review.findUnique({
        where: { id },
      });

      if (!review) {
        throw new ApiError(404, 'Ulasan tidak ditemukan');
      }

      // Hapus ulasan
      await prisma.review.delete({
        where: { id },
      });

      // Update rating rata-rata provider
      await this.updateProviderRating(review.providerId);

      logger.info(`Ulasan dengan ID: ${id} berhasil dihapus`);
    } catch (error) {
      logger.error(`Gagal menghapus ulasan dengan ID: ${id}`, error);
      throw error;
    }
  }

  /**
   * Update rating rata-rata provider
   */
  private async updateProviderRating(providerId: number): Promise<void> {
    try {
      // Ambil semua ulasan provider
      const reviews = await prisma.review.findMany({
        where: { providerId },
        select: { rating: true },
      });

      // Hitung rating rata-rata
      let avgRating = 0;
      if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        avgRating = totalRating / reviews.length;
      }

      // Update rating provider
      await prisma.providerProfile.update({
        where: { id: providerId },
        data: { rating: avgRating },
      });

      logger.info(`Rating provider ID: ${providerId} diperbarui menjadi ${avgRating}`);
    } catch (error) {
      logger.error(`Gagal memperbarui rating provider ID: ${providerId}`, error);
      throw error;
    }
  }
} 