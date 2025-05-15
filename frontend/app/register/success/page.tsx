import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function RegisterSuccessPage() {
  return (
    <div className="flex h-[100dvh] w-screen items-center justify-center bg-gradient-to-b from-white to-gray-50 p-4 overflow-hidden">
      <div className="z-10 mx-auto w-full max-w-md">
        <div className="relative rounded-2xl border border-gray-100/80 bg-white/80 p-4 text-center shadow-xl backdrop-blur-md">
          {/* Background elements */}
          <div className="absolute -bottom-[20vh] -right-[20vh] -z-10 h-[40vh] w-[40vh] rounded-full bg-gradient-to-tl from-blue-100 via-blue-50 to-blue-200 opacity-20 blur-2xl"></div>
          <div className="absolute -top-[20vh] -left-[20vh] -z-10 h-[40vh] w-[40vh] rounded-full bg-gradient-to-br from-blue-50 via-blue-100 to-green-100 opacity-20 blur-2xl"></div>

          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-8 w-8 text-green-600 sm:h-10 sm:w-10" />
            </div>
          </div>

          <h1 className="mb-2 text-xl font-bold text-gray-900 sm:text-2xl">Pendaftaran Berhasil!</h1>
          <p className="mb-4 text-sm text-gray-600">
            Akun Anda telah berhasil dibuat. Anda sekarang dapat masuk dan mulai menggunakan layanan Tukangin.
          </p>

          <div className="space-y-2 sm:space-y-3">
            <Link
              href="/login"
              className="inline-flex h-9 w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:from-blue-700 hover:to-blue-600 hover:shadow-lg sm:h-10"
            >
              Masuk ke Akun
            </Link>

            <Link
              href="/"
              className="inline-flex h-9 w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md sm:h-10"
            >
              Kembali ke Beranda
            </Link>
          </div>
          
          <div className="mt-4 text-center text-xs text-gray-500">
            <p>© {new Date().getFullYear()} Tukangin</p>
          </div>
        </div>
      </div>
    </div>
  )
}
