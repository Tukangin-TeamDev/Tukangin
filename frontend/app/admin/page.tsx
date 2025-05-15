'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUp,
  Clock,
  Star,
  Wrench,
  Zap,
  Paintbrush,
  PlusCircle,
  LayoutDashboard,
} from 'lucide-react';

// Types for our data
interface Order {
  id: string;
  service: string;
  customer: string;
  date: string;
  status: 'pending' | 'in-progress' | 'completed';
  price: number;
  image: string;
}

interface ServiceStats {
  name: string;
  count: number;
  growth: number;
  icon: React.ReactNode;
}

interface CustomerStats {
  name: string;
  count: number;
  avatar: string;
}

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusCounts, setStatusCounts] = useState({
    pending: 5,
    inProgress: 8,
    completed: 14,
  });

  // Simulate fetching data
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchData = async () => {
      // Simulated API response for orders
      const ordersData: Order[] = [
        {
          id: 'o1',
          service: 'Perbaikan Atap Bocor',
          customer: 'Bengkel Jaya',
          date: '12 Mei 2023',
          status: 'in-progress',
          price: 350000,
          image: '/placeholder.svg?height=80&width=80',
        },
        {
          id: 'o2',
          service: 'Perbaikan Listrik Rumah',
          customer: 'Bengkel Jaya',
          date: '10 Mei 2023',
          status: 'pending',
          price: 750000,
          image: '/placeholder.svg?height=80&width=80',
        },
      ];

      setOrders(ordersData);
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

  // Top services data
  const topServices: ServiceStats[] = [
    {
      name: 'Perbaikan Atap',
      count: 15,
      growth: 23,
      icon: <Wrench className="h-5 w-5" />,
    },
    {
      name: 'Instalasi Listrik',
      count: 12,
      growth: 18,
      icon: <Zap className="h-5 w-5" />,
    },
    {
      name: 'Pengecatan',
      count: 8,
      growth: 5,
      icon: <Paintbrush className="h-5 w-5" />,
    },
  ];

  // Top customers data
  const topCustomers: CustomerStats[] = [
    {
      name: 'Ahmad Budiman',
      count: 4,
      avatar: '/placeholder.svg?height=32&width=32',
    },
    {
      name: 'Siti Sunarti',
      count: 3,
      avatar: '/placeholder.svg?height=32&width=32',
    },
  ];

  // Status badge color
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-500';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-500';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-500';
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
      case 'pending':
        return 'Menunggu Konfirmasi';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Provider</h1>
          <p className="text-gray-600">Selamat datang kembali, Bengkel Jaya!</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/services"
            className="flex items-center gap-2 px-4 py-2 text-black hover:text-blue-600"
          >
            <LayoutDashboard className="h-4 w-4" />
            Kelola Layanan
          </Link>
          <Link
            href="/admin/services/new"
            className="flex items-center gap-2 px-4 py-2 text-black hover:text-blue-600"
          >
            <PlusCircle className="h-4 w-4" />
            Tambah Layanan
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Monthly Revenue */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-500/90 text-white rounded-lg shadow-sm p-6 pb-2 pt-4">
          <p className="text-white/90 text-sm">Pendapatan Bulan Ini</p>
          <h3 className="text-2xl font-semibold mt-2">Rp2.750.000</h3>
          <div className="flex items-center mt-4 text-white/90 text-sm">
            <ArrowUp className="h-4 w-4 mr-1" />
            <span>15% dari bulan lalu</span>
          </div>
        </div>

        {/* Store Rating */}
        <div className="bg-white rounded-lg shadow-sm p-6 pb-2 pt-4">
          <p className="text-gray-500 text-sm">Rating Toko</p>
          <h3 className="text-2xl font-semibold mt-2">4.8/5</h3>
          <div className="flex items-center mt-4 text-gray-500 text-sm">
            <Star className="h-4 w-4 mr-1 text-yellow-400 fill-yellow-400" />
            <span>35 ulasan</span>
          </div>
        </div>

        {/* Total Services */}
        <div className="bg-white rounded-lg shadow-sm p-6 pb-2 pt-4">
          <p className="text-gray-500 text-sm">Total Layanan</p>
          <h3 className="text-2xl font-semibold mt-2">12</h3>
          <div className="flex items-center mt-4 text-gray-500 text-sm">
            <span>8 aktif, 4 nonaktif</span>
          </div>
        </div>

        {/* Monthly Orders */}
        <div className="bg-white rounded-lg shadow-sm p-6 pb-2 pt-4">
          <p className="text-gray-500 text-sm">Pesanan Bulan Ini</p>
          <h3 className="text-2xl font-semibold mt-2">27</h3>
          <div className="flex items-center mt-4 text-gray-500 text-sm">
            <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
            <span>12% dari bulan lalu</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
        {/* Recent Orders */}
        <div className="md:col-span-4 bg-white rounded-lg shadow-sm">
          <div className="p-6 flex flex-row items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Pesanan Terbaru</h2>
              <p className="text-gray-500 text-sm">Pesanan yang perlu ditangani</p>
            </div>
            <Link href="/admin/orders" className="text-black hover:text-blue-600 flex items-center">
              Lihat Semua
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <div className="px-6 pb-6 space-y-4">
            {orders.map(order => (
              <div
                key={order.id}
                className="border border-gray-200/80 rounded-lg overflow-hidden hover:border-blue-300 transition-all shadow-sm"
              >
                <div className="p-4 flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border">
                    <Image
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
                        href={`/admin/orders/${order.id}`}
                        className="text-black hover:text-blue-600 flex items-center"
                      >
                        Detail
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Summary */}
        <div className="md:col-span-3 bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-semibold">Ringkasan Status</h2>
            <p className="text-gray-500 text-sm">Status pesanan bulan ini</p>

            <div className="space-y-4 mt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <span>Menunggu Konfirmasi</span>
                </div>
                <span className="bg-yellow-50 text-yellow-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border">
                  {statusCounts.pending}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <span>Sedang Dikerjakan</span>
                </div>
                <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border">
                  {statusCounts.inProgress}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-500" />
                  <span>Selesai</span>
                </div>
                <span className="bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border">
                  {statusCounts.completed}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <h3 className="font-medium mb-4">Layanan Teratas</h3>
              <div className="space-y-3">
                {topServices.map(service => (
                  <div key={service.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                        {service.icon}
                      </div>
                      <span className="font-medium">{service.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{service.count} pesanan</span>
                      <span className="text-green-500 text-xs">+{service.growth}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <h3 className="font-medium mb-4">Pelanggan Teratas</h3>
              <div className="space-y-3">
                {topCustomers.map(customer => (
                  <div key={customer.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Image
                        src={customer.avatar || '/placeholder.svg'}
                        alt={customer.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <span className="font-medium">{customer.name}</span>
                    </div>
                    <span>{customer.count} pesanan</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
