"use client"

import { useState } from "react"
import { Search, ChevronDown, MessageSquare, Mail, Phone, FileText } from "lucide-react"

interface FAQ {
  question: string
  answer: string
  category: string
}

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [expandedFAQs, setExpandedFAQs] = useState<string[]>([])

  const categories = [
    { id: "general", name: "Umum" },
    { id: "account", name: "Akun" },
    { id: "orders", name: "Pesanan" },
    { id: "payment", name: "Pembayaran" },
    { id: "services", name: "Layanan" },
  ]

  const faqs: FAQ[] = [
    {
      question: "Apa itu Tukangin?",
      answer:
        "Tukangin adalah platform yang menghubungkan pelanggan dengan jasa tukang profesional untuk berbagai kebutuhan perbaikan dan renovasi rumah. Kami menyediakan berbagai layanan seperti perbaikan listrik, pipa air, AC, dan renovasi rumah.",
      category: "general",
    },
    {
      question: "Bagaimana cara mendaftar di Tukangin?",
      answer:
        "Untuk mendaftar di Tukangin, klik tombol 'Daftar' di pojok kanan atas halaman. Isi formulir pendaftaran dengan informasi yang diminta seperti nama, email, dan nomor telepon. Setelah itu, Anda akan menerima email verifikasi untuk mengaktifkan akun Anda.",
      category: "account",
    },
    {
      question: "Bagaimana cara memesan layanan?",
      answer:
        "Untuk memesan layanan, pilih kategori layanan yang Anda butuhkan di halaman utama atau gunakan fitur pencarian. Pilih penyedia jasa yang sesuai dengan kebutuhan Anda, lalu klik tombol 'Pesan'. Isi detail pesanan dan konfirmasi pemesanan Anda.",
      category: "orders",
    },
    {
      question: "Metode pembayaran apa saja yang tersedia?",
      answer:
        "Tukangin menerima berbagai metode pembayaran seperti transfer bank, kartu kredit/debit, e-wallet (OVO, GoPay, DANA), dan pembayaran tunai setelah layanan selesai (COD). Pilih metode pembayaran yang paling nyaman untuk Anda saat checkout.",
      category: "payment",
    },
    {
      question: "Bagaimana jika saya tidak puas dengan layanan?",
      answer:
        "Kepuasan pelanggan adalah prioritas kami. Jika Anda tidak puas dengan layanan yang diberikan, silakan hubungi tim dukungan kami dalam waktu 48 jam setelah layanan selesai. Kami akan meninjau kasus Anda dan memberikan solusi terbaik, termasuk kemungkinan pengerjaan ulang atau pengembalian dana.",
      category: "services",
    },
    {
      question: "Apakah layanan Tukangin tersedia di semua kota?",
      answer:
        "Saat ini, layanan Tukangin tersedia di kota-kota besar di Indonesia seperti Jakarta, Surabaya, Bandung, Medan, dan Makassar. Kami terus memperluas jangkauan layanan kami ke kota-kota lain. Silakan periksa ketersediaan layanan di area Anda melalui fitur pencarian lokasi di aplikasi atau website kami.",
      category: "general",
    },
    {
      question: "Bagaimana cara mengubah password akun saya?",
      answer:
        "Untuk mengubah password, masuk ke akun Anda dan klik pada 'Profil' di menu navigasi. Pilih tab 'Keamanan' dan klik tombol 'Ubah Password'. Masukkan password lama Anda, kemudian masukkan dan konfirmasi password baru Anda.",
      category: "account",
    },
    {
      question: "Bagaimana cara membatalkan pesanan?",
      answer:
        "Untuk membatalkan pesanan, masuk ke akun Anda dan klik 'Pesanan Saya'. Temukan pesanan yang ingin dibatalkan dan klik tombol 'Batalkan'. Perlu diingat bahwa pembatalan mungkin dikenakan biaya tergantung pada waktu pembatalan dan kebijakan penyedia jasa.",
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
      <div className="bg-gradient-to-r from-blue-600 to-green-500 rounded-xl p-8 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-4">Pusat Bantuan</h1>
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
                      activeCategory === category.id ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
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
                <a href="#" className="flex items-center gap-2 text-blue-600 hover:underline">
                  <MessageSquare className="h-4 w-4" />
                  <span>Live Chat</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 text-blue-600 hover:underline">
                  <Mail className="h-4 w-4" />
                  <span>Email Support</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 text-blue-600 hover:underline">
                  <Phone className="h-4 w-4" />
                  <span>Hubungi Kami</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 text-blue-600 hover:underline">
                  <FileText className="h-4 w-4" />
                  <span>Panduan Pengguna</span>
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

          <div className="bg-blue-50 rounded-lg p-6 mt-6">
            <h2 className="text-lg font-semibold mb-4">Masih Memiliki Pertanyaan?</h2>
            <p className="mb-4">
              Tim dukungan kami siap membantu Anda dengan pertanyaan atau masalah yang Anda hadapi.
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Hubungi Dukungan
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
