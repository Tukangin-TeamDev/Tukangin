import { NavbarGuest } from '@/components/navbar-guest';
import { Footer } from '@/components/footer';

import Image from 'next/image';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50/60 to-white">
      <NavbarGuest />
      {/* Hero Section */}
      <section className="pt-40 pb-12">
        <div className="container mx-auto px-4 md:px-8 max-w-2xl flex flex-col items-center text-center">
          <div className="mb-6">
            <Image
              src="/logo-tukangin.png"
              alt="Kebijakan Privasi Tukangin"
              width={80}
              height={80}
              className="mx-auto rounded-2xl shadow-lg bg-white p-2"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Kebijakan Privasi</h1>
          <p className="text-lg text-gray-700 mb-6">
            Bagaimana kami menjaga dan melindungi data pribadi Anda di platform Tukangin.
          </p>
          <Badge variant="secondary" className="mb-2">
            Terakhir diperbarui: 29 Juni 2025
          </Badge>
        </div>
      </section>
      {/* Highlight Cards */}
      <section className="pb-8">
        <div className="container mx-auto px-4 md:px-8 grid md:grid-cols-3 gap-6 max-w-5xl">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Transparansi Data</CardTitle>
              <CardDescription>
                Kami menjelaskan data apa saja yang dikumpulkan dan tujuannya.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-4 text-gray-700 text-sm">
                <li>Nama, kontak, alamat, riwayat transaksi.</li>
                <li>Data penggunaan aplikasi untuk peningkatan layanan.</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Keamanan &amp; Perlindungan</CardTitle>
              <CardDescription>
                Data Anda dienkripsi dan dilindungi dengan standar industri.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-4 text-gray-700 text-sm">
                <li>Enkripsi data sensitif.</li>
                <li>Kontrol akses dan audit berkala.</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Kontrol Pengguna</CardTitle>
              <CardDescription>
                Anda dapat mengakses, memperbarui, atau menghapus data pribadi Anda.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-4 text-gray-700 text-sm">
                <li>Permintaan akses &amp; penghapusan data lewat halaman kontak.</li>
                <li>Hak untuk menarik persetujuan kapan saja.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
      {/* Visual Section */}
      <section className="py-8">
        <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center gap-8 max-w-5xl">
          <div className="flex-1">
            <Image
              src="/kantor.png"
              alt="Keamanan Data"
              width={400}
              height={320}
              className="rounded-xl shadow-md w-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">Komitmen Keamanan Data</h2>
            <p className="text-gray-700 mb-2">
              Tukangin berkomitmen menjaga keamanan dan privasi data Anda melalui teknologi dan
              kebijakan internal terbaik.
            </p>
            <ul className="list-disc pl-5 text-gray-700 text-sm">
              <li>Audit keamanan rutin &amp; pelatihan staf.</li>
              <li>Proses pelaporan insiden keamanan yang transparan.</li>
            </ul>
          </div>
        </div>
      </section>
      {/* Accordion FAQ Privacy */}
      <section className="py-8 bg-white/80 border-t border-b">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl">
          <h2 className="text-2xl font-bold mb-6 text-center">Pertanyaan Umum tentang Privasi</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Apakah data saya dijual ke pihak ketiga?</AccordionTrigger>
              <AccordionContent>
                Tidak. Tukangin tidak pernah menjual atau membagikan data pribadi Anda tanpa izin
                kecuali diwajibkan hukum.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Bagaimana cara meminta penghapusan data?</AccordionTrigger>
              <AccordionContent>
                Anda dapat menghubungi kami melalui halaman kontak atau email DPO untuk permintaan
                penghapusan data.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Bagaimana keamanan pembayaran saya?</AccordionTrigger>
              <AccordionContent>
                Semua transaksi menggunakan enkripsi dan mitra pembayaran tepercaya.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
      {/* DPO Contact */}
      <section className="py-8">
        <div className="container mx-auto px-4 md:px-8 max-w-2xl text-center">
          <h3 className="text-xl font-bold mb-2">Hubungi Data Protection Officer (DPO)</h3>
          <p className="text-gray-700 mb-2">
            Jika Anda memiliki pertanyaan terkait perlindungan data, hubungi kami:
          </p>
          <a href="mailto:dpo@tukangin.id" className="text-blue-600 font-medium underline">
            dpo@tukangin.id
          </a>
        </div>
      </section>
      <Footer />
    </main>
  );
}
