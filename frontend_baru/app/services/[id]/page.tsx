"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, MapPin, Clock, Calendar, Heart, Share2, Check, ThumbsUp, MessageSquare, User } from "lucide-react"
import { CustomerNavbar } from "@/components/customer-navbar"
import { Footer } from "@/components/footer"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

interface ServiceOption {
  id: string
  name: string
  description: string
  price: number
  area: string
  estimatedTime: string
}

interface Review {
  id: string
  userName: string
  date: string
  rating: number
  comment: string
}

interface FAQ {
  question: string
  answer: string
}

interface RelatedService {
  id: string
  title: string
  provider: string
  price: number
  rating: number
}

export default function ServiceDetailPage({ params }: { params: { id: string } }) {
  const [selectedOption, setSelectedOption] = useState<string>("standard")
  const [loading, setLoading] = useState(true)
  const [serviceData, setServiceData] = useState<any>(null)
  const [serviceId, setServiceId] = useState<string>("")

  useEffect(() => {
    // Store params.id in state
    setServiceId(params.id)
  }, [params])

  useEffect(() => {
    // Only run this effect when serviceId is set
    if (!serviceId) return

    // In a real app, this would fetch the specific service by ID
    const fetchServiceData = async () => {
      // Simulated API response
      const data = {
        id: serviceId,
        title: "Perbaikan Atap Bocor Profesional",
        rating: 4.8,
        reviewCount: 124,
        price: 350000,
        priceRange: "Rp350.000 - Rp1.200.000",
        provider: {
          id: "p2",
          name: "Bengkel Jaya",
          rating: 4.7,
          location: "Jakarta Selatan",
          available: true,
        },
        image: "/placeholder.svg?height=400&width=600",
        thumbnails: [
          "/placeholder.svg?height=100&width=100",
          "/placeholder.svg?height=100&width=100",
          "/placeholder.svg?height=100&width=100",
          "/placeholder.svg?height=100&width=100",
        ],
        options: [
          {
            id: "standard",
            name: "Perbaikan Standar",
            description: "Perbaikan untuk kebocoran ringan dengan area hingga 2m²",
            price: 350000,
            area: "2m²",
            estimatedTime: "2-3 jam",
          },
          {
            id: "medium",
            name: "Perbaikan Medium",
            description: "Perbaikan untuk kebocoran sedang dengan area 2-5m²",
            price: 750000,
            area: "2-5m²",
            estimatedTime: "4-6 jam",
          },
          {
            id: "large",
            name: "Perbaikan Besar",
            description: "Perbaikan untuk kebocoran berat dengan area lebih dari 5m²",
            price: 1200000,
            area: ">5m²",
            estimatedTime: "1-2 hari",
          },
        ],
        description:
          "Layanan perbaikan atap bocor dengan teknis berpengalaman. Kami menangani berbagai jenis atap seperti genteng, metal, dan asbes. Perbaikan dilakukan dengan material berkualitas dan garansi hingga 6 bulan.",
        features: [
          "Garansi 6 bulan",
          "Teknisi berpengalaman",
          "Konsultasi gratis",
          "Bahan berkualitas",
          "Pembersihan area setelah pengerjaan",
        ],
        reviews: [
          {
            id: "r1",
            userName: "Ahmad Budiman",
            date: "12 Mei 2023",
            rating: 5,
            comment:
              "Sangat puas dengan layanan perbaikan atap. Teknisi datang tepat waktu dan bekerja dengan rapi. Atap tidak bocor lagi setelah diperbaiki.",
          },
          {
            id: "r2",
            userName: "Siti Rahayu",
            date: "5 Mei 2023",
            rating: 4,
            comment:
              "Perbaikan dilakukan dengan baik, meskipun agak terlambat dari jadwal. Hasil akhirnya memuaskan dan tidak ada kebocoran lagi.",
          },
          {
            id: "r3",
            userName: "Budi Santoso",
            date: "28 April 2023",
            rating: 5,
            comment:
              "Teknisi sangat profesional dan menjelaskan dengan detail penyebab kebocoran. Perbaikan dilakukan dengan cepat dan hasilnya bagus.",
          },
        ],
        faqs: [
          {
            question: "Berapa lama waktu pengerjaan perbaikan atap?",
            answer:
              "Waktu pengerjaan tergantung pada luas area dan tingkat kerusakan. Untuk perbaikan standar biasanya membutuhkan waktu 2-3 jam, perbaikan medium 4-6 jam, dan perbaikan besar 1-2 hari.",
          },
          {
            question: "Apakah ada garansi untuk layanan perbaikan atap?",
            answer:
              "Ya, kami memberikan garansi 6 bulan untuk semua layanan perbaikan atap. Jika terjadi kebocoran lagi dalam masa garansi, kami akan memperbaikinya tanpa biaya tambahan.",
          },
          {
            question: "Apa saja material yang digunakan untuk perbaikan?",
            answer:
              "Kami menggunakan material berkualitas tinggi seperti waterproofing membrane, sealant khusus atap, dan bahan pelapis anti bocor yang tahan lama dan cuaca ekstrem.",
          },
        ],
        relatedServices: [
          {
            id: "rs1",
            title: "Pengecatan Atap",
            provider: "Bengkel Jaya",
            price: 500000,
            rating: 4.6,
          },
          {
            id: "rs2",
            title: "Pemasangan Atap Baru",
            provider: "Bengkel Jaya",
            price: 2500000,
            rating: 4.9,
          },
          {
            id: "rs3",
            title: "Pembersihan Talang Air",
            provider: "Bengkel Jaya",
            price: 250000,
            rating: 4.7,
          },
        ],
      }

      setServiceData(data)
      setLoading(false)
    }

    fetchServiceData()
  }, [serviceId])

  // Format price to IDR
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(price)
      .replace("IDR", "Rp")
  }

  // Render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating)
                ? "text-yellow-400 fill-yellow-400"
                : i < rating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
            }`}
          />
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <CustomerNavbar userName="Dono" />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded mb-4"></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerNavbar userName="Dono" />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Service images and tabs */}
          <div className="lg:col-span-2">
            {/* Main image */}
            <div className="bg-white rounded-lg overflow-hidden mb-4">
              <div className="relative h-[400px] w-full">
                <Image
                  src={serviceData.image || "/placeholder.svg"}
                  alt={serviceData.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {serviceData.thumbnails.map((thumbnail: string, index: number) => (
                <div key={index} className="border border-orange-500 rounded-lg overflow-hidden cursor-pointer">
                  <div className="relative h-24 w-full">
                    <Image
                      src={thumbnail || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="deskripsi" className="bg-white rounded-lg">
              <TabsList className="w-full border-b border-gray-200 rounded-none">
                <TabsTrigger value="deskripsi" className="flex-1 py-3">
                  Deskripsi
                </TabsTrigger>
                <TabsTrigger value="ulasan" className="flex-1 py-3">
                  Ulasan ({serviceData.reviewCount})
                </TabsTrigger>
                <TabsTrigger value="faq" className="flex-1 py-3">
                  FAQ
                </TabsTrigger>
                <TabsTrigger value="penyedia" className="flex-1 py-3">
                  Penyedia
                </TabsTrigger>
              </TabsList>

              {/* Description Tab */}
              <TabsContent value="deskripsi" className="p-6">
                <h3 className="text-xl font-bold mb-4">Deskripsi Layanan</h3>
                <p className="text-gray-700 mb-6">{serviceData.description}</p>

                <h3 className="text-xl font-bold mb-4">Fitur Layanan</h3>
                <ul className="space-y-2 mb-6">
                  {serviceData.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="text-xl font-bold mb-4">Pilihan Layanan</h3>
                <div className="space-y-4">
                  {serviceData.options.map((option: ServiceOption) => (
                    <div
                      key={option.id}
                      className={`border ${
                        selectedOption === option.id ? "border-blue-500" : "border-gray-200"
                      } rounded-lg p-4 cursor-pointer hover:border-blue-300 transition-colors`}
                      onClick={() => setSelectedOption(option.id)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">{option.name}</h4>
                        <span className="font-bold text-green-600">{formatPrice(option.price)}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{option.description}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{option.estimatedTime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="ulasan" className="p-6">
                <div className="flex items-center mb-6">
                  <div className="mr-4">
                    <div className="text-3xl font-bold">{serviceData.rating}</div>
                    <div className="flex mt-1">{renderStars(serviceData.rating)}</div>
                    <div className="text-sm text-gray-500 mt-1">{serviceData.reviewCount} ulasan</div>
                  </div>
                  <div className="ml-auto">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Tulis Ulasan
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {serviceData.reviews.map((review: Review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                      <div className="flex items-start">
                        <div className="bg-gray-200 rounded-full h-10 w-10 flex items-center justify-center mr-3">
                          <User className="h-6 w-6 text-gray-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{review.userName}</h4>
                            <div className="flex">{renderStars(review.rating)}</div>
                          </div>
                          <div className="text-sm text-gray-500 mb-2">{review.date}</div>
                          <p className="text-gray-700">{review.comment}</p>
                          <div className="flex mt-3 space-x-4">
                            <button className="flex items-center text-sm text-gray-500 hover:text-blue-600">
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              <span>Membantu</span>
                            </button>
                            <button className="flex items-center text-sm text-gray-500 hover:text-blue-600">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              <span>Balas</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    Lihat Semua Ulasan
                  </button>
                </div>
              </TabsContent>

              {/* FAQ Tab */}
              <TabsContent value="faq" className="p-6">
                <h3 className="text-xl font-bold mb-4">Pertanyaan yang Sering Diajukan</h3>
                <div className="space-y-4">
                  {serviceData.faqs.map((faq: FAQ, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">{faq.question}</h4>
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Provider Tab */}
              <TabsContent value="penyedia" className="p-6">
                <div className="flex items-center mb-6">
                  <div className="bg-gray-200 rounded-full h-16 w-16 flex items-center justify-center mr-4">
                    <User className="h-10 w-10 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{serviceData.provider.name}</h3>
                    <div className="flex items-center mt-1">
                      {renderStars(serviceData.provider.rating)}
                      <span className="ml-2 text-sm text-gray-500">{serviceData.provider.rating} Rating</span>
                    </div>
                    <div className="flex items-center mt-1 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{serviceData.provider.location}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-semibold mb-3">Tentang Penyedia</h4>
                  <p className="text-gray-700 mb-4">
                    Bengkel Jaya adalah penyedia jasa perbaikan atap profesional dengan pengalaman lebih dari 5 tahun.
                    Kami memiliki tim teknisi yang terlatih dan berpengalaman dalam menangani berbagai jenis perbaikan
                    atap.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-500">Bergabung sejak</div>
                      <div className="font-medium">Januari 2020</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-500">Total Pesanan</div>
                      <div className="font-medium">1,250+</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-500">Waktu Respons</div>
                      <div className="font-medium">&lt; 1 jam</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-500">Tingkat Penyelesaian</div>
                      <div className="font-medium">98%</div>
                    </div>
                  </div>
                  <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Hubungi Penyedia
                  </button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right column - Service details and booking */}
          <div className="lg:col-span-1">
            {/* Service details card */}
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <h1 className="text-2xl font-bold mb-2">{serviceData.title}</h1>
              <div className="flex items-center mb-4">
                <div className="flex">{renderStars(serviceData.rating)}</div>
                <span className="ml-2 text-sm text-gray-500">
                  {serviceData.rating} ({serviceData.reviewCount} ulasan)
                </span>
              </div>

              <div className="text-2xl font-bold text-gray-900 mb-2">{formatPrice(serviceData.price)}</div>
              <div className="text-sm text-gray-500 mb-4">Harga mulai dari {serviceData.priceRange}</div>

              <div className="mb-4">
                <h3 className="font-semibold mb-2">Pilihan yang dipilih:</h3>
                {serviceData.options.map((option: ServiceOption) => {
                  if (option.id === selectedOption) {
                    return (
                      <div key={option.id} className="bg-gray-50 p-3 rounded-lg">
                        <div className="font-medium">{option.name}</div>
                        <div className="text-sm text-gray-600">{option.description}</div>
                        <div className="flex items-center mt-2 text-sm">
                          <Clock className="h-4 w-4 text-gray-500 mr-1" />
                          <span>Estimasi: {option.estimatedTime}</span>
                        </div>
                      </div>
                    )
                  }
                  return null
                })}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-500 mr-2" />
                  <span>Estimasi: 2-3 jam</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                  <span>Jakarta Selatan (Tersedia di lokasi Anda)</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                  <span>Tersedia mulai hari ini</span>
                </div>
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-500 mr-2" />
                  <span>Penyedia akan datang ke lokasi Anda</span>
                </div>
              </div>

              <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mb-3">
                Pesan Sekarang
              </button>

              <div className="flex justify-between">
                <button className="flex items-center justify-center w-[48%] py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Heart className="h-5 w-5 mr-2" />
                  <span>Wishlist</span>
                </button>
                <button className="flex items-center justify-center w-[48%] py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share2 className="h-5 w-5 mr-2" />
                  <span>Bagikan</span>
                </button>
              </div>
            </div>

            {/* Related services */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-4">Layanan Terkait</h3>
              <div className="space-y-4">
                {serviceData.relatedServices.map((service: RelatedService) => (
                  <Link
                    href={`/services/${service.id}`}
                    key={service.id}
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                  >
                    <div className="relative h-16 w-16 bg-gray-100 rounded-lg mr-3 overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=64&width=64"
                        alt={service.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{service.title}</h4>
                      <div className="text-xs text-gray-500">{service.provider}</div>
                      <div className="flex items-center mt-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs ml-1">{service.rating}</span>
                        <span className="mx-1 text-gray-300">•</span>
                        <span className="text-xs font-medium text-green-600">{formatPrice(service.price)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
