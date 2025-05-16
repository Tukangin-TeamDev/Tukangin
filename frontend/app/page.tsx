import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, Shield, Star, Zap, Home, MessageCircle, DollarSign } from 'lucide-react';
import { NavbarGuest } from '@/components/navbar-guest';
import { Footer } from '@/components/footer';
import { Search } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <NavbarGuest />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-400/40 to-transparent py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                Cari Jasa <span className="text-blue-600">Gampang,</span>
                <br />
                <span className="text-blue-600">Aman, & Profesional</span>
              </h1>
              <p className="text-lg mb-8 max-w-lg">
                Tukangin mempertemukan Anda dengan penyedia jasa profesional yang terverifikasi dan
                terpercaya dalam satu platform yang aman.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="#"
                  className="px-6 py-3 bg-blue-600 text-white rounded-md flex items-center gap-2 hover:bg-blue-700"
                >
                  Cari Jasa Sekarang
                  <span className="text-lg">→</span>
                </Link>
                <Link
                  href="#"
                  className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Jadi Penyedia Jasa
                </Link>
              </div>
              <div className="flex flex-wrap gap-6 mt-8">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span>Terverifikasi</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span>Pembayaran Aman</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-blue-600" />
                  <span>Kualitas Terjamin</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <Image
                src="/placeholder.svg?height=500&width=500"
                alt="Handyman Illustration"
                width={500}
                height={500}
                className="max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">Layanan Kami</h2>
          <p className="text-center text-gray-600 mb-12">
            Temukan berbagai layanan profesional untuk kebutuhan rumah dan bisnis Anda
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Service Card 1 */}
            <div className="border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-center mb-6">
                  <div className="p-4 rounded-lg bg-gray-100">
                    <Zap className="w-12 h-12 text-gray-800" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">Perbaikan Listrik</h3>
                <p className="text-gray-600 text-center mb-6">
                  Perbaikan instalasi listrik rumah dan kantor
                </p>
                <div className="flex justify-center">
                  <Link
                    href="#"
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Lihat Detail
                  </Link>
                </div>
              </div>
            </div>

            {/* Service Card 2 */}
            <div className="border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-center mb-6">
                  <div className="p-4 rounded-lg bg-gray-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-800"
                    >
                      <path d="M2 7a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7z"></path>
                      <path d="M16 3h-2"></path>
                      <path d="M10 3H8"></path>
                      <path d="M12 10v4"></path>
                      <path d="M12 18h.01"></path>
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">Servis AC</h3>
                <p className="text-gray-600 text-center mb-6">Pemasangan dan perbaikan unit AC</p>
                <div className="flex justify-center">
                  <Link
                    href="#"
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Lihat Detail
                  </Link>
                </div>
              </div>
            </div>

            {/* Service Card 3 */}
            <div className="border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-center mb-6">
                  <div className="p-4 rounded-lg bg-gray-100">
                    <Home className="w-12 h-12 text-gray-800" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">Renovasi Rumah</h3>
                <p className="text-gray-600 text-center mb-6">
                  Renovasi dan perbaikan bagian rumah
                </p>
                <div className="flex justify-center">
                  <Link
                    href="#"
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Lihat Detail
                  </Link>
                </div>
              </div>
            </div>

            {/* Service Card 4 */}
            <div className="border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-center mb-6">
                  <div className="p-4 rounded-lg bg-gray-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-800"
                    >
                      <path d="M4 14c.5-1 1.8-2 3.5-2 2.5 0 3 2 5.5 2 1.7 0 3-.5 3.5-2"></path>
                      <path d="M4 9c.5-1 1.8-2 3.5-2 2.5 0 3 2 5.5 2 1.7 0 3-.5 3.5-2"></path>
                      <path d="M4 4c.5-1 1.8-2 3.5-2 2.5 0 3 2 5.5 2 1.7 0 3-.5 3.5-2"></path>
                      <path d="M4 19c.5-1 1.8-2 3.5-2 2.5 0 3 2 5.5 2 1.7 0 3-.5 3.5-2"></path>
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">Tukang Ledeng</h3>
                <p className="text-gray-600 text-center mb-6">Perbaikan pipa dan sanitasi</p>
                <div className="flex justify-center">
                  <Link
                    href="#"
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Lihat Detail
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">Cara Kerja</h2>
          <p className="text-center text-gray-600 mb-12">
            Proses mudah untuk mendapatkan jasa profesional yang anda butuhkan
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-lg p-6 shadow-sm relative overflow-hidden">
              <div className="flex flex-col items-center">
                {/* Badge positioned relative to icon container */}
                <div className="relative mb-8">
                  <div className="p-4 rounded-full bg-blue-100">
                    <Search className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow-sm">
                    Langkah 1
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-center mb-3">Cari & Pilih Jasa</h3>
                <p className="text-gray-600 text-center">
                  Temukan jasa yang anda butuhkan dari berbagai kategori dan pilih penyedia jasa terbaik
                </p>
              </div>
