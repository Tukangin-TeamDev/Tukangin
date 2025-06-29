/**
 * Upload file helpers
 */
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import logger from './logger';

// Inisialisasi Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://qydbluusjxksvitwlrao.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Nama bucket di Supabase Storage
const bucketName = process.env.STORAGE_BUCKET || 'tukangin-uploads';

/**
 * Upload file ke Supabase Storage
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
    // Upload file ke Supabase Storage
    const { error } = await supabase.storage.from(bucketName).upload(destination, fileBuffer, {
      contentType,
      upsert: true,
    });

    if (error) {
      logger.error('Supabase upload error:', error);
      throw new Error('Failed to upload file');
    }

    // Dapatkan public URL
    const { publicUrl } = supabase.storage.from(bucketName).getPublicUrl(destination).data;
    return { url: publicUrl };
  } catch (error) {
    logger.error('File upload error:', error);
    throw new Error('Failed to upload file');
  }
};

/**
 * Hapus file dari Supabase Storage
 * @param fileUrl URL file yang akan dihapus
 * @returns Boolean indicating success
 */
export const deleteFileFromStorage = async (fileUrl: string): Promise<boolean> => {
  try {
    // Ekstrak path file dari URL
    const url = new URL(fileUrl);
    const pathIndex = url.pathname.indexOf(`/${bucketName}/`);
    if (pathIndex === -1) {
      return false;
    }
    const filePath = url.pathname.substring(pathIndex + bucketName.length + 2);

    // Hapus file dari Supabase Storage
    const { error } = await supabase.storage.from(bucketName).remove([filePath]);
    if (error) {
      logger.error('Supabase delete error:', error);
      return false;
    }
    return true;
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
