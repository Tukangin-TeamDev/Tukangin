import multer from 'multer';
import { Request } from 'express';
import { generateUniqueFilename } from '../utils/fileUpload';

// Definisikan tipe file yang diijinkan
const allowedMimeTypes = [
  // Images
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  // Videos
  'video/mp4',
  'video/webm',
  'video/ogg',
  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  // Audio
  'audio/mpeg',
  'audio/ogg',
  'audio/wav',
];

// Ukuran file maksimum (5MB)
const maxSize = 5 * 1024 * 1024;

// Filter file
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Format file tidak didukung'));
  }
};

// Memory storage untuk menyimpan file di memory (buffer)
// Ini berguna jika kita ingin upload file ke cloud storage
const storage = multer.memoryStorage();

// Konfigurasi multer
export const upload = multer({
  storage,
  limits: { fileSize: maxSize },
  fileFilter,
});
