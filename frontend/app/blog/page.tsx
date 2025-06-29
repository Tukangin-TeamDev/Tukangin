import { NavbarGuest } from '@/components/navbar-guest';
import { Footer } from '@/components/footer';

export default function BlogPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <NavbarGuest />
      <section className="bg-gradient-to-b from-blue-400/40 to-transparent pt-40 pb-16">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">Blog Tukangin</h1>
          <p className="text-lg text-gray-700 mb-8 text-center">
            Temukan tips, berita, dan update terbaru seputar dunia jasa profesional dan Tukangin.
          </p>
          <div className="prose max-w-none text-gray-800">
            <p>Belum ada artikel. Nantikan update terbaru dari kami!</p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
