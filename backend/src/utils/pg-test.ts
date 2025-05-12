import { Pool } from 'pg';
import * as dotenv from 'dotenv';

// Memuat variabel lingkungan dari file .env
dotenv.config();

/**
 * Fungsi untuk menguji koneksi database PostgreSQL langsung tanpa Prisma
 */
async function testPgConnection(): Promise<void> {
  // Buat koneksi pool menggunakan DATABASE_URL dari .env
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Mencoba terhubung ke database PostgreSQL via pg...');
    console.log(`URL database yang digunakan: ${process.env.DATABASE_URL?.substring(0, 25)}...`);
    
    // Menjalankan query sederhana
    const result = await pool.query('SELECT NOW() as current_time');
    
    console.log('Koneksi database berhasil!');
    console.log('Waktu server database:', result.rows[0].current_time);
    
    // Mengambil daftar tabel
    const tableListResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('Daftar tabel di database:');
    console.log(tableListResult.rows);
    
  } catch (error) {
    console.error('Gagal terhubung ke database:');
    console.error(error);
  } finally {
    // Tutup koneksi pool
    await pool.end();
    console.log('Koneksi database ditutup');
  }
}

// Jalankan pengujian
testPgConnection()
  .then(() => console.log('Pengujian koneksi PostgreSQL selesai'))
  .catch((error) => console.error('Error menjalankan pengujian:', error)); 