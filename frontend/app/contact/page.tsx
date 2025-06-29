import { NavbarGuest } from '@/components/navbar-guest';
import { Footer } from '@/components/footer';

export default function ContactPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <NavbarGuest />
      <section className="bg-gradient-to-b from-blue-400/40 to-transparent pt-40 pb-16">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">Kontak</h1>
          <p className="text-lg text-gray-700 mb-8 text-center">
            Hubungi tim Tukangin untuk pertanyaan, saran, atau bantuan lebih lanjut.
          </p>
          <div className="prose max-w-none text-gray-800">
            <p>
              Email:{' '}
              <a href="mailto:support@tukangin.id" className="text-blue-600">
                support@tukangin.id
              </a>
            </p>
            <p>
              Telepon:{' '}
              <a href="tel:+6281234567890" className="text-blue-600">
                +62 812-3456-7890
              </a>
            </p>
            <p>Alamat: Jl. Kemang Raya No. 12, Jakarta Selatan, Indonesia</p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
