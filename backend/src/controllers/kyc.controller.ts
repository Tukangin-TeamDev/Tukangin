import { Request, Response } from 'express';
import { KYCService } from '../services/kyc.service';
import { AuthRequest, DocumentType } from '../types';

const kycService = new KYCService();

export class KYCController {
  async uploadDocument(req: AuthRequest, res: Response) {
    try {
      const providerId = req.user?.id;
      const { type, fileUrl } = req.body;

      if (!providerId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      if (!Object.values(DocumentType).includes(type)) {
        return res.status(400).json({ message: 'Invalid document type' });
      }

      const document = await kycService.uploadDocument(providerId, type, fileUrl);
      res.status(201).json(document);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async verifyDocument(req: Request, res: Response) {
    try {
      const { documentId } = req.params;
      const { isApproved, notes } = req.body;

      const document = await kycService.verifyDocument(documentId, isApproved, notes);
      res.json(document);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getProviderDocuments(req: AuthRequest, res: Response) {
    try {
      const providerId = req.params.providerId || req.user?.id;
      
      if (!providerId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const documents = await kycService.getProviderDocuments(providerId);
      res.json(documents);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getPendingVerifications(req: Request, res: Response) {
    try {
      const documents = await kycService.getPendingVerifications();
      res.json(documents);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
} 