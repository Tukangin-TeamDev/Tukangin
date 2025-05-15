'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Zap,
  Droplet,
  HomeIcon,
  Shield,
  Hammer,
  Sprout,
  Package,
  Star,
  MapPin,
  Clock,
} from 'lucide-react';
import { CustomerNavbar } from '@/components/customer-navbar';
import { Footer } from '@/components/footer';

// Types for our service data
interface ServiceProvider {
  id: string;
  name: string;
  rating: number;
  location: string;
  available: boolean;
}

interface Service {
  id: string;
  title: string;
  category:
    | 'electrical'
    | 'plumbing'
    | 'home'
    | 'security'
    | 'carpentry'
    | 'gardening'
    | 'moving'
    | 'appliance';
  categoryLabel: string;
  provider: ServiceProvider;
  price: number;
  image: string;
  rating: number;
}

interface Order {
  id: string;
  service: string;
  provider: string;
  date: string;
  status: 'completed' | 'in-progress' | 'scheduled' | 'cancelled';
  price: number;
  image: string;
}

interface RecommendedService {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  provider: ServiceProvider;
  price: number;
  image: string;
  rating: number;
  reason: string;
}

export default function CustomerHomePage() {
  const [userName, setUserName] = useState('Dono');
  const [services, setServices] = useState<Service[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendedService[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulate fetching data
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchData = async () => {
      // Simulated API response for services
      const servicesData: Service[] = [
        {
          id: '1',
          title: 'Service AC Rumah',
          category: 'electrical',
          categoryLabel: 'Electrical',
          provider: {
            id: 'p1',
            name: 'Teknik Dingin',
            rating: 4.8,
            location: 'Jakarta Selatan',
            available: true,
          },
          price: 200000,
          image: '/placeholder.svg?height=192&width=344',
          rating: 4.8,
        },
        {
          id: '2',
          title: 'Perbaikan Atap Bocor',
          category: 'home',
          categoryLabel: 'Home',
          provider: {
            id: 'p2',
            name: 'Bengkel Jaya',
            rating: 4.7,
            location: 'Jakarta Barat',
            available: true,
          },
          price: 350000,
          image: '/placeholder.svg?height=192&width=344',
          rating: 4.7,
        },
        {
          id: '3',
          title: 'Instalasi Listrik Rumah',
          category: 'electrical',
          categoryLabel: 'Electrical',
          provider: {
            id: 'p3',
            name: 'Elektrindo Mandiri',
            rating: 4.9,
            location: 'Jakarta Timur',
            available: true,
          },
          price: 500000,
          image: '/placeholder.svg?height=192&width=344',
          rating: 4.9,
        },
        {
          id: '4',
          title: 'Desain Interior Rumah',
          category: 'home',
          categoryLabel: 'Home',
          provider: {
            id: 'p4',
            name: 'Kreasi Design',
            rating: 4.6,
            location: 'Jakarta Utara',
            available: true,
          },
          price: 2000000,
          image: '/placeholder.svg?height=192&width=344',
          rating: 4.6,
        },
        {
          id: '5',
          title: 'Service Mesin Cuci',
          category: 'appliance',
          categoryLabel: 'Appliance',
          provider: {
            id: 'p5',
            name: 'Teknik Jaya',
            rating: 4.5,
            location: 'Jakarta Pusat',
            available: true,
          },
          price: 175000,
          image: '/placeholder.svg?height=192&width=344',
          rating: 4.5,
        },
        {
          id: '6',
          title: 'Pembersihan Water Heater',
          category: 'electrical',
          categoryLabel: 'Electrical',
          provider: {
            id: 'p6',
            name: 'Ahli Heater',
            rating: 4.7,
            location: 'Jakarta Selatan',
            available: true,
          },
          price: 300000,
          image: '/placeholder.svg?height=192&width=344',
          rating: 4.7,
        },
      ];

      // Simulated API response for recent orders
      const ordersData: Order[] = [
        {
          id: 'o1',
          service: 'Service AC Rumah',
          provider: 'Teknik Dingin',
          date: '20 Apr 2025',
          status: 'completed',
          price: 200000,
          image: '/placeholder.svg?height=80&width=80',
        },
        {
          id: 'o2',
          service: 'Perbaikan Atap Bocor',
          provider: 'Bengkel Jaya',
          date: '15 Apr 2025',
          status: 'in-progress',
          price: 350000,
          image: '/placeholder.svg?height=80&width=80',
        },
      ];

      // Simulated API response for recommendations
      const recommendationsData: RecommendedService[] = [
        {
          id: 'r1',
          title: 'Pemasangan CCTV Rumah',
          category: 'security',
          categoryLabel: 'Security',
          provider: {
            id: 'p7',
            name: 'Secure Vision',
            rating: 4.9,
            location: 'Jakarta Selatan',
          },
          price: 1500000,
          image: '/placeholder.svg?height=144&width=256',
          rating: 4.9,
          reason: 'Berdasarkan pesanan AC dan listrik Anda sebelumnya',
        },
        {
          id: 'r2',
          title: 'Pembersihan Saluran Air',
          category: 'plumbing',
          categoryLabel: 'Plumbing',
          provider: {
            id: 'p8',
            name: 'Pipa Bersih',
            rating: 4.7,
            location: 'Jakarta Barat',
          },
          price: 250000,
          image: '/placeholder.svg?height=144&width=256',
          rating: 4.7,
          reason: 'Layanan perawatan rumah yang populer di area Anda',
        },
        {
          id: 'r3',
          title: 'Pengecatan Dinding Rumah',
          category: 'home',
          categoryLabel: 'Home',
          provider: {
            id: 'p9',
            name: 'Warna Prima',
            rating: 4.8,
            location: 'Jakarta Timur',
          },
          price: 1200000,
          image: '/placeholder.svg?height=144&width=256',
          rating: 4.8,
          reason: 'Pelanggan yang memesan renovasi juga memesan layanan ini',
        },
      ];

      setServices(servicesData);
      setRecentOrders(ordersData);
      setRecommendations(recommendationsData);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Format price to IDR
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(price)
      .replace('IDR', 'Rp');
  };

  // Service category icons
  const serviceCategories = [
    { id: 'electrical', name: 'Electrician', icon: Zap },
    { id: 'plumbing', name: 'Plumbing', icon: Droplet },
    { id: 'home', name: 'Housing', icon: HomeIcon },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'carpentry', name: 'Carpentry', icon: Hammer },
    { id: 'gardening', name: 'Gardening', icon: Sprout },
    { id: 'moving', name: 'Moving', icon: Package },
  ];

  // Status badge color
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Status text
  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return 'Selesai';
      case 'in-progress':
        return 'Dalam Proses';
      case 'scheduled':
        return 'Terjadwal';
      case 'cancelled':
        return 'Dibatalkan';
      default:
        return status;
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <CustomerNavbar userName={userName} />

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-[#1E839B] to-[#16A34A] mx-auto px-4 sm:px-6 lg:px-24 py-12 rounded-2xl mt-6 mb-8 max-w-7xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-white z-10 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Up to 10%
              <br />
              off Voucher
            </h1>
            <div className="flex items-center mt-4">
              <Link
                href="/vouchers"
                className="flex items-center group text-white hover:text-white/90 transition-colors"
              >
                <span className="font-medium border-b border-white">Shop Now</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          <div className="relative z-10">
            <Image
              src="/placeholder.svg?height=300&width=300"
              alt="Tukangin Promo"
              width={300}
              height={300}
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* Welcome Message */}
      <section className="mx-auto px-4 sm:px-6 lg:px-24 mb-8 max-w-7xl">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">Selamat datang kembali, {userName}!</h1>
          <p className="text-gray-600 mt-2">
            Temukan layanan terbaik untuk kebutuhan rumah dan bisnis Anda. Kami telah menyiapkan
            rekomendasi khusus berdasarkan preferensi Anda.
          </p>
        </div>
      </section>

      {/* Recent Orders Summary */}
      {recentOrders.length > 0 && (
        <section className="mx-auto px-4 sm:px-6 lg:px-24 mb-8 max-w-7xl">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Pesanan Terbaru</h2>
              <Link
                href="/dashboard/orders"
                className="text-blue-500 hover:text-blue-600 flex items-center text-sm"
              >
                Lihat Semua
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentOrders.map(order => (
                <Link
                  key={order.id}
                  href={`/dashboard/orders/${order.id}`}
                  className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all"
                >
                  <Image
                    src={order.image || '/placeholder.svg'}
                    alt={order.service}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{order.service}</h3>
                    <p className="text-sm text-gray-500">{order.provider}</p>
                    <div className="flex items-center mt-1">
                      <Clock className="h-3.5 w-3.5 text-gray-400 mr-1" />
                      <span className="text-xs text-gray-500">{order.date}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-medium text-green-600">{formatPrice(order.price)}</span>
                    <span
                      className={`mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Service Categories */}
      <section className="bg-slate-50/50 mx-auto px-4 sm:px-6 lg:px-24 py-8 rounded-2xl mb-8 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Service Categories</h2>
          <Link href="/services" className="text-blue-500 hover:text-blue-600 flex items-center">
            View All
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {serviceCategories.map(category => (
            <Link
              key={category.id}
              href={`/services/category/${category.id}`}
              className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200/80 h-full transition-all duration-300 group"
            >
              <div className="text-3xl mb-3 bg-green-500/10 p-3 rounded-full group-hover:scale-110 transition-transform duration-300">
                <category.icon className="h-6 w-6 text-black" />
              </div>
              <span className="text-sm font-medium text-gray-900">{category.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Personalized Recommendations */}
      <section className="mx-auto px-4 sm:px-6 lg:px-24 mb-8 max-w-7xl">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Rekomendasi Untuk Anda</h2>
            <Link
              href="/recommendations"
              className="text-blue-500 hover:text-blue-600 flex items-center text-sm"
            >
              Lihat Semua
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map(service => (
              <Link
                key={service.id}
                href={`/services/${service.id}`}
                className="group block rounded-lg overflow-hidden border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300"
              >
                <div className="relative h-36">
                  <Image
                    src={service.image || '/placeholder.svg'}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div
                    className={`absolute top-2 left-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      service.category === 'electrical'
                        ? 'bg-blue-500'
                        : service.category === 'home'
                          ? 'bg-green-500'
                          : service.category === 'security'
                            ? 'bg-purple-500'
                            : service.category === 'plumbing'
                              ? 'bg-cyan-500'
                              : 'bg-blue-500'
                    } text-white`}
                  >
                    {service.categoryLabel}
                  </div>
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-blue-600 px-2 py-0.5 rounded-full text-xs font-medium">
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    <span>{service.rating.toFixed(1)}</span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-medium text-gray-900 line-clamp-1">{service.title}</h3>
                  <p className="text-sm text-blue-600 mt-1">{service.provider.name}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{service.reason}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center text-xs text-gray-500">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{service.provider.location}</span>
                    </div>
                    <span className="font-bold text-green-600">{formatPrice(service.price)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Selling Services */}
      <section className="bg-white mx-auto px-4 sm:px-6 lg:px-24 py-8 rounded-2xl mb-8 max-w-7xl shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Best Selling Services</h2>
          <Link href="/services" className="text-blue-500 hover:text-blue-600 flex items-center">
            View All
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-lg bg-gray-100 h-[398px] animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(service => (
              <div
                key={service.id}
                className="rounded-lg bg-white text-gray-900 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200/80 hover:border-blue-300 group"
              >
                <div className="relative">
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={service.image || '/placeholder.svg'}
                      alt={service.title}
                      width={344}
                      height={192}
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold absolute top-3 left-3 ${
                      service.category === 'electrical'
                        ? 'bg-blue-500'
                        : service.category === 'home'
                          ? 'bg-green-500'
                          : service.category === 'appliance'
                            ? 'bg-blue-600'
                            : 'bg-blue-500'
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
                      <span className="font-bold text-lg text-green-600">
                        {formatPrice(service.price)}
                      </span>
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
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
