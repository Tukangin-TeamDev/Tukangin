import { createClient } from '@supabase/supabase-js';

export class StorageService {
  private supabase;
  private bucket;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );
    this.bucket = process.env.SUPABASE_STORAGE_BUCKET || 'kyc-documents';
  }

  async uploadFile(file: Buffer, fileName: string): Promise<string> {
    const { data, error } = await this.supabase
      .storage
      .from(this.bucket)
      .upload(`documents/${fileName}`, file, {
        contentType: 'application/octet-stream',
        upsert: true
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    const { data: { publicUrl } } = this.supabase
      .storage
      .from(this.bucket)
      .getPublicUrl(`documents/${fileName}`);

    return publicUrl;
  }

  async deleteFile(fileName: string): Promise<void> {
    const { error } = await this.supabase
      .storage
      .from(this.bucket)
      .remove([`documents/${fileName}`]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  }
} 