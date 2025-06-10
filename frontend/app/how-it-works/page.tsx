import Image from 'next/image';
import Link from 'next/link';
import { NavbarGuest } from '@/components/navbar-guest';
import { Footer } from '@/components/footer';
import {
  Search,
  Calendar,
  CheckCircle,
  Star,
  MessageSquare,
  Shield,
  CreditCard,
  ThumbsUp,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen">
      <NavbarGuest />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-400/30 to-blue-400/5 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Cara Kerja Tukangin</h1>
            <p className="text-lg text-gray-700 mb-8">
              Temukan, pesan, dan nikmati layanan profesional dengan mudah. Platform kami
              menghubungkan Anda dengan ahli terpercaya hanya dalam beberapa langkah sederhana.
            </p>
            <div className="mt-10">
              <Link
                href="/register"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium text-lg"
              >
                Mulai Sekarang
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Process Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Proses Sederhana, Hasil Maksimal</h2>
            <p className="text-lg text-gray-700">
              Dapatkan layanan profesional dalam 4 langkah mudah
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg h-full flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
                <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-3">Pilih Layanan</h3>
                <p className="text-gray-700">
                  Jelajahi berbagai kategori layanan dan pilih yang sesuai dengan kebutuhan Anda.
                  Filter berdasarkan lokasi, harga, dan rating.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg h-full flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-3">Jadwalkan Layanan</h3>
                <p className="text-gray-700">
                  Pilih tanggal dan waktu yang nyaman untuk Anda. Dapatkan konfirmasi instan atau
                  dalam waktu maksimal 1 jam.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg h-full flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-blue-600" />
                </div>
                <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-3">Terima Layanan</h3>
                <p className="text-gray-700">
                  Profesional kami akan datang tepat waktu dan menyelesaikan pekerjaan sesuai
                  standar kualitas Tukangin.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative">
              <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg h-full flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Star className="h-8 w-8 text-blue-600" />
                </div>
                <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  4
                </div>
                <h3 className="text-xl font-semibold mb-3">Nilai & Bayar</h3>
                <p className="text-gray-700">
                  Bayar setelah puas dengan layanan dan berikan ulasan untuk membantu komunitas
                  Tukangin.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Fitur Unggulan Platform</h2>
            <p className="text-lg text-gray-700">
              Kami memadukan teknologi dan layanan personal untuk pengalaman terbaik
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left Column */}
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="p-3 rounded-full bg-blue-100 h-fit">
                  <Search className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Pencarian Cerdas</h3>
                  <p className="text-gray-700">
                    Algoritma AI kami memahami kebutuhan spesifik Anda dan mencocokkannya dengan
                    penyedia jasa terbaik berdasarkan keahlian, lokasi, dan ketersediaan.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="p-3 rounded-full bg-blue-100 h-fit">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Verifikasi Profesional</h3>
                  <p className="text-gray-700">
                    Semua penyedia jasa melewati proses verifikasi 7 tahap, termasuk pengecekan
                    identitas, sertifikasi keahlian, dan evaluasi kinerja berkala.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="p-3 rounded-full bg-blue-100 h-fit">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Pembayaran Aman</h3>
                  <p className="text-gray-700">
                    Bayar setelah layanan selesai dengan berbagai metode pembayaran. Dana hanya
                    dilepaskan ke penyedia jasa setelah Anda menyatakan puas.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="p-3 rounded-full bg-blue-100 h-fit">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Komunikasi Terintegrasi</h3>
                  <p className="text-gray-700">
                    Chat langsung dengan penyedia jasa untuk mendiskusikan detail pekerjaan. Semua
                    komunikasi tercatat dalam sistem untuk referensi.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="p-3 rounded-full bg-blue-100 h-fit">
                  <ThumbsUp className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Jaminan Kepuasan</h3>
                  <p className="text-gray-700">
                    Jika layanan tidak sesuai standar, kami menawarkan perbaikan gratis atau
                    pengembalian dana hingga 100%. Kepuasan Anda adalah prioritas kami.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="p-3 rounded-full bg-blue-100 h-fit">
                  <HelpCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Dukungan 24/7</h3>
                  <p className="text-gray-700">
                    Tim dukungan pelanggan kami siap membantu 24 jam sehari, 7 hari seminggu untuk
                    memastikan pengalaman Anda berjalan lancar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* App Showcase */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Pengalaman Digital Terbaik</h2>
              <p className="text-gray-700 mb-6 text-lg">
                Aplikasi Tukangin dirancang untuk memberikan pengalaman pengguna yang mulus dan
                intuitif. Akses semua fitur dari perangkat apa pun, kapan saja.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700">Antarmuka yang intuitif dan mudah digunakan</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700">
                    Notifikasi real-time untuk setiap tahap layanan
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700">
                    Pelacakan lokasi penyedia jasa secara real-time
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700">
                    Riwayat layanan dan invoice digital terintegrasi
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <Link href="#" className="inline-block">
                  <Image
                    src="/placeholder.svg?height=50&width=150"
                    alt="Download on App Store"
                    width={150}
                    height={50}
                    className="h-12 w-auto"
                  />
                </Link>
                <Link href="#" className="inline-block">
                  <Image
                    src="/placeholder.svg?height=50&width=150"
                    alt="Get it on Google Play"
                    width={150}
                    height={50}
                    className="h-12 w-auto"
                  />
                </Link>
              </div>
            </div>

            <div className="md:w-1/2 relative">
              <div className="bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-3xl p-1 shadow-xl">
                <div className="bg-white/80 backdrop-blur-lg rounded-3xl overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=600&width=400"
                    alt="Tukangin App Interface"
                    width={400}
                    height={600}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-100 rounded-full z-[-1]"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-purple-100 rounded-full z-[-1]"></div>
            </div>
          </div>
        </div>
      </section>

      {/* For Service Providers */}
      <section className="py-16 bg-gradient-to-b from-blue-400/10 to-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Untuk Penyedia Jasa</h2>
            <p className="text-lg text-gray-700">
              Bergabunglah dengan ribuan profesional yang telah meningkatkan pendapatan dan
              memperluas jangkauan bisnis mereka
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-blue-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-blue-600"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">Tingkatkan Pendapatan</h3>
              <p className="text-gray-700 text-center mb-4">
                Penyedia jasa di platform kami rata-rata mengalami peningkatan pendapatan hingga 40%
                dalam 3 bulan pertama.
              </p>
              <div className="text-center">
                <span className="text-sm text-blue-600 font-medium">
                  Komisi terendah di industri: hanya 10%
                </span>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-blue-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-blue-600"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    <path d="M2 12h20"></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">Perluas Jangkauan</h3>
              <p className="text-gray-700 text-center mb-4">
                Dapatkan akses ke basis pelanggan yang luas dan terus berkembang. Bangun reputasi
                online yang kuat.
              </p>
              <div className="text-center">
                <span className="text-sm text-blue-600 font-medium">
                  50.000+ pelanggan aktif di 25+ kota
                </span>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-blue-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-blue-600"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">Kelola dengan Mudah</h3>
              <p className="text-gray-700 text-center mb-4">
                Aplikasi khusus penyedia jasa memudahkan pengelolaan jadwal, pembayaran, dan
                komunikasi dengan pelanggan.
              </p>
              <div className="text-center">
                <span className="text-sm text-blue-600 font-medium">
                  Rata-rata 15 pesanan baru per minggu
                </span>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/provider/register"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
            >
              Daftar Sebagai Penyedia Jasa <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Pertanyaan Umum</h2>
            <p className="text-lg text-gray-700">
              Jawaban untuk pertanyaan yang sering diajukan tentang cara kerja Tukangin
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {/* FAQ Item 1 */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-semibold mb-3">
                  Bagaimana cara menjamin kualitas layanan?
                </h3>
                <p className="text-gray-700">
                  Kami menerapkan sistem verifikasi ketat untuk semua penyedia jasa, termasuk
                  pengecekan identitas, sertifikasi keahlian, dan evaluasi kinerja. Setiap layanan
                  juga dilindungi oleh jaminan kepuasan 100%, di mana Anda bisa mendapatkan
                  perbaikan gratis atau pengembalian dana jika tidak puas.
                </p>
              </div>

              {/* FAQ Item 2 */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-semibold mb-3">
                  Berapa biaya menggunakan platform Tukangin?
                </h3>
                <p className="text-gray-700">
                  Untuk pelanggan, tidak ada biaya untuk mendaftar atau mencari layanan di platform
                  kami. Anda hanya membayar untuk layanan yang Anda pesan. Untuk penyedia jasa, kami
                  mengenakan komisi 10% dari setiap transaksi yang berhasil, yang merupakan salah
                  satu yang terendah di industri.
                </p>
              </div>

              {/* FAQ Item 3 */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-semibold mb-3">
                  Bagaimana jika saya perlu membatalkan pesanan?
                </h3>
                <p className="text-gray-700">
                  Anda dapat membatalkan pesanan hingga 2 jam sebelum waktu layanan tanpa biaya.
                  Pembatalan kurang dari 2 jam sebelum waktu layanan akan dikenakan biaya pembatalan
                  sebesar 25% dari nilai pesanan. Dalam kasus force majeure, kami dapat meninjau dan
                  menghapus biaya pembatalan.
                </p>
              </div>

              {/* FAQ Item 4 */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-semibold mb-3">
                  Apakah Tukangin tersedia di kota saya?
                </h3>
                <p className="text-gray-700">
                  Saat ini, Tukangin tersedia di 25 kota besar di Indonesia, termasuk Jakarta,
                  Surabaya, Bandung, Medan, Makassar, dan Denpasar. Kami terus memperluas jangkauan
                  kami ke kota-kota lain. Anda dapat memeriksa ketersediaan di kota Anda dengan
                  memasukkan kode pos di halaman utama.
                </p>
              </div>

              {/* FAQ Item 5 */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-semibold mb-3">
                  Bagaimana cara membayar untuk layanan?
                </h3>
                <p className="text-gray-700">
                  Kami menawarkan berbagai metode pembayaran, termasuk kartu kredit/debit, transfer
                  bank, e-wallet (GoPay, OVO, DANA, LinkAja), dan pembayaran tunai. Pembayaran hanya
                  dilepaskan ke penyedia jasa setelah Anda mengonfirmasi kepuasan dengan layanan
                  yang diberikan.
                </p>
              </div>
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/faq"
                className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all font-medium"
              >
                Lihat Semua FAQ <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-500 to-blue-700 text-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-lg border border-white/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="md:w-2/3">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Siap Mencoba Tukangin?</h2>
                <p className="text-lg md:text-xl opacity-90 mb-6">
                  Dapatkan layanan profesional untuk kebutuhan Anda dengan mudah dan aman. Mulai
                  sekarang dan rasakan perbedaannya.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/register"
                    className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all font-medium"
                  >
                    Daftar Sekarang
                  </Link>
                  <Link
                    href="/services"
                    className="px-6 py-3 border border-white text-white rounded-lg hover:bg-white/10 transition-all font-medium"
                  >
                    Jelajahi Layanan
                  </Link>
                </div>
              </div>
              <div className="md:w-1/3 flex justify-center">
                <Image
                  src="/placeholder.svg?height=200&width=200"
                  alt="Tukangin App"
                  width={200}
                  height={200}
                  className="w-40 md:w-48"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
