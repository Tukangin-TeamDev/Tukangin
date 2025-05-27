import { PrismaClient, DocumentType, KYCStatus } from '@prisma/client';

const prisma = new PrismaClient();

export class KYCService {
  async uploadDocument(providerId: string, type: DocumentType, fileUrl: string) {
    const existingDoc = await prisma.kYCDocument.findFirst({
      where: {
        providerId,
        type,
      },
    });

    if (existingDoc) {
      return await prisma.kYCDocument.update({
        where: { id: existingDoc.id },
        data: {
          fileUrl,
          status: KYCStatus.pending,
        },
      });
    }

    return await prisma.kYCDocument.create({
      data: {
        providerId,
        type,
        fileUrl,
        status: KYCStatus.pending,
      },
    });
  }

  async verifyDocument(documentId: string, isApproved: boolean, notes?: string) {
    const status = isApproved ? KYCStatus.approved : KYCStatus.rejected;

    const document = await prisma.kYCDocument.update({
      where: { id: documentId },
      data: {
        status,
        notes,
      },
      include: {
        provider: true,
      },
    });

    // Update provider verification status if all documents are approved
    if (isApproved) {
      const allDocs = await prisma.kYCDocument.findMany({
        where: { providerId: document.providerId },
      });

      const allApproved = allDocs.every(doc => doc.status === KYCStatus.approved);

      if (allApproved) {
        await prisma.provider.update({
          where: { id: document.providerId },
          data: {
            verificationStatus: KYCStatus.approved,
            verificationDate: new Date(),
          },
        });
      }
    }

    return document;
  }

  async getProviderDocuments(providerId: string) {
    return await prisma.kYCDocument.findMany({
      where: { providerId },
    });
  }

  async getPendingVerifications() {
    return await prisma.kYCDocument.findMany({
      where: { status: KYCStatus.pending },
      include: {
        provider: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
      },
    });
  }
}
