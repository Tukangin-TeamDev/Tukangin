"use client"

import { useState } from "react"
import { Search, ChevronDown, MessageSquare, Mail, Phone, FileText } from "lucide-react"

interface FAQ {
  question: string
  answer: string
  category: string
}

export default function AdminHelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [expandedFAQs, setExpandedFAQs] = useState<string[]>([])

  const categories = [
    { id: "general", name: "Umum" },
    { id: "services", name: "Layanan" },
    { id: "orders", name: "Pesanan" },
    { id: "payment", name: "Pembayaran" },
    { id: "account", name: "Akun" },
  ]

  const faqs: FAQ[] = [
    {
      question: "Bagaimana cara menambahkan layanan baru?",
      answer:
        "Untuk menambahkan layanan baru, masuk ke dashboard provider dan klik 'Tambah Layanan' di bagian atas halaman. Isi formulir dengan informasi layanan seperti nama, deskripsi, harga, dan kategori. Anda juga dapat mengunggah gambar untuk layanan tersebut. Setelah selesai, klik 'Simpan' untuk mempublikasikan layanan baru Anda.",
      category: "services",
    },
    {
      question: "Bagaimana cara mengubah status pesanan?",
      answer:
        "Untuk mengubah status pesanan, buka halaman 'Pesanan Masuk' di dashboard provider. Temukan pesanan yang ingin diubah statusnya, lalu klik tombol 'Detail'. Pada halaman detail pesanan, Anda akan melihat opsi untuk mengubah status pesanan menjadi 'Sedang Dikerjakan', 'Selesai', atau status lainnya sesuai dengan alur kerja yang telah Anda tetapkan.",
      category: "orders",
    },
    {
      question: "Bagaimana cara mencairkan pendapatan saya?",
      answer:
        "Pendapatan Anda dapat dicairkan melalui menu 'Keuangan' di dashboard provider. Klik pada 'Tarik Dana' dan pilih metode penarikan yang tersedia (transfer bank, e-wallet, dll). Penarikan dana hanya dapat dilakukan setelah pesanan selesai dan melewati masa garansi. Proses pencairan biasanya membutuhkan waktu 1-3 hari kerja tergantung metode penarikan yang dipilih.",
      category: "payment",
    },
    {
      question: "Bagaimana cara meningkatkan peringkat toko saya?",
      answer:
        "Untuk meningkatkan peringkat toko Anda, pastikan untuk memberikan layanan berkualitas tinggi dan responsif terhadap pesanan pelanggan. Faktor-faktor yang mempengaruhi peringkat toko meliputi: rating dan ulasan positif dari pelanggan, tingkat penyelesaian pesanan, waktu respons terhadap pesan pelanggan, dan kelengkapan profil toko Anda. Secara rutin memperbarui informasi layanan dan mengunggah portofolio pekerjaan juga dapat membantu meningkatkan visibilitas toko Anda.",
      category: "general",
    },
    {
      question: "Apa saja biaya yang dikenakan untuk penyedia jasa?",
      answer:
        "Tukangin mengenakan biaya komisi sebesar 10% dari setiap transaksi yang berhasil diselesaikan. Biaya ini akan otomatis dipotong dari pembayaran yang Anda terima. Tidak ada biaya pendaftaran atau biaya bulanan untuk menjadi penyedia jasa di platform kami. Biaya tambahan mungkin berlaku untuk layanan premium seperti promosi atau penempatan iklan khusus, yang dapat Anda pilih secara opsional untuk meningkatkan visibilitas layanan Anda.",
      category: "payment",
    },
    {
      question: "Bagaimana cara menangani keluhan pelanggan?",
      answer:
        "Untuk menangani keluhan pelanggan, segera tanggapi pesan mereka dan tunjukkan empati terhadap masalah yang dihadapi. Tawarkan solusi konkret dan, jika memungkinkan, kompensasi yang sesuai seperti perbaikan gratis atau diskon untuk layanan berikutnya. Jika masalah tidak dapat diselesaikan langsung, Anda dapat menghubungi tim dukungan Tukangin untuk mediasi. Ingat bahwa penanganan keluhan yang baik dapat mengubah pelanggan yang tidak puas menjadi pelanggan loyal.",
      category: "orders",
    },
  ]

  const toggleFAQ = (question: string) => {
    setExpandedFAQs((prev) => (prev.includes(question) ? prev.filter((q) => q !== question) : [...prev, question]))
  }

  const toggleCategory = (categoryId: string) => {
    setActiveCategory(activeCategory === categoryId ? null : categoryId)
  }

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !activeCategory || faq.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-8 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-4">Pusat Bantuan Provider</h1>
        <p className="mb-6">Temukan jawaban untuk pertanyaan umum atau hubungi tim dukungan kami</p>

        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Cari pertanyaan atau kata kunci..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-3 px-6 pr-12 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <Search className="absolute right-4 top-3 h-6 w-6 text-gray-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="font-semibold mb-4">Kategori</h2>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-md ${
                      activeCategory === category.id ? "bg-orange-100 text-orange-700" : "hover:bg-gray-100"
                    }`}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 mt-6">
            <h2 className="font-semibold mb-4">Butuh Bantuan Lainnya?</h2>
            <ul className="space-y-3">
              <li>
                <a href="#" className="flex items-center gap-2 text-orange-600 hover:underline">
                  <MessageSquare className="h-4 w-4" />
                  <span>Live Chat</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 text-orange-600 hover:underline">
                  <Mail className="h-4 w-4" />
                  <span>Email Support</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 text-orange-600 hover:underline">
                  <Phone className="h-4 w-4" />
                  <span>Hubungi Kami</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 text-orange-600 hover:underline">
                  <FileText className="h-4 w-4" />
                  <span>Panduan Provider</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* FAQs */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Pertanyaan yang Sering Diajukan</h2>

            {filteredFAQs.length > 0 ? (
              <div className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <div key={faq.question} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleFAQ(faq.question)}
                      className="w-full flex justify-between items-center p-4 text-left bg-gray-50 hover:bg-gray-100"
                    >
                      <h3 className="font-medium">{faq.question}</h3>
                      <ChevronDown
                        className={`h-5 w-5 text-gray-500 transition-transform ${
                          expandedFAQs.includes(faq.question) ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {expandedFAQs.includes(faq.question) && (
                      <div className="p-4 bg-white">
                        <p className="text-gray-700">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">Tidak ada hasil ditemukan</h3>
                <p className="text-gray-500">Coba gunakan kata kunci yang berbeda atau hubungi tim dukungan kami</p>
              </div>
            )}
          </div>

          <div className="bg-orange-50 rounded-lg p-6 mt-6">
            <h2 className="text-lg font-semibold mb-4">Masih Memiliki Pertanyaan?</h2>
            <p className="mb-4">
              Tim dukungan kami siap membantu Anda dengan pertanyaan atau masalah yang Anda hadapi.
            </p>
            <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors">
              Hubungi Dukungan
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
