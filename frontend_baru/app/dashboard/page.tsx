"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Zap, Droplet, HomeIcon, Shield, Clock, ShoppingBag } from "lucide-react"

// Types for our service data
interface ServiceProvider {
  id: string
  name: string
  rating: number
  location: string
  available: boolean
}

interface Service {
  id: string
  title: string
  category: "electrical" | "plumbing" | "home" | "security" | "carpentry" | "gardening" | "moving" | "appliance"
  categoryLabel: string
  provider: ServiceProvider
  price: number
  image: string
  rating: number
}

interface Order {
  id: string
  service: string
  provider: string
  date: string
  status: "completed" | "in-progress" | "scheduled" | "cancelled"
  price: number
  image: string
}

export default function DashboardPage() {
  const [userName, setUserName] = useState("Andi")
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("recent")

  // Simulate fetching data
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchData = async () => {
      // Simulated API response for orders
      const ordersData: Order[] = [
        {
          id: "o1",
          service: "Perbaikan Atap Bocor",
          provider: "Bengkel Jaya",
          date: "12 Mei 2023",
          status: "in-progress",
          price: 350000,
          image: "/placeholder.svg?height=80&width=80",
        },
        {
          id: "o2",
          service: "Instalasi Listrik Rumah",
          provider: "Elektrindo Mandiri",
          date: "10 Mei 2023",
          status: "scheduled",
          price: 750000,
          image: "/placeholder.svg?height=80&width=80",
        },
        {
          id: "o3",
          service: "Service AC",
          provider: "Teknik Dingin",
          date: "5 Mei 2023",
          status: "completed",
          price: 250000,
          image: "/placeholder.svg?height=80&width=80",
        },
      ]

      setOrders(ordersData)
      setLoading(false)
    }

    fetchData()
  }, [])

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

  // Service category icons and counts
  const serviceCategories = [
    { id: "electrical", name: "Listrik", icon: Zap, count: 45 },
    { id: "plumbing", name: "Pipa Air", icon: Droplet, count: 32 },
    { id: "home", name: "AC", icon: HomeIcon, count: 28 },
    { id: "security", name: "Renovasi", icon: Shield, count: 56 },
  ]

  // Status badge color
  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-500"
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-500"
      case "scheduled":
        return "bg-yellow-100 text-yellow-800 border-yellow-500"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-500"
      default:
        return "bg-gray-100 text-gray-800 border-gray-500"
    }
  }

  // Status text
  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "completed":
        return "Selesai"
      case "in-progress":
        return "Sedang Dikerjakan"
      case "scheduled":
        return "Menunggu Konfirmasi"
      case "cancelled":
        return "Dibatalkan"
      default:
        return status
    }
  }

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-blue-600 to-green-500 rounded-xl p-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-white mb-6 md:mb-0">
            <h1 className="text-3xl font-bold mb-2">Selamat Datang, {userName}!</h1>
            <p className="text-blue-100 mb-6">Temukan layanan terbaik untuk kebutuhan rumah dan bisnis Anda.</p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/marketplace"
                className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium flex items-center gap-2 hover:bg-blue-50 transition-colors"
              >
                <ShoppingBag className="h-5 w-5" />
                Cari Layanan
              </Link>
              <button className="bg-transparent text-white border border-white px-4 py-2 rounded-md font-medium flex items-center gap-2 hover:bg-white/10 transition-colors">
                <Clock className="h-5 w-5" />
                Jadwalkan Layanan
              </button>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3">
                <h2 className="text-3xl font-bold text-white">7</h2>
                <p className="text-xs text-blue-100">Total Pesanan</p>
              </div>
              <div className="p-3">
                <h2 className="text-3xl font-bold text-white">4</h2>
                <p className="text-xs text-blue-100">Selesai</p>
              </div>
              <div className="p-3">
                <h2 className="text-3xl font-bold text-white">3</h2>
                <p className="text-xs text-blue-100">Aktif</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Kategori Layanan</h2>
          <Link href="/marketplace" className="text-blue-600 flex items-center hover:underline">
            Lihat Semua
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {serviceCategories.map((category) => (
            <Link
              key={category.id}
              href={`/marketplace?category=${category.id}`}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-200/80 flex flex-col items-center justify-center hover:shadow-md transition-all"
            >
              <div className="bg-orange-100 p-3 rounded-full mb-3">
                <category.icon className="h-6 w-6 text-black" />
              </div>
              <h3 className="font-medium text-center">{category.name}</h3>
              <p className="text-sm text-gray-500">{category.count} layanan</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Tabs */}
      <section>
        <div className="bg-white rounded-md shadow-sm inline-flex mb-4">
          <button
            onClick={() => setActiveTab("recent")}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeTab === "recent" ? "bg-blue-600 text-white" : "text-gray-500"
            }`}
          >
            Pesanan Terbaru
          </button>
          <button
            onClick={() => setActiveTab("popular")}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeTab === "popular" ? "bg-blue-600 text-white" : "text-gray-500"
            }`}
          >
            Layanan Populer
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`px-4 py-2 text-sm font-medium rounded-md flex items-center ${
              activeTab === "notifications" ? "bg-blue-600 text-white" : "text-gray-500"
            }`}
          >
            Notifikasi
            <span className="ml-2 bg-orange-200 text-orange-800 rounded-full w-5 h-5 flex items-center justify-center text-xs">
              3
            </span>
          </button>
        </div>

        {/* Recent Orders */}
        {activeTab === "recent" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 p-6">
            <h3 className="text-xl font-semibold mb-2">Pesanan Terbaru</h3>
            <p className="text-gray-500 text-sm mb-6">Daftar pesanan yang baru-baru ini Anda buat.</p>

            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-200 rounded-lg p-4 flex items-center gap-4 hover:border-blue-300 transition-colors"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={order.image || "/placeholder.svg"}
                      alt={order.service}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium">{order.service}</h4>
                        <p className="text-gray-500 text-sm">{order.provider}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatPrice(order.price)}</p>
                        <p className="text-gray-500 text-xs">{order.date}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                      <Link
                        href={`/dashboard/orders/${order.id}`}
                        className="text-black hover:text-blue-600 flex items-center"
                      >
                        Detail
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/dashboard/orders" className="flex items-center text-black hover:text-blue-600 mt-6">
              Lihat Semua Pesanan
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        )}
      </section>

      {/* Promo Banner */}
      <section className="bg-gradient-to-r from-[rgba(30,131,155,0.25)] to-[rgba(22,163,74,0.25)] rounded-xl p-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">Diskon 10% untuk Pesanan Pertama</h2>
          <p className="text-gray-700 mb-4">
            Gunakan kode <span className="font-bold">FIRSTORDER</span> saat checkout
          </p>
          <button className="bg-[#00334D] text-white font-bold py-2 px-4 rounded hover:bg-[#002233] transition-colors">
            Gunakan Sekarang
          </button>
        </div>
        <div className="hidden md:block">
          <Image
            src="/placeholder.svg?height=96&width=96"
            alt="Promo"
            width={96}
            height={96}
            className="object-contain"
          />
        </div>
      </section>
    </div>
  )
}
