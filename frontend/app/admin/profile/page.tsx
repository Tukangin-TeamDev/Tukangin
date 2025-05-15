'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Mail, Phone, MapPin, Edit, Star, Calendar, Users, Award, Clock } from 'lucide-react';

export default function AdminProfilePage() {
  const [profile, setProfile] = useState({
    name: 'Bengkel Jaya',
    email: 'bengkeljaya@example.com',
    phone: '+62 812-3456-7890',
    address: 'Jl. Raya Bogor No. 123, Jakarta Timur',
    description:
      'Bengkel Jaya adalah penyedia jasa perbaikan rumah terpercaya dengan pengalaman lebih dari 5 tahun. Kami menawarkan berbagai layanan perbaikan dan renovasi dengan kualitas terbaik dan harga terjangkau.',
    established: '2018',
    employees: '8',
    rating: 4.8,
    reviews: 35,
    completedProjects: 127,
    responseTime: '< 1 jam',
  });

  const [services, setServices] = useState([
    {
      id: 's1',
      name: 'Perbaikan Atap',
      description: 'Perbaikan kebocoran dan kerusakan pada atap rumah',
      price: 350000,
      image: '/placeholder.svg?height=120&width=120',
      isActive: true,
    },
    {
      id: 's2',
      name: 'Instalasi Listrik',
      description: 'Pemasangan dan perbaikan instalasi listrik rumah',
      price: 750000,
      image: '/placeholder.svg?height=120&width=120',
      isActive: true,
    },
    {
      id: 's3',
      name: 'Pengecatan',
      description: 'Pengecatan interior dan eksterior rumah',
      price: 250000,
      image: '/placeholder.svg?height=120&width=120',
      isActive: true,
    },
  ]);

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

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Profil Toko</h1>
          <p className="text-gray-600">Kelola informasi profil dan layanan toko Anda</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
          <Edit className="h-4 w-4" />
          Edit Profil
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mb-6">
            <Image
              src="/placeholder.svg?height=120&width=120"
              alt="Store Logo"
              width={120}
              height={120}
              className="rounded-lg border border-gray-200"
            />
            <div>
              <h2 className="text-2xl font-bold">{profile.name}</h2>
              <div className="flex items-center mt-1">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                </div>
                <span className="ml-2 text-sm">
                  {profile.rating} ({profile.reviews} ulasan)
                </span>
              </div>
              <div className="flex flex-wrap gap-4 mt-3">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                  <span>Berdiri sejak {profile.established}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-1 text-gray-500" />
                  <span>{profile.employees} karyawan</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-1 text-gray-500" />
                  <span>Respon {profile.responseTime}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Tentang Toko</h3>
            <p className="text-gray-700">{profile.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="border rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Mail className="h-5 w-5 text-gray-400 mr-2" />
                <h4 className="font-medium">Email</h4>
              </div>
              <p>{profile.email}</p>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Phone className="h-5 w-5 text-gray-400 mr-2" />
                <h4 className="font-medium">Telepon</h4>
              </div>
              <p>{profile.phone}</p>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center mb-2">
                <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                <h4 className="font-medium">Alamat</h4>
              </div>
              <p>{profile.address}</p>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Award className="h-5 w-5 text-gray-400 mr-2" />
                <h4 className="font-medium">Proyek Selesai</h4>
              </div>
              <p>{profile.completedProjects} proyek</p>
            </div>
          </div>
        </div>

        {/* Stats and Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold mb-4">Statistik Toko</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Rating</span>
                <span className="font-medium">{profile.rating}/5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Ulasan</span>
                <span className="font-medium">{profile.reviews}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Proyek Selesai</span>
                <span className="font-medium">{profile.completedProjects}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Waktu Respon</span>
                <span className="font-medium">{profile.responseTime}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold mb-4">Aksi Cepat</h3>
            <div className="space-y-2">
              <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Tambah Layanan Baru
              </button>
              <button className="w-full py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                Lihat Semua Ulasan
              </button>
              <button className="w-full py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                Kelola Portofolio
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Layanan Saya</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            <Edit className="h-4 w-4" />
            Kelola Layanan
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map(service => (
            <div
              key={service.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
            >
              <div className="relative h-40 bg-gray-100">
                <Image
                  src={service.image || '/placeholder.svg'}
                  alt={service.name}
                  fill
                  className="object-cover"
                />
                {service.isActive ? (
                  <span className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Aktif
                  </span>
                ) : (
                  <span className="absolute top-2 right-2 bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Nonaktif
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{service.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{service.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="font-bold text-lg text-green-600">
                    {formatPrice(service.price)}
                  </span>
                  <button className="text-blue-600 hover:text-blue-800">Edit</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
