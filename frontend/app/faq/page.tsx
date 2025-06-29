import { NavbarGuest } from '@/components/navbar-guest';
import { Footer } from '@/components/footer';

import Image from 'next/image';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

export default function FAQPage() {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50/60 to-white">
      <NavbarGuest />
      {/* Hero Section */}
      <section className="pt-40 pb-12">
        <div className="container mx-auto px-4 md:px-8 max-w-2xl flex flex-col items-center text-center">
          <div className="mb-6">
            <Image
              src="/logo-tukangin.png"
              alt="FAQ Tukangin"
              width={80}
              height={80}
              className="mx-auto rounded-2xl shadow-lg bg-white p-2"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">FAQ</h1>
          <p className="text-lg text-gray-700 mb-6">
            Temukan jawaban atas pertanyaan yang sering diajukan tentang layanan Tukangin.
          </p>
          <Badge variant="secondary" className="mb-2">
            Diperbarui: 29 Juni 2025
          </Badge>
        </div>
      </section>
      {/* Accordion FAQ */}
      <section className="pb-8">
        <div className="container mx-auto px-4 md:px-8 max-w-2xl">
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Apa itu Tukangin?</AccordionTrigger>
              <AccordionContent>
                Tukangin adalah platform digital yang mempertemukan pelanggan dengan penyedia jasa
                profesional di berbagai bidang seperti listrik, AC, renovasi, dan lainnya.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Bagaimana cara memesan layanan?</AccordionTrigger>
              <AccordionContent>
                Pilih layanan yang diinginkan, atur jadwal, dan lakukan pembayaran langsung melalui
                aplikasi atau website Tukangin.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Bagaimana jika saya tidak puas dengan layanan?</AccordionTrigger>
              <AccordionContent>
                Tukangin memberikan garansi kepuasan. Jika ada masalah, tim customer success siap
                membantu hingga tuntas.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Bagaimana cara menghubungi dukungan?</AccordionTrigger>
              <AccordionContent>
                Anda dapat menghubungi kami melalui halaman kontak atau email support@tukangin.id.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>Apakah Tukangin tersedia di seluruh Indonesia?</AccordionTrigger>
              <AccordionContent>
                Saat ini layanan Tukangin tersedia di kota-kota besar, dan terus berkembang ke
                wilayah lain.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-8">
        <div className="container mx-auto px-4 md:px-8 max-w-2xl text-center">
          <h3 className="text-xl font-bold mb-2">Tidak menemukan jawaban?</h3>
          <p className="text-gray-700 mb-2">Tim kami siap membantu Anda secara langsung.</p>
          <a
            href="/contact"
            className="inline-block px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
          >
            Hubungi Kami
          </a>
        </div>
      </section>
      <Footer />
    </main>
  );
}
