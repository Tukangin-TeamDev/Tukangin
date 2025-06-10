import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle } from 'lucide-react';

export default function VerifyEmailSuccessPage() {
  return (
    <div className="flex h-[100dvh] w-screen items-center justify-center bg-gradient-to-b from-white to-gray-50 p-4 overflow-hidden">
      <div className="z-10 mx-auto w-full max-w-md">
        <div className="relative rounded-2xl border border-gray-100/80 bg-white/80 p-6 shadow-xl backdrop-blur-md">
          {/* Background elements */}
          <div className="absolute -bottom-[20vh] -right-[20vh] -z-10 h-[40vh] w-[40vh] rounded-full bg-gradient-to-tl from-blue-100 via-blue-50 to-blue-200 opacity-20 blur-2xl"></div>
          <div className="absolute -top-[20vh] -left-[20vh] -z-10 h-[40vh] w-[40vh] rounded-full bg-gradient-to-br from-blue-50 via-blue-100 to-green-100 opacity-20 blur-2xl"></div>

          <div className="text-center">
            {/* Logo */}
            <div className="mb-4 flex justify-center">
              <Image
                src="/placeholder.svg?height=96&width=96" 
                alt="Tukangin Logo"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>

            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              Email Berhasil Diverifikasi!
            </h1>
            
            <p className="mb-6 text-gray-600">
              Selamat! Email Anda telah berhasil diverifikasi. Akun Anda sekarang sudah aktif dan Anda dapat menggunakan layanan Tukangin.
            </p>

            <div className="space-y-4">
              <Link
                href="/login"
                className="inline-flex h-10 w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg"
              >
                Masuk ke Akun
              </Link>

              <Link
                href="/"
                className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50"
              >
                Kembali ke Beranda
              </Link>
            </div>

            <div className="mt-6 text-center text-xs text-gray-500">
              <p>© {new Date().getFullYear()} Tukangin. Semua hak dilindungi.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 