import { NavbarGuest } from '@/components/navbar-guest';
import { Footer } from '@/components/footer';

export default function CareerPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <NavbarGuest />
      <section className="bg-gradient-to-b from-blue-400/40 to-transparent pt-40 pb-16">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">Karir di Tukangin</h1>
          <p className="text-lg text-gray-700 mb-8 text-center">
            Bergabunglah dengan tim Tukangin dan berkontribusi dalam merevolusi industri jasa di
            Indonesia.
          </p>
          <div className="prose max-w-none text-gray-800">
            <p>
              Saat ini belum ada lowongan terbuka. Silakan cek kembali di lain waktu atau kirimkan
              CV ke{' '}
              <a href="mailto:hr@tukangin.id" className="text-blue-600">
                hr@tukangin.id
              </a>
              .
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
