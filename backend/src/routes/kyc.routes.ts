import { Router } from 'express';
import { KYCController } from '../controllers/kyc.controller';
import { verifyToken, checkRole } from '../middlewares/auth.middleware';
import { Role } from '../types';
import { controllerAdapter } from '../utils/controller.adapter';

const router = Router();
const kycController = new KYCController();

// Routes untuk provider
router.post(
  '/documents',
  verifyToken,
  checkRole([Role.provider]),
  controllerAdapter(kycController.uploadDocument.bind(kycController))
);

router.get(
  '/documents/:providerId?',
  verifyToken,
  checkRole([Role.provider, Role.admin]),
  controllerAdapter(kycController.getProviderDocuments.bind(kycController))
);

// Routes untuk admin
router.get(
  '/pending',
  verifyToken,
  checkRole([Role.admin]),
  controllerAdapter(kycController.getPendingVerifications.bind(kycController))
);

router.put(
  '/verify/:documentId',
  verifyToken,
  checkRole([Role.admin]),
  controllerAdapter(kycController.verifyDocument.bind(kycController))
);

export default router;
