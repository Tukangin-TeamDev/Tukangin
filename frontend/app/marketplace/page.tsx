"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Search,
  Star,
  MapPin,
  Clock,
  ChevronRight,
  Zap,
  Droplet,
  HomeIcon,
  Shield,
  Hammer,
  Sprout,
  Package,
} from "lucide-react"
import { CustomerNavbar } from "@/components/customer-navbar"
import { Footer } from "@/components/footer"
import { FilterBar, ActiveFilter } from "@/components/filter-bar"

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

interface FilterState {
  category: string
  location: string
  priceRange: [number, number]
  minRating: number
}

export default function MarketplacePage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([
    { type: "category", value: "Peralatan" },
    { type: "location", value: "Jakarta Pusat" },
    { type: "price", value: "Rp0 - Rp1,000,000" },
    { type: "rating", value: "4.5+" },
  ])
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    location: "Jakarta Pusat",
    priceRange: [0, 1000000],
    minRating: 4.5
  })

  // Simulate fetching services data
  useEffect(() => {
    // In a real app, this would be an API call with filters applied
    const fetchData = async () => {
      // Simulated API response for services
      const servicesData: Service[] = [
        {
          id: "1",
          title: "Service AC Rumah",
          category: "electrical",
          categoryLabel: "Electrical",
          provider: {
            id: "p1",
            name: "Teknik Dingin",
            rating: 4.8,
            location: "Jakarta Selatan",
            available: true,
          },
          price: 200000,
          image: "/placeholder.svg?height=192&width=344",
          rating: 4.8,
        },
        {
          id: "2",
          title: "Perbaikan Atap Bocor",
          category: "home",
          categoryLabel: "Home",
          provider: {
            id: "p2",
            name: "Bengkel Jaya",
            rating: 4.7,
            location: "Jakarta Selatan",
            available: true,
          },
          price: 350000,
          image: "/placeholder.svg?height=192&width=344",
          rating: 4.7,
        },
        {
          id: "3",
          title: "Instalasi Listrik Rumah",
          category: "electrical",
          categoryLabel: "Electrical",
          provider: {
            id: "p3",
            name: "Elektrindo Mandiri",
            rating: 4.9,
            location: "Jakarta Timur",
            available: true,
          },
          price: 500000,
          image: "/placeholder.svg?height=192&width=344",
          rating: 4.9,
        },
        {
          id: "4",
          title: "Desain Interior Rumah",
          category: "home",
          categoryLabel: "Home",
          provider: {
            id: "p4",
            name: "Kreasi Design",
            rating: 4.6,
            location: "Jakarta Utara",
            available: true,
          },
          price: 2000000,
          image: "/placeholder.svg?height=192&width=344",
          rating: 4.6,
        },
        {
          id: "5",
          title: "Service Mesin Cuci",
          category: "appliance",
          categoryLabel: "Appliance",
          provider: {
            id: "p5",
            name: "Teknik Jaya",
            rating: 4.5,
            location: "Jakarta Pusat",
            available: true,
          },
          price: 175000,
          image: "/placeholder.svg?height=192&width=344",
          rating: 4.5,
        },
        {
          id: "6",
          title: "Pembersihan Water Heater",
          category: "electrical",
          categoryLabel: "Electrical",
          provider: {
            id: "p6",
            name: "Ahli Heater",
            rating: 4.7,
            location: "Jakarta Selatan",
            available: true,
          },
          price: 300000,
          image: "/placeholder.svg?height=192&width=344",
          rating: 4.7,
        },
        {
          id: "7",
          title: "Perbaikan Pipa Air",
          category: "plumbing",
          categoryLabel: "Plumbing",
          provider: {
            id: "p7",
            name: "Tukang Pipa Pro",
            rating: 4.6,
            location: "Jakarta Timur",
            available: true,
          },
          price: 250000,
          image: "/placeholder.svg?height=192&width=344",
          rating: 4.6,
        },
        {
          id: "8",
          title: "Pengecatan Rumah",
          category: "home",
          categoryLabel: "Home",
          provider: {
            id: "p8",
            name: "Cat Indah",
            rating: 4.8,
            location: "Jakarta Selatan",
            available: true,
          },
          price: 1500000,
          image: "/placeholder.svg?height=192&width=344",
          rating: 4.8,
        },
        {
          id: "9",
          title: "Pemasangan CCTV",
          category: "security",
          categoryLabel: "Security",
          provider: {
            id: "p9",
            name: "Security Pro",
            rating: 4.9,
            location: "Jakarta Barat",
            available: true,
          },
          price: 800000,
          image: "/placeholder.svg?height=192&width=344",
          rating: 4.9,
        },
      ]

      setServices(servicesData)
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

  // Service category icons mapping
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "electrical":
        return <Zap className="h-6 w-6 text-black" />
      case "plumbing":
        return <Droplet className="h-6 w-6 text-black" />
      case "home":
        return <HomeIcon className="h-6 w-6 text-black" />
      case "security":
        return <Shield className="h-6 w-6 text-black" />
      case "carpentry":
        return <Hammer className="h-6 w-6 text-black" />
      case "gardening":
        return <Sprout className="h-6 w-6 text-black" />
      case "moving":
        return <Package className="h-6 w-6 text-black" />
      default:
        return <HomeIcon className="h-6 w-6 text-black" />
    }
  }

  // Service categories
  const serviceCategories = [
    { id: "electrical", name: "Electrician", icon: "electrical" },
    { id: "plumbing", name: "Plumbing", icon: "plumbing" },
    { id: "home", name: "Housing", icon: "home" },
    { id: "security", name: "Security", icon: "security" },
    { id: "carpentry", name: "Carpentry", icon: "carpentry" },
    { id: "gardening", name: "Gardening", icon: "gardening" },
    { id: "moving", name: "Moving", icon: "moving" },
  ]

  // Handle filters change from FilterBar
  const handleFilterChange = (newFilters: ActiveFilter[]) => {
    setActiveFilters(newFilters)
    
    // Update the filters state based on the active filters
    const newFiltersState = { ...filters }
    
    // Reset filters first
    newFiltersState.category = "all"
    newFiltersState.location = ""
    newFiltersState.priceRange = [0, 1000000]
    newFiltersState.minRating = 0
    
    // Apply each filter
    newFilters.forEach(filter => {
      if (filter.type === "category") {
        // Map category label back to category ID
        const categoryOption = getCategoryIdByLabel(filter.value)
        if (categoryOption) {
          newFiltersState.category = categoryOption
        }
      } else if (filter.type === "location") {
        newFiltersState.location = filter.value
      } else if (filter.type === "price") {
        // Parse price range from string like "Rp0 - Rp1,000,000"
        const priceRange = filter.value.split(" - ")
        if (priceRange.length === 2) {
          const min = parseInt(priceRange[0].replace(/[^\d]/g, ""))
          const max = parseInt(priceRange[1].replace(/[^\d]/g, ""))
          newFiltersState.priceRange = [min, max]
        }
      } else if (filter.type === "rating") {
        // Parse rating from string like "4.5+"
        const rating = parseFloat(filter.value.replace("+", ""))
        if (!isNaN(rating)) {
          newFiltersState.minRating = rating
        }
      }
    })
    
    setFilters(newFiltersState)
  }
  
  // Handle category change from category buttons
  const handleCategoryChange = (categoryId: string) => {
    setActiveTab(categoryId)
  }
  
  // Map category label to category ID
  const getCategoryIdByLabel = (label: string): string => {
    const categories: {[key: string]: string} = {
      "Kelistrikan": "electrical",
      "Ledeng": "plumbing",
      "Rumah": "home",
      "Keamanan": "security",
      "Peralatan": "equipment",
      "Semua": "all"
    }
    return categories[label] || "all"
  }

  // Filter services based on search query and active filters
  const filteredServices = services.filter((service) => {
    // Search filter
    const matchesSearch =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.provider.location.toLowerCase().includes(searchQuery.toLowerCase())

    // Category filter
    const matchesCategory = activeTab === "all" || service.category === activeTab
    
    // Rating filter
    const matchesRating = service.rating >= filters.minRating
    
    // Location filter (if applied)
    const matchesLocation = !filters.location || service.provider.location === filters.location
    
    // Price filter
    const matchesPrice = service.price >= filters.priceRange[0] && 
                        service.price <= filters.priceRange[1]

    return matchesSearch && matchesCategory && matchesRating && matchesLocation && matchesPrice
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would trigger an API call with the search query
    console.log("Searching for:", searchQuery)
  }

  return (
    <main className="min-h-screen bg-white">
      <CustomerNavbar userName="Dono" />

      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-blue-500/60 to-white py-12">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-black mb-4">Temukan Layanan Tukang Profesional</h1>
          <p className="text-lg text-black/75 mb-8 max-w-4xl mx-auto">
            Berbagai layanan jasa tukang berkualitas untuk membantu kebutuhan rumah dan bisnis Anda
          </p>

          {/* Main Search Bar */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Cari Layanan, Lokasi, atau Penyedia Jasa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3 px-6 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner text-base"
              />
              <button type="submit" className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <Search className="h-6 w-6 text-black" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="container mx-auto px-4 md:px-8 mt-6 mb-8">
        <FilterBar 
          filters={activeFilters} 
          onFilterChange={handleFilterChange}
          onCategoryChange={handleCategoryChange}
        />
      </section>

      {/* Service Categories */}
      <section className="container mx-auto px-4 md:px-8 mb-8">
        <div className="bg-gray-50/50 rounded-2xl p-6 shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Service Categories</h2>
            <Link href="/services" className="text-blue-500 hover:text-blue-600 flex items-center">
              View All
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {serviceCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setActiveTab(category.id)
                  // Update active filters to match selected category
                  const categoryLabel = serviceCategories.find(c => c.id === category.id)?.name || ""
                  const updatedFilters = activeFilters.filter(f => f.type !== "category")
                  if (category.id !== "all") {
                    updatedFilters.push({ type: "category", value: categoryLabel })
                  }
                  setActiveFilters(updatedFilters)
                }}
                className={`flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md border ${
                  activeTab === category.id ? "border-green-500 bg-green-50/10" : "border-gray-200/80"
                } h-full transition-all duration-300 group`}
              >
                <div className="text-3xl mb-3 bg-green-500/10 p-3 rounded-full group-hover:scale-110 transition-transform duration-300">
                  {getCategoryIcon(category.icon)}
                </div>
                <span className="text-sm font-medium text-gray-900">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Service Listings */}
      <section className="container mx-auto px-4 md:px-8 mb-12">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setActiveTab("all")
                // Remove category filter
                setActiveFilters(activeFilters.filter(f => f.type !== "category"))
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === "all" ? "bg-blue-600 text-white" : "bg-white text-gray-500"
              }`}
            >
              Semua Layanan
            </button>
            <button
              onClick={() => console.log("Popular filter")}
              className="px-4 py-2 rounded-md text-sm font-medium bg-white text-gray-500"
            >
              Paling Populer
            </button>
            <button
              onClick={() => console.log("Newest filter")}
              className="px-4 py-2 rounded-md text-sm font-medium bg-white text-gray-500"
            >
              Terbaru
            </button>
          </div>
          <p className="text-sm text-gray-600">
            Menampilkan <span className="font-semibold text-blue-600">{filteredServices.length}</span> dari{" "}
            {services.length} layanan
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-lg bg-gray-100 h-[398px] animate-pulse"></div>
            ))}
          </div>
        ) : filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="rounded-lg bg-white text-gray-900 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200/80 hover:border-blue-300 group"
              >
                <div className="relative">
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={service.image || "/placeholder.svg"}
                      alt={service.title}
                      width={344}
                      height={192}
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold absolute top-3 left-3 ${
                      service.category === "electrical"
                        ? "bg-blue-500"
                        : service.category === "home"
                          ? "bg-green-500"
                          : service.category === "appliance"
                            ? "bg-blue-600"
                            : service.category === "plumbing"
                              ? "bg-cyan-500"
                              : service.category === "security"
                                ? "bg-purple-700"
                                : "bg-blue-500"
                    } text-white`}
                  >
                    {service.categoryLabel}
                  </div>
                  <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm text-blue-600 px-2 py-1 rounded-full text-sm font-medium shadow-sm absolute bottom-3 right-3">
                    <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                    <span>{service.rating.toFixed(1)}</span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-lg line-clamp-1">{service.title}</h3>
                  <div className="flex flex-col space-y-2 mt-2">
                    <span className="text-sm text-blue-600">{service.provider.name}</span>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        <span>Tersedia Sekarang</span>
                      </div>
                      <span className="font-bold text-lg text-green-600">{formatPrice(service.price)}</span>
                    </div>
                  </div>

                  <div className="flex items-center mt-4 text-sm text-gray-700">
                    <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                    <span className="truncate">{service.provider.location}</span>
                  </div>

                  <div className="flex items-center mt-2 text-sm text-gray-700">
                    <Clock className="h-4 w-4 text-gray-500 mr-1" />
                    <span>Tersedia Sekarang</span>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <Link
                      href={`/services/${service.id}`}
                      className="inline-flex items-center justify-center text-sm font-medium h-9 rounded-md px-3 text-blue-600 border border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all"
                    >
                      Detail
                    </Link>
                    <Link
                      href={`/services/${service.id}/order`}
                      className="inline-flex items-center justify-center text-sm font-medium h-9 rounded-md px-3 text-black hover:text-blue-600 transition-all"
                    >
                      Pesan
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-2xl font-semibold mb-2">Tidak ada layanan yang ditemukan</div>
            <p className="text-gray-500">Silakan ubah filter pencarian Anda</p>
          </div>
        )}
      </section>

      <Footer />
    </main>
  )
}
