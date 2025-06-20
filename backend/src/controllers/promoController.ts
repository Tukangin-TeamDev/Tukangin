import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all active promos
export const getActivePromos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const promos = await prisma.promo.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: promos });
  } catch (error) {
    next(error);
  }
};

// Get promo by ID
export const getPromoById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { promoId } = req.params;
    const promo = await prisma.promo.findUnique({ where: { id: promoId } });
    if (!promo) return res.status(404).json({ success: false, message: 'Promo not found' });
    res.json({ success: true, data: promo });
  } catch (error) {
    next(error);
  }
};

// Create a new promo
export const createPromo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const promo = await prisma.promo.create({ data: req.body });
    res.status(201).json({ success: true, data: promo });
  } catch (error) {
    next(error);
  }
};

// Update a promo
export const updatePromo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { promoId } = req.params;
    const promo = await prisma.promo.update({
      where: { id: promoId },
      data: req.body,
    });
    res.json({ success: true, data: promo });
  } catch (error) {
    next(error);
  }
};

// Delete (deactivate) a promo
export const deletePromo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { promoId } = req.params;
    const promo = await prisma.promo.update({
      where: { id: promoId },
      data: { isActive: false },
    });
    res.json({ success: true, data: promo });
  } catch (error) {
    next(error);
  }
};

// Activate a promo
export const activatePromo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { promoId } = req.params;
    const promo = await prisma.promo.update({
      where: { id: promoId },
      data: { isActive: true },
    });
    res.json({ success: true, data: promo });
  } catch (error) {
    next(error);
  }
};

// Deactivate a promo
export const deactivatePromo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { promoId } = req.params;
    const promo = await prisma.promo.update({
      where: { id: promoId },
      data: { isActive: false },
    });
    res.json({ success: true, data: promo });
  } catch (error) {
    next(error);
  }
};

// Validate promo code
export const validatePromoCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, totalAmount, categoryId, providerId } = req.body;
    const now = new Date();
    const promo = await prisma.promo.findFirst({
      where: {
        code,
        isActive: true,
        validUntil: { gte: now },
        OR: [
          { categoryId: categoryId || undefined },
          { providerId: providerId || undefined },
          { categoryId: null, providerId: null },
        ],
      },
    });
    if (!promo) {
      return res.status(404).json({ success: false, message: 'Promo code not valid or expired' });
    }
    if (promo.minOrderAmount && totalAmount < promo.minOrderAmount) {
      return res
        .status(400)
        .json({ success: false, message: `Minimum order amount is ${promo.minOrderAmount}` });
    }
    res.json({ success: true, data: promo });
  } catch (error) {
    next(error);
  }
};
