'use client';

import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  DollarSign,
  TrendingUp,
  Calendar,
  AlertCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import BarChartComponent from '../components/charts/BarChartComponent';
import LineChartComponent from '../components/charts/LineChartComponent';
import PieChartComponent from '../components/charts/PieChartComponent';
import RecentActivityList from '../components/RecentActivityList';

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'year'>('week');

  // Dummy data untuk metrik
  const metrics = {
    total_bookings: {
      value: 1258,
      trend: '+14%',
      isUp: true,
      label: 'Total Bookings',
      icon: <Briefcase className="h-8 w-8 text-blue-600" />,
      color: 'blue',
    },
    active_users: {
      value: 8754,
      trend: '+7.2%',
      isUp: true,
      label: 'Pengguna Aktif',
      icon: <Users className="h-8 w-8 text-green-600" />,
      color: 'green',
    },
    revenue: {
      value: 'Rp 87.5 jt',
      trend: '+12.3%',
      isUp: true,
      label: 'Pendapatan',
      icon: <DollarSign className="h-8 w-8 text-purple-600" />,
      color: 'purple',
    },
    avg_rating: {
      value: '4.7',
      trend: '+0.2',
      isUp: true,
      label: 'Rating Rata-rata',
      icon: <TrendingUp className="h-8 w-8 text-amber-600" />,
      color: 'amber',
    },
    disputes: {
      value: 27,
      trend: '-3%',
      isUp: false,
      label: 'Disputes Aktif',
      icon: <AlertCircle className="h-8 w-8 text-red-600" />,
      color: 'red',
    },
    verification_queue: {
      value: 8,
      trend: '+5',
      isUp: true,
      label: 'Menunggu Verifikasi',
      icon: <Calendar className="h-8 w-8 text-indigo-600" />,
      color: 'indigo',
    },
  };

  // Data untuk chart penjualan mingguan
  const weeklyBookingsData = {
    labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
    datasets: [
      {
        label: 'Minggu ini',
        data: [48, 65, 53, 71, 87, 96, 91],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
      },
      {
        label: 'Minggu lalu',
        data: [42, 55, 49, 62, 79, 85, 80],
        backgroundColor: 'rgba(209, 213, 219, 0.5)',
        borderColor: 'rgba(156, 163, 175, 1)',
        borderWidth: 2,
      },
    ],
  };

  // Data untuk chart distribusi kategori
  const categoryData = {
    labels: ['Listrik', 'Pipa & Plumbing', 'Bangunan', 'Elektronik', 'AC', 'Cleaning', 'Lainnya'],
    datasets: [
      {
        data: [35, 25, 15, 10, 8, 5, 2],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(107, 114, 128, 0.8)',
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  // Data untuk chart tren pendapatan
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'],
    datasets: [
      {
        label: 'Pendapatan Platform (jt)',
        data: [42, 48, 52, 49, 55, 59, 62, 68, 72, 75, 82, 87],
        borderColor: 'rgba(147, 51, 234, 1)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Target (jt)',
        data: [40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95],
        borderColor: 'rgba(209, 213, 219, 1)',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.4,
        fill: false,
      },
    ],
  };

  // Activity log data
  const recentActivities = [
    {
      id: 1,
      type: 'verification',
      message: 'Budi S. telah diverifikasi sebagai provider baru',
      time: '10 menit yang lalu',
      icon: <Users className="h-4 w-4" />,
      color: 'bg-green-100 text-green-600',
    },
    {
      id: 2,
      type: 'dispute',
      message: 'Dispute #4582 telah diselesaikan',
      time: '45 menit yang lalu',
      icon: <AlertCircle className="h-4 w-4" />,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      id: 3,
      type: 'promo',
      message: 'Promo "Diskon 15%" telah dibuat dan aktif',
      time: '1 jam yang lalu',
      icon: <DollarSign className="h-4 w-4" />,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      id: 4,
      type: 'category',
      message: 'Kategori baru "Smart Home" telah ditambahkan',
      time: '3 jam yang lalu',
      icon: <Briefcase className="h-4 w-4" />,
      color: 'bg-amber-100 text-amber-600',
    },
    {
      id: 5,
      type: 'system',
      message: 'Sistem surge pricing telah diperbarui',
      time: '5 jam yang lalu',
      icon: <LayoutDashboard className="h-4 w-4" />,
      color: 'bg-indigo-100 text-indigo-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Filter */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Admin</h1>
          <p className="text-sm text-gray-500">Ringkasan performa platform dan metrik penting</p>
        </div>
        <div className="flex space-x-2">
          <select
            value={timeRange}
            onChange={e => setTimeRange(e.target.value as any)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="today">Hari Ini</option>
            <option value="week">Minggu Ini</option>
            <option value="month">Bulan Ini</option>
            <option value="year">Tahun Ini</option>
          </select>
          <button className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Unduh Laporan
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Object.entries(metrics).map(([key, metric]) => (
          <DashboardCard
            key={key}
            title={metric.label}
            value={metric.value}
            icon={metric.icon}
            trend={metric.trend}
            isUpward={metric.isUp}
            colorClass={metric.color}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-800">Booking Mingguan</h2>
            <button className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
              Detail <ArrowRight className="ml-1 h-4 w-4" />
            </button>
          </div>
          <BarChartComponent data={weeklyBookingsData} height={250} />
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-800">Tren Pendapatan</h2>
            <button className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
              Detail <ArrowRight className="ml-1 h-4 w-4" />
            </button>
          </div>
          <LineChartComponent data={revenueData} height={250} />
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Services by Category */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-800">Distribusi Kategori</h2>
            <button className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
              Kelola <ArrowRight className="ml-1 h-4 w-4" />
            </button>
          </div>
          <PieChartComponent data={categoryData} height={220} />
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Total: 24,345 pesanan</span>
              <span>Update: 20 menit lalu</span>
            </div>
          </div>
        </div>

        {/* Activity Log */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-800">Aktivitas Terbaru</h2>
              <button className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
                Lihat Semua <ArrowRight className="ml-1 h-4 w-4" />
              </button>
            </div>
            <RecentActivityList activities={recentActivities} />
          </div>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-blue-500 hover:shadow-md">
          <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-800">Verifikasi Provider</h3>
            <p className="text-sm text-gray-500">5 menunggu persetujuan</p>
          </div>
          <ArrowRight className="ml-auto h-5 w-5 text-gray-400" />
        </div>

        <div className="flex items-center rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-blue-500 hover:shadow-md">
          <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
            <AlertCircle className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-800">Dispute & Tiket</h3>
            <p className="text-sm text-gray-500">3 perlu penyelesaian</p>
          </div>
          <ArrowRight className="ml-auto h-5 w-5 text-gray-400" />
        </div>

        <div className="flex items-center rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-blue-500 hover:shadow-md">
          <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
            <Briefcase className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-800">Kelola Kategori</h3>
            <p className="text-sm text-gray-500">20 kategori aktif</p>
          </div>
          <ArrowRight className="ml-auto h-5 w-5 text-gray-400" />
        </div>

        <div className="flex items-center rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-blue-500 hover:shadow-md">
          <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
            <DollarSign className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-800">Kelola Promo</h3>
            <p className="text-sm text-gray-500">2 promo aktif</p>
          </div>
          <ArrowRight className="ml-auto h-5 w-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
