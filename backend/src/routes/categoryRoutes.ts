import { Router } from 'express';
import * as CategoryController from '../controllers/categoryController';
import { authMiddleware as authenticate, authorize } from '../middleware/authMiddleware';
import * as CategorySchema from '../schemas/categorySchema';
import { upload } from '../middleware/multerMiddleware';
import { Role } from '@prisma/client';

// Function untuk validasi request menggunakan schema zod
const validateRequest = (schema: any) => {
  return (req: any, res: any, next: any) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      next(error);
    }
  };
};

const router = Router();

/**
 * Category Routes
 */
// Mendapatkan semua kategori
router.get('/', CategoryController.getAllCategories);

// Mendapatkan kategori berdasarkan id
router.get('/:categoryId', CategoryController.getCategoryById);

// Mendapatkan sub-kategori dari kategori tertentu
router.get('/:categoryId/subcategories', CategoryController.getSubcategories);

// Menambahkan kategori baru (admin only)
router.post(
  '/',
  authenticate,
  authorize([Role.ADMIN]),
  upload.single('image'),
  validateRequest(CategorySchema.createCategorySchema),
  CategoryController.createCategory
);

// Mengupdate kategori (admin only)
router.patch(
  '/:categoryId',
  authenticate,
  authorize([Role.ADMIN]),
  upload.single('image'),
  validateRequest(CategorySchema.updateCategorySchema),
  CategoryController.updateCategory
);

// Menghapus kategori (admin only)
router.delete(
  '/:categoryId',
  authenticate,
  authorize([Role.ADMIN]),
  CategoryController.deleteCategory
);

export default router;
