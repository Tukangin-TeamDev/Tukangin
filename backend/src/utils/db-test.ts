import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

// Memuat variabel lingkungan dari file .env
dotenv.config();

// Inisialisasi PrismaClient
const prisma = new PrismaClient();

/**
 * Fungsi untuk menguji koneksi database
 */
async function testDatabaseConnection(): Promise<void> {
  try {
    console.log('Mencoba terhubung ke database PostgreSQL via Supabase...');
    console.log(`URL database yang digunakan: ${process.env.DATABASE_URL?.substring(0, 25)}...`);

    // Menjalankan query sederhana untuk memastikan koneksi berfungsi
    const result = await prisma.$queryRaw`SELECT 1 as result`;

    console.log('Koneksi database berhasil!');
    console.log('Hasil query tes:', result);

    // Mencoba mengambil daftar tabel (opsional)
    const tableList = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('Daftar tabel di database:');
    console.log(tableList);
  } catch (error) {
    console.error('Gagal terhubung ke database:');
    console.error(error);
  } finally {
    // Selalu tutup koneksi Prisma setelah selesai
    await prisma.$disconnect();
  }
}

// Menjalankan fungsi pengujian
testDatabaseConnection()
  .then(() => console.log('Pengujian koneksi database selesai'))
  .catch(error => console.error('Error menjalankan pengujian:', error));