<<<<<<< HEAD:frontend/app/page.tsx
              <div className="absolute top-24 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                Langkah 1
              </div>
              <h3 className="text-xl font-semibold text-center mt-4 mb-2">Cari & Pilih Jasa</h3>
              <p className="text-gray-600 text-center">
                Temukan jasa yang anda butuhkan dari berbagai kategori dan pilih penyedia jasa
                terbaik
              </p>
=======
>>>>>>> 712e7fd (card style improve):frontend_baru/app/page.tsx
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-lg p-6 shadow-sm relative overflow-hidden">
              <div className="flex flex-col items-center">
                {/* Badge positioned relative to icon container */}
                <div className="relative mb-8">
                  <div className="p-4 rounded-full bg-blue-100">
                    <MessageCircle className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow-sm">
                    Langkah 2
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-center mb-3">Diskusi & Pesan</h3>
                <p className="text-gray-600 text-center">
                  Diskusikan detail pekerjaan dengan penyedia jasa dan lakukan pemesanan
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-lg p-6 shadow-sm relative overflow-hidden">
              <div className="flex flex-col items-center">
                {/* Badge positioned relative to icon container */}
                <div className="relative mb-8">
                  <div className="p-4 rounded-full bg-blue-100">
                    <DollarSign className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow-sm">
                    Langkah 3
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-center mb-3">Bayar & Terima Jasa</h3>
                <p className="text-gray-600 text-center">
                  Lakukan pembayaran aman melalui website dan terima jasa sesuai kesepakatan
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">
            Mengapa memilih Tukangin?
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Tukangin hadir untuk memudahkan anda menemukan jasa tukang profesional dengan kualitas
            terjamin
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Reason 1 */}
            <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-full bg-blue-100">
                  <CheckCircle className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Tukang Terverifikasi</h3>
              <p className="text-gray-600 text-center">
                Semua penyedia layanan sudah terverifikasi kualifikasi dan identitasnya
              </p>
            </div>

            {/* Reason 2 */}
            <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-full bg-blue-100">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Garansi Layanan</h3>
              <p className="text-gray-600 text-center">
                Kami berikan garansi untuk semua layanan yang anda pesan
              </p>
            </div>

            {/* Reason 3 */}
            <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-full bg-blue-100">
                  <Star className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Rating & Ulasan</h3>
              <p className="text-gray-600 text-center">
                Lihat penilaian dan ulasan dari pelanggan sebelumnya
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-400/40 via-blue-500/40 to-teal-400/40">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Siap untuk memulai Tukangin?</h2>
          <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
            Daftar sekarang dan temukan tukang profesional untuk kebutuhan anda atau daftarkan jasa
            anda sebagai penyedia layanan
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#"
              className="px-6 py-3 bg-[#00334d] text-white rounded-md hover:bg-[#00334d]/90 shadow-lg"
            >
              Daftar Sebagai Pelanggan
            </Link>
            <Link
              href="#"
              className="px-6 py-3 bg-[#00b36d] text-white rounded-md hover:bg-[#00b36d]/90 shadow-lg"
            >
              Daftar Sebagai Penyedia
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
