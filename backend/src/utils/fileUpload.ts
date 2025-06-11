/**
 * Upload file helpers
 */
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import logger from './logger';

// Inisialisasi Google Cloud Storage
let storage: Storage;

try {
  if (process.env.GOOGLE_CLOUD_PROJECT) {
    storage = new Storage({
      projectId: process.env.GOOGLE_CLOUD_PROJECT,
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
    });
  } else {
    // Mock storage untuk development
    // Ini dapat dimodifikasi dengan implementasi lain seperti local file system
    storage = {} as Storage;
  }
} catch (error) {
  logger.error('Failed to initialize cloud storage:', error);
}

// Nama bucket di Google Cloud Storage
const bucketName = process.env.STORAGE_BUCKET || 'tukangin-uploads';

/**
 * Upload file ke cloud storage
 * @param fileBuffer File buffer
 * @param destination Path tujuan di bucket
 * @param contentType MIME type
 * @returns Object dengan URL publik
 */
export const uploadFileToStorage = async (
  fileBuffer: Buffer,
  destination: string,
  contentType: string
): Promise<{ url: string }> => {
  try {
    // Cek apakah menggunakan Google Cloud Storage
    if (process.env.GOOGLE_CLOUD_PROJECT && storage.bucket) {
      const bucket = storage.bucket(bucketName);
      const file = bucket.file(destination);

      // Upload file
      await file.save(fileBuffer, {
        contentType,
        public: true
      });

      // Return public URL
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${destination}`;
      return { url: publicUrl };
    } else {
      // Mock upload untuk development
      // Di sini bisa diganti dengan upload ke filesystem lokal
      const mockUrl = `http://localhost:8080/uploads/${destination}`;
      logger.info(`Mock upload: ${mockUrl}`);
      return { url: mockUrl };
    }
  } catch (error) {
    logger.error('File upload error:', error);
    throw new Error('Failed to upload file');
  }
};

/**
 * Hapus file dari cloud storage
 * @param fileUrl URL file yang akan dihapus
 * @returns Boolean indicating success
 */
export const deleteFileFromStorage = async (fileUrl: string): Promise<boolean> => {
  try {
    // Extract path dari URL
    const urlParts = fileUrl.split(`${bucketName}/`);
    if (urlParts.length < 2) {
      return false;
    }

    const filePath = urlParts[1];

    // Cek apakah menggunakan Google Cloud Storage
    if (process.env.GOOGLE_CLOUD_PROJECT && storage.bucket) {
      const bucket = storage.bucket(bucketName);
      const file = bucket.file(filePath);

      // Check if file exists
      const [exists] = await file.exists();
      if (!exists) {
        return false;
      }

      // Delete file
      await file.delete();
      return true;
    } else {
      // Mock delete untuk development
      logger.info(`Mock delete: ${fileUrl}`);
      return true;
    }
  } catch (error) {
    logger.error('File delete error:', error);
    return false;
  }
};

/**
 * Get file type from MIME type
 * @param mimeType MIME type
 * @returns File type (image, video, document, audio, other)
 */
export const getFileType = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) {
    return 'image';
  } else if (mimeType.startsWith('video/')) {
    return 'video';
  } else if (
    mimeType === 'application/pdf' ||
    mimeType === 'application/msword' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimeType === 'application/vnd.ms-excel' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    mimeType === 'text/plain'
  ) {
    return 'document';
  } else if (mimeType.startsWith('audio/')) {
    return 'audio';
  } else {
    return 'other';
  }
};

/**
 * Generate unique filename
 * @param originalFilename Original filename
 * @returns Unique filename
 */
export const generateUniqueFilename = (originalFilename: string): string => {
  const fileExtension = originalFilename.split('.').pop() || '';
  const uniqueId = uuidv4();
  
  return `${uniqueId}.${fileExtension}`;
}; 