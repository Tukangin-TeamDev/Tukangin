import { NavbarGuest } from '@/components/navbar-guest';
import { Footer } from '@/components/footer';

import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function TermsPage() {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50/60 to-white">
      <NavbarGuest />
      {/* Hero Section */}
      <section className="pt-40 pb-12">
        <div className="container mx-auto px-4 md:px-8 max-w-2xl flex flex-col items-center text-center">
          <div className="mb-6">
            <Image
              src="/logo-tukangin.png"
              alt="Syarat & Ketentuan Tukangin"
              width={80}
              height={80}
              className="mx-auto rounded-2xl shadow-lg bg-white p-2"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Syarat &amp; Ketentuan</h1>
          <p className="text-lg text-gray-700 mb-6">
            Ketentuan penggunaan dan hak/kewajiban pengguna platform Tukangin.
          </p>
          <Badge variant="secondary" className="mb-2">
            Terakhir diperbarui: 29 Juni 2025
          </Badge>
        </div>
      </section>
      {/* Daftar Isi */}
      <section className="pb-8">
        <div className="container mx-auto px-4 md:px-8 max-w-2xl">
          <div className="mb-6 bg-white/80 rounded-lg shadow p-4 flex flex-col md:flex-row gap-3 items-center justify-center">
            <span className="font-semibold text-gray-700">Navigasi Cepat:</span>
            <div className="flex flex-wrap gap-2">
              <a href="#definisi" className="text-blue-600 hover:underline text-sm">
                Definisi
              </a>
              <a href="#penggunaan" className="text-blue-600 hover:underline text-sm">
                Penggunaan
              </a>
              <a href="#pembayaran" className="text-blue-600 hover:underline text-sm">
                Pembayaran
              </a>
              <a href="#pembatalan" className="text-blue-600 hover:underline text-sm">
                Pembatalan &amp; Refund
              </a>
              <a href="#lain-lain" className="text-blue-600 hover:underline text-sm">
                Lain-lain
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* Section Pasal Penting */}
      <section className="pb-8">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl grid md:grid-cols-2 gap-6">
          <Card id="definisi">
            <CardHeader>
              <CardTitle>Definisi</CardTitle>
              <CardDescription>Penjelasan istilah penting dalam platform Tukangin.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-4 text-gray-700 text-sm">
                <li>
                  <b>Pelanggan</b>: Pengguna yang memesan layanan di Tukangin.
                </li>
                <li>
                  <b>Penyedia Jasa</b>: Mitra profesional yang menawarkan layanan.
                </li>
                <li>
                  <b>Platform</b>: Website dan aplikasi Tukangin.
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card id="penggunaan">
            <CardHeader>
              <CardTitle>Penggunaan Platform</CardTitle>
              <CardDescription>Hak dan kewajiban pengguna serta penyedia jasa.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-4 text-gray-700 text-sm">
                <li>Pelanggan wajib memberikan data yang benar dan akurat.</li>
                <li>Penyedia jasa wajib memenuhi standar layanan dan etika Tukangin.</li>
                <li>
                  Dilarang melakukan transaksi di luar platform untuk layanan yang dipesan melalui
                  Tukangin.
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card id="pembayaran">
            <CardHeader>
              <CardTitle>Pembayaran</CardTitle>
              <CardDescription>Proses dan keamanan pembayaran.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-4 text-gray-700 text-sm">
                <li>Pembayaran dilakukan melalui metode resmi yang disediakan di aplikasi.</li>
                <li>
                  Pembayaran hanya dilepaskan ke penyedia jasa setelah layanan selesai dan
                  dikonfirmasi pelanggan.
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card id="pembatalan">
            <CardHeader>
              <CardTitle>Pembatalan &amp; Pengembalian Dana</CardTitle>
              <CardDescription>Kebijakan pembatalan dan refund.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-4 text-gray-700 text-sm">
                <li>
                  Pembatalan dapat dilakukan sebelum layanan dimulai sesuai kebijakan yang berlaku.
                </li>
                <li>Pengembalian dana mengikuti ketentuan dan proses verifikasi dari Tukangin.</li>
              </ul>
            </CardContent>
          </Card>
          <Card id="lain-lain">
            <CardHeader>
              <CardTitle>Lain-lain</CardTitle>
              <CardDescription>Ketentuan tambahan dan perubahan syarat.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-4 text-gray-700 text-sm">
                <li>
                  Tukangin berhak mengubah syarat &amp; ketentuan sewaktu-waktu dengan pemberitahuan
                  di platform.
                </li>
                <li>Pengguna diimbau untuk selalu membaca pembaruan syarat &amp; ketentuan.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-8">
        <div className="container mx-auto px-4 md:px-8 max-w-2xl text-center">
          <h3 className="text-xl font-bold mb-2">Butuh klarifikasi atau bantuan hukum?</h3>
          <p className="text-gray-700 mb-2">
            Silakan hubungi tim legal kami untuk pertanyaan lebih lanjut.
          </p>
          <a href="mailto:legal@tukangin.id" className="text-blue-600 font-medium underline">
            legal@tukangin.id
          </a>
        </div>
      </section>
      <Footer />
    </main>
  );
}
