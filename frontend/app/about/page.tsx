import Image from 'next/image';
import { NavbarGuest } from '@/components/navbar-guest';
import { Footer } from '@/components/footer';
import { Award, CheckCircle, Mail, Shield, Star, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <NavbarGuest />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-400/40 to-transparent pt-40 pb-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Tentang Tukangin</h1>
            <p className="text-lg text-gray-700 mb-8">
              Revolusi digital dalam dunia jasa profesional Indonesia. Kami menghubungkan jutaan
              pelanggan dengan ribuan ahli terpercaya, menciptakan ekosistem layanan yang
              transparan, aman, dan berkualitas tinggi di seluruh nusantara.
            </p>
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">50K+</div>
                <div className="text-sm text-gray-600">Pelanggan Puas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">5K+</div>
                <div className="text-sm text-gray-600">Penyedia Jasa</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">25+</div>
                <div className="text-sm text-gray-600">Kota di Indonesia</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">4.8★</div>
                <div className="text-sm text-gray-600">Rating Rata-rata</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visi Misi */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex flex-col items-start">
              <div className="p-3 rounded-full bg-blue-100 mb-4">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Visi Kami</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                Menjadi platform digital terdepan yang mengubah cara Indonesia mengakses layanan
                jasa profesional. Kami bermimpi menciptakan masa depan di mana setiap orang dapat
                dengan mudah menemukan ahli terpercaya untuk kebutuhan mereka, sementara para
                profesional mendapat kesempatan yang adil untuk berkembang dan meraih kesuksesan
                finansial yang berkelanjutan.
              </p>
            </div>
            <div className="flex flex-col items-start">
              <div className="p-3 rounded-full bg-blue-100 mb-4">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Misi Kami</h2>
              <ul className="space-y-4 text-gray-700">
                <li className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                  <span>
                    Membangun ekosistem layanan jasa yang transparan, aman, dan terpercaya dengan
                    teknologi terdepan
                  </span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                  <span>
                    Memberdayakan para profesional jasa dengan akses pasar yang lebih luas dan tools
                    untuk berkembang
                  </span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                  <span>
                    Memberikan pengalaman pelanggan yang luar biasa dengan layanan berkualitas dan
                    harga yang fair
                  </span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                  <span>
                    Meningkatkan standar industri jasa melalui sistem verifikasi ketat dan program
                    pelatihan berkelanjutan
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2 flex justify-center">
              <Image
                src="/kantor.png?height=400&width=500"
                alt="Perjalanan Tukangin dari startup hingga platform terpercaya"
                width={500}
                height={400}
                className="rounded-xl shadow-lg"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Perjalanan Kami</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Tukangin lahir dari frustrasi personal para founder ketika mengalami kesulitan
                mencari tukang AC yang terpercaya di tengah malam Jakarta yang panas. Setelah
                menunggu berjam-jam dan mendapat layanan yang mengecewakan, kami menyadari ada
                masalah besar dalam industri jasa di Indonesia.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Didirikan pada Januari 2023 dengan modal awal Rp 500 juta, Tukangin memulai
                perjalanan dari sebuah kantor kecil di Kemang dengan tim 5 orang. Kami menghabiskan
                6 bulan pertama untuk riset mendalam, wawancara dengan 500+ tukang dan 1000+
                pelanggan potensial untuk memahami pain point yang sebenarnya.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Hari ini, setelah 2 tahun beroperasi, Tukangin telah melayani lebih dari 50.000
                pelanggan di 25 kota besar Indonesia. Kami bangga menjadi rumah bagi 5.000+
                profesional jasa yang telah meningkatkan penghasilan mereka rata-rata 40% setelah
                bergabung dengan platform kami.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg mt-6">
                <p className="text-blue-800 font-medium italic">
                  "Dari 1 pesanan per hari di bulan pertama, hingga 1000+ pesanan per hari saat ini.
                  Perjalanan ini membuktikan bahwa Indonesia siap untuk transformasi digital di
                  sektor jasa."
                </p>
                <p className="text-blue-600 text-sm mt-2">- Tim Founder Tukangin</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Mengapa Memilih Tukangin?</h2>
            <p className="text-gray-700 text-lg">
              Kami tidak hanya menghubungkan, tetapi memastikan setiap interaksi menciptakan nilai
              dan kepuasan maksimal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow flex flex-col h-full">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-blue-100">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-3 flex-1">Verifikasi 7 Tahap</h3>
              <p className="text-gray-700 text-center mb-4">
                Setiap penyedia jasa melalui 7 tahap verifikasi ketat: dokumen identitas, sertifikat
                keahlian, tes praktik, background check, referensi, pelatihan platform, dan evaluasi
                berkala.
              </p>
              <div className="text-center">
                <span className="text-sm text-blue-600 font-medium">Tingkat Kelulusan: 15%</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow flex flex-col h-full">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-blue-100">
                  <Star className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-3 flex-1">
                Garansi Kepuasan 100%
              </h3>
              <p className="text-gray-700 text-center mb-4">
                Jaminan uang kembali jika tidak puas, asuransi kerusakan hingga Rp 10 juta, dan tim
                customer success 24/7 yang siap membantu menyelesaikan masalah apapun.
              </p>
              <div className="text-center">
                <span className="text-sm text-blue-600 font-medium">Tingkat Kepuasan: 4.8/5</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow flex flex-col h-full">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-blue-100">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-3 flex-1">Respons Super Cepat</h3>
              <p className="text-gray-700 text-center mb-4">
                AI matching system kami mencarikan penyedia jasa terbaik dalam 3 menit, dengan
                rata-rata waktu kedatangan 45 menit untuk layanan darurat.
              </p>
              <div className="text-center">
                <span className="text-sm text-blue-600 font-medium">
                  Rata-rata Respons: 3 menit
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gradient-to-b from-blue-400/10 to-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Tim Visioner Kami</h2>
            <p className="text-gray-700 text-lg">
              Dipimpin oleh para ahli berpengalaman dari berbagai industri, kami berkomitmen
              menghadirkan inovasi terdepan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Team Member 1 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="h-56 relative">
                <Image
                  src="/placeholder.svg?height=224&width=300"
                  alt="Andi Wijaya - CEO Tukangin"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1">Andi Wijaya</h3>
                <p className="text-blue-600 mb-3 text-sm">CEO & Co-founder</p>
                <p className="text-gray-700 text-sm mb-3">
                  Ex-Product Director Gojek dengan 12 tahun pengalaman membangun produk digital yang
                  digunakan jutaan orang. Alumni Stanford MBA.
                </p>
                <div className="flex gap-2">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Strategy
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Leadership
                  </span>
                </div>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="h-56 relative">
                <Image
                  src="/placeholder.svg?height=224&width=300"
                  alt="Budi Santoso - CTO Tukangin"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1">Budi Santoso</h3>
                <p className="text-blue-600 mb-3 text-sm">CTO & Co-founder</p>
                <p className="text-gray-700 text-sm mb-3">
                  Former Senior Engineer di Google Singapore. Expert dalam AI/ML dan sistem
                  terdistribusi. Pemegang 3 paten teknologi.
                </p>
                <div className="flex gap-2">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    AI/ML
                  </span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Backend
                  </span>
                </div>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="h-56 relative">
                <Image
                  src="/placeholder.svg?height=224&width=300"
                  alt="Dewi Lestari - COO Tukangin"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1">Dewi Lestari</h3>
                <p className="text-blue-600 mb-3 text-sm">COO</p>
                <p className="text-gray-700 text-sm mb-3">
                  Ex-Operations Director Tokopedia dengan track record scaling operations dari 0
                  hingga 10M+ transaksi. Expert dalam process optimization.
                </p>
                <div className="flex gap-2">
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                    Operations
                  </span>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                    Scaling
                  </span>
                </div>
              </div>
            </div>

            {/* Team Member 4 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="h-56 relative">
                <Image
                  src="/placeholder.svg?height=224&width=300"
                  alt="Eko Priyanto - Head of Marketing Tukangin"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1">Eko Priyanto</h3>
                <p className="text-blue-600 mb-3 text-sm">Head of Marketing</p>
                <p className="text-gray-700 text-sm mb-3">
                  Growth hacker berpengalaman yang berhasil mengakuisisi 1M+ users untuk 3 startup
                  unicorn. Specialist dalam digital marketing dan viral growth.
                </p>
                <div className="flex gap-2">
                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                    Growth
                  </span>
                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                    Marketing
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Mari Berkolaborasi</h2>
                <p className="text-gray-700 text-lg">
                  Punya ide kerjasama, pertanyaan bisnis, atau ingin bergabung dengan tim kami? Kami
                  selalu terbuka untuk diskusi yang membangun masa depan industri jasa Indonesia.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-4">
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
                        className="text-blue-600"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Telepon & WhatsApp</p>
                      <p className="text-lg font-medium">+62 811 8888 1234</p>
                      <p className="text-sm text-gray-500">Senin-Jumat: 08:00-20:00 WIB</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-blue-100">
                      <Mail className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-lg font-medium">hello@tukangin.id</p>
                      <p className="text-sm text-gray-500">Partnership: partner@tukangin.id</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
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
                        className="text-blue-600"
                      >
                        <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Kantor Pusat</p>
                      <p className="text-lg font-medium">Menara BCA Lt. 25</p>
                      <p className="text-sm text-gray-500">Jl. MH Thamrin No. 1, Jakarta Pusat</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-blue-800 font-medium mb-2">
                      Jam Operasional Customer Service:
                    </p>
                    <p className="text-blue-700 text-sm">24/7 melalui aplikasi dan website</p>
                    <p className="text-blue-700 text-sm">Telepon: Senin-Minggu 06:00-24:00 WIB</p>
                  </div>
                </div>

                <div>
                  <form className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Nama Lengkap *
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Masukkan nama lengkap Anda"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="nama@email.com"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Subjek
                      </label>
                      <select
                        id="subject"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Pilih topik...</option>
                        <option value="partnership">Kerjasama Bisnis</option>
                        <option value="career">Karir & Lowongan</option>
                        <option value="media">Media & Press</option>
                        <option value="feedback">Saran & Masukan</option>
                        <option value="other">Lainnya</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Pesan *
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ceritakan lebih detail tentang yang ingin Anda diskusikan..."
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
                    >
                      Kirim Pesan
                    </button>

                    <p className="text-xs text-gray-500 text-center">
                      Kami akan merespons dalam 24 jam pada hari kerja
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
