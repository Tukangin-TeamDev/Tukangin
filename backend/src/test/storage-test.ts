import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';

// Memuat variabel environment
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Memeriksa keberadaan variabel lingkungan Supabase
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('ERROR: Konfigurasi Supabase tidak lengkap di file .env');
  console.error('Pastikan .env file berisi konfigurasi berikut:');
  console.error('SUPABASE_URL=https://your-project.supabase.co');
  console.error('SUPABASE_ANON_KEY=your-anon-key');
  console.error('SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
  console.error('SUPABASE_STORAGE_BUCKET=kyc-documents');
  process.exit(1);
}

const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'kyc-documents';

console.log('Mencoba koneksi ke Supabase Storage...');
console.log(`SUPABASE_URL: ${process.env.SUPABASE_URL}`);
console.log(`SUPABASE_STORAGE_BUCKET: ${bucketName}`);

// Membuat client Supabase dengan service role key (untuk akses penuh ke storage)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Nama file untuk pengujian
const testFileName = `test-file-${crypto.randomBytes(4).toString('hex')}.txt`;
const testFileContent = 'Ini adalah file test untuk Supabase Storage';

// Fungsi untuk membersihkan file test
async function cleanupTestFile() {
  try {
    await supabase.storage
      .from(bucketName)
      .remove([testFileName]);
    
    console.log(`\nFile test ${testFileName} berhasil dihapus`);
  } catch (error) {
    console.error(`\nTidak dapat menghapus file test: ${testFileName}`);
  }
}

async function main() {
  try {
    // 1. Test koneksi dengan mengambil info bucket
    console.log('\nMemeriksa bucket...');
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      throw new Error(`Gagal mengakses Storage API: ${bucketError.message}`);
    }
    
    console.log(`✅ Berhasil terhubung ke Supabase Storage`);
    console.log(`📦 Bucket yang tersedia: ${buckets.map(b => b.name).join(', ')}`);
    
    // 2. Cek apakah bucket kyc-documents ada
    const kycBucket = buckets.find(b => b.name === bucketName);
    
    if (!kycBucket) {
      console.error(`❌ Bucket "${bucketName}" tidak ditemukan!`);
      console.log('Membuat bucket baru...');
      
      const { data: newBucket, error: createError } = await supabase.storage.createBucket(bucketName, {
        public: false,
      });
      
      if (createError) {
        throw new Error(`Gagal membuat bucket: ${createError.message}`);
      }
      
      console.log(`✅ Bucket "${bucketName}" berhasil dibuat`);
    } else {
      console.log(`✅ Bucket "${bucketName}" sudah ada`);
    }
    
    // 3. Upload file test
    console.log('\nMencoba upload file test...');
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(testFileName, testFileContent, {
        contentType: 'text/plain',
        upsert: true
      });
    
    if (uploadError) {
      throw new Error(`Gagal upload file: ${uploadError.message}`);
    }
    
    console.log('✅ File berhasil diupload');
    console.log(`File path: ${uploadData.path}`);
    
    // 4. Mendapatkan URL publik (jika bucket public)
    console.log('\nMendapatkan informasi file...');
    const { data: urlData } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(testFileName, 60); // URL signed valid selama 60 detik
    
    if (urlData) {
      console.log(`🔗 URL file (signed): ${urlData.signedUrl}`);
    }
    
    // 5. List file-file dalam bucket
    const { data: files, error: listError } = await supabase.storage
      .from(bucketName)
      .list();
    
    if (listError) {
      throw new Error(`Gagal mendapatkan daftar file: ${listError.message}`);
    }
    
    console.log('\n📄 Daftar file dalam bucket:');
    files.forEach((file, index) => {
      console.log(`${index + 1}. ${file.name} (${formatBytes(file.metadata.size)})`);
    });
    
    console.log('\n✨ Test Supabase Storage selesai dengan sukses!');
    

    
  } catch (error) {
    console.error('\n❌ KONEKSI STORAGE GAGAL');
    console.error('=========================');
    console.error('Error:', error);
    console.error('\nKemungkinan penyebab:');
    console.error('1. Kredensial Supabase salah');
    console.error('2. Storage tidak diaktifkan di project Supabase');
    console.error('3. Masalah izin untuk bucket');
    console.error('4. Masalah jaringan');
    
    console.error('\nLangkah troubleshooting:');
    console.error('- Periksa kembali SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY di file .env');
    console.error('- Pastikan Storage diaktifkan di Supabase dashboard');
    console.error('- Periksa izin RLS (Row Level Security) di Storage bucket');
  }
}

// Fungsi utilitas untuk format ukuran file
function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

main(); 