import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

// Memuat variabel environment
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Memeriksa keberadaan DATABASE_URL dan DIRECT_URL
if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL tidak ditemukan di file .env');
  console.error('Pastikan .env file berisi konfigurasi yang benar:');
  console.error(
    'DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true"'
  );
  process.exit(1);
}

if (!process.env.DIRECT_URL) {
  console.warn('PERINGATAN: DIRECT_URL tidak ditemukan di file .env');
  console.warn('DIRECT_URL diperlukan untuk migrasi database dengan Prisma');
  console.warn('Sebaiknya tambahkan DIRECT_URL ke file .env dengan format:');
  console.warn(
    'DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"'
  );
}

console.log('Mencoba koneksi ke database Supabase...');
console.log(`DATABASE_URL: ${process.env.DATABASE_URL.replace(/:[^:@]+@/, ':******@')}`);
if (process.env.DIRECT_URL) {
  console.log(`DIRECT_URL: ${process.env.DIRECT_URL.replace(/:[^:@]+@/, ':******@')}`);
}

// Membuat instance Prisma
const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

async function main() {
  try {
    // Test koneksi dengan query sederhana
    const result = await prisma.$queryRaw`SELECT version(), current_timestamp`;
    console.log('\n✅ KONEKSI DATABASE BERHASIL');
    console.log('==========================');
    console.log('Informasi server:');
    console.log(result);

    // Mencoba mengecek jumlah tabel
    const tableCount: { count: string }[] = await prisma.$queryRaw`
      SELECT count(*) 
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `;
    console.log(`\nJumlah tabel di database: ${tableCount[0].count}`);

    // Mencoba mencek schema Prisma vs database aktual
    console.log('\nMemeriksa model-model Prisma yang tersedia:');
    const dmmf = (prisma as any)._baseDmmf;
    if (dmmf && dmmf.datamodel) {
      console.log(`\nModel Prisma yang didefinisikan: ${dmmf.datamodel.models.length}`);
      dmmf.datamodel.models.forEach((model: any) => {
        console.log(`- ${model.name}`);
      });
    }

    console.log('\nKoneksi siap digunakan untuk aplikasi ✨');
  } catch (error) {
    console.error('\n❌ KONEKSI DATABASE GAGAL');
    console.error('=======================');
    console.error('Error:', error);
    console.error('\nKemungkinan penyebab:');
    console.error('1. Kredensial database salah');
    console.error('2. IP address tidak diizinkan di pengaturan Supabase');
    console.error('3. Database tidak aktif atau sedang maintenance');
    console.error('4. Masalah jaringan atau firewall');
    console.error('5. Untuk Supabase dengan pgBouncer, pastikan URL berisi ?pgbouncer=true');

    console.error('\nLangkah troubleshooting:');
    console.error('- Periksa kembali DATABASE_URL dan DIRECT_URL di file .env');
    console.error(
      '- Pastikan IP address diizinkan di Supabase (Settings > Database > Connection Pooling)'
    );
    console.error('- Cek status Supabase di dashboard project');
    console.error(
      '- Pastikan format URL untuk connection pooling sudah benar (lihat Supabase dashboard)'
    );
  } finally {
    await prisma.$disconnect();
  }
}

main();
