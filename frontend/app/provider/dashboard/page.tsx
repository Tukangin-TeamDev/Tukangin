'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ShoppingBag, Star, Briefcase, ClipboardList, Bell } from 'lucide-react';

// Types for provider data
interface Service {
  id: string;
  title: string;
  category: string;
  price: number;
  image: string;
  orders: number;
}

interface Order {
  id: string;
  service: string;
  customer: string;
  date: string;
  status: 'completed' | 'in-progress' | 'scheduled' | 'cancelled';
  price: number;
  image: string;
}

export default function ProviderDashboard() {
  const [providerName, setProviderName] = useState('Bengkel Jaya');
  const [services, setServices] = useState<Service[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  // Simulate fetching data
  useEffect(() => {
    // Simulated API response for provider's services
    const servicesData: Service[] = [
      {
        id: 's1',
        title: 'Perbaikan Atap Bocor',
        category: 'Renovasi',
        price: 350000,
        image: '/placeholder.svg?height=80&width=80',
        orders: 12,
      },
      {
        id: 's2',
        title: 'Instalasi Listrik',
        category: 'Listrik',
        price: 750000,
        image: '/placeholder.svg?height=80&width=80',
        orders: 8,
      },
    ];
    // Simulated API response for provider's orders
    const ordersData: Order[] = [
      {
        id: 'o1',
        service: 'Perbaikan Atap Bocor',
        customer: 'Andi',
        date: '12 Mei 2023',
        status: 'in-progress',
        price: 350000,
        image: '/placeholder.svg?height=80&width=80',
      },
      {
        id: 'o2',
        service: 'Instalasi Listrik',
        customer: 'Budi',
        date: '10 Mei 2023',
        status: 'scheduled',
        price: 750000,
        image: '/placeholder.svg?height=80&width=80',
      },
    ];
    setServices(servicesData);
    setOrders(ordersData);
    setLoading(false);
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

  // Status badge color
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-500';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-500';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800 border-yellow-500';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-500';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-500';
    }
  };

  // Status text
  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return 'Selesai';
      case 'in-progress':
        return 'Sedang Dikerjakan';
      case 'scheduled':
        return 'Dijadwalkan';
      case 'cancelled':
        return 'Dibatalkan';
      default:
        return status;
    }
  };

  // Statistik
  const totalOrders = orders.length;
  const activeOrders = orders.filter(
    o => o.status === 'in-progress' || o.status === 'scheduled'
  ).length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const avgRating = 4.7;

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-green-600 to-blue-500 rounded-xl p-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-white mb-6 md:mb-0">
            <h1 className="text-3xl font-bold mb-2">Selamat Datang, {providerName}!</h1>
            <p className="text-blue-100 mb-6">
              Kelola layanan, pesanan, dan reputasi Anda sebagai provider.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/provider/services"
                className="bg-white text-green-600 px-4 py-2 rounded-md font-medium flex items-center gap-2 hover:bg-green-50 transition-colors"
              >
                <Briefcase className="h-5 w-5" />
                Kelola Layanan
              </Link>
              <Link
                href="/provider/orders"
                className="bg-transparent text-white border border-white px-4 py-2 rounded-md font-medium flex items-center gap-2 hover:bg-white/10 transition-colors"
              >
                <ClipboardList className="h-5 w-5" />
                Lihat Pesanan
              </Link>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="p-3">
                <h2 className="text-3xl font-bold text-white">{totalOrders}</h2>
                <p className="text-xs text-blue-100">Total Pesanan</p>
              </div>
              <div className="p-3">
                <h2 className="text-3xl font-bold text-white">{completedOrders}</h2>
                <p className="text-xs text-blue-100">Selesai</p>
              </div>
              <div className="p-3">
                <h2 className="text-3xl font-bold text-white">{activeOrders}</h2>
                <p className="text-xs text-blue-100">Aktif</p>
              </div>
              <div className="p-3">
                <h2 className="text-3xl font-bold text-white">{avgRating}</h2>
                <p className="text-xs text-blue-100">Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section>
        <div className="bg-white rounded-md shadow-sm inline-flex mb-4">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeTab === 'orders' ? 'bg-green-600 text-white' : 'text-gray-500'
            }`}
          >
            Pesanan Masuk
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeTab === 'services' ? 'bg-green-600 text-white' : 'text-gray-500'
            }`}
          >
            Layanan Saya
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2 text-sm font-medium rounded-md flex items-center ${
              activeTab === 'notifications' ? 'bg-green-600 text-white' : 'text-gray-500'
            }`}
          >
            Notifikasi
            <span className="ml-2 bg-orange-200 text-orange-800 rounded-full w-5 h-5 flex items-center justify-center text-xs">
              2
            </span>
          </button>
        </div>

        {/* Pesanan Masuk */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 p-6">
            <h3 className="text-xl font-semibold mb-2">Pesanan Masuk</h3>
            <p className="text-gray-500 text-sm mb-6">
              Daftar pesanan terbaru yang masuk ke layanan Anda.
            </p>
            <div className="space-y-4">
              {orders.map(order => (
                <div
                  key={order.id}
                  className="border border-gray-200 rounded-lg p-4 flex items-center gap-4 hover:border-green-300 transition-colors"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                    {/* Ganti dengan komponen Image jika ingin optimasi */}
                    <img
                      src={order.image || '/placeholder.svg'}
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
                        <p className="text-gray-500 text-sm">{order.customer}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatPrice(order.price)}</p>
                        <p className="text-gray-500 text-xs">{order.date}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span
                        className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                      <Link
                        href={`/provider/orders/${order.id}`}
                        className="text-black hover:text-green-600 flex items-center"
                      >
                        Detail
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/provider/orders"
              className="flex items-center text-black hover:text-green-600 mt-6"
            >
              Lihat Semua Pesanan
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        )}

        {/* Layanan Saya */}
        {activeTab === 'services' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 p-6">
            <h3 className="text-xl font-semibold mb-2">Layanan Saya</h3>
            <p className="text-gray-500 text-sm mb-6">Daftar layanan yang Anda tawarkan.</p>
            <div className="space-y-4">
              {services.map(service => (
                <div
                  key={service.id}
                  className="border border-gray-200 rounded-lg p-4 flex items-center gap-4 hover:border-green-300 transition-colors"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src={service.image || '/placeholder.svg'}
                      alt={service.title}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium">{service.title}</h4>
                        <p className="text-gray-500 text-sm">{service.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatPrice(service.price)}</p>
                        <p className="text-gray-500 text-xs">{service.orders} pesanan</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/provider/services"
              className="flex items-center text-black hover:text-green-600 mt-6"
            >
              Kelola Semua Layanan
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        )}

        {/* Notifikasi */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 p-6">
            <h3 className="text-xl font-semibold mb-2">Notifikasi</h3>
            <p className="text-gray-500 text-sm mb-6">Belum ada notifikasi baru.</p>
          </div>
        )}
      </section>

      {/* Promo Banner */}
      <section className="bg-gradient-to-r from-[rgba(30,131,155,0.25)] to-[rgba(22,163,74,0.25)] rounded-xl p-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">Tingkatkan Layanan Anda!</h2>
          <p className="text-gray-700 mb-4">Dapatkan tips dan promo eksklusif untuk provider.</p>
          <button className="bg-[#16a34a] text-white font-bold py-2 px-4 rounded hover:bg-[#15803d] transition-colors">
            Lihat Tips
          </button>
        </div>
        <div className="hidden md:block">
          <img
            src="/placeholder.svg?height=96&width=96"
            alt="Promo"
            width={96}
            height={96}
            className="object-contain"
          />
        </div>
      </section>
    </div>
  );
}
