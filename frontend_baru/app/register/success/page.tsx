import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function RegisterSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 text-center">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-green-100 p-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-4">Pendaftaran Berhasil!</h1>
          <p className="text-gray-600 mb-8">
            Akun Anda telah berhasil dibuat. Anda sekarang dapat masuk dan mulai menggunakan layanan Tukangin.
          </p>

          <div className="space-y-4">
            <Link
              href="/login"
              className="inline-flex items-center justify-center w-full h-12 px-4 py-2 rounded-xl text-base font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Masuk ke Akun
            </Link>

            <Link
              href="/"
              className="inline-flex items-center justify-center w-full h-12 px-4 py-2 rounded-xl text-base font-medium border border-gray-300 bg-white hover:bg-gray-50 shadow-sm hover:shadow-md transition-all duration-300"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
