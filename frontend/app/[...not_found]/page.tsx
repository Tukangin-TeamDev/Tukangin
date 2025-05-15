import Link from 'next/link';

export default function NotFoundCatchAll() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <h1 className="text-6xl font-bold">404</h1>
      <h2 className="mt-4 text-2xl font-medium">Halaman Tidak Ditemukan</h2>
      <p className="mt-4 text-gray-600">Maaf, halaman yang Anda cari tidak tersedia.</p>
      <Link href="/" className="mt-8 text-blue-600 hover:underline">
        Kembali ke Beranda
      </Link>
    </div>
  );
}
