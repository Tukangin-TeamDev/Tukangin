'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Phone,
  Mail,
  Star,
  Shield,
  Clock,
  Calendar,
  CheckCircle,
  Info,
} from 'lucide-react';

export default function ProviderProfilePage() {
  // Data provider (dalam implementasi nyata, data ini akan diambil dari API)
  const [providerData] = useState({
    id: 'p123456',
    name: 'Bengkel Jaya',
    photo: '/placeholder.svg?height=200&width=200',
    rating: 4.8,
    reviewCount: 124,
    verificationStatus: 'verified', // verified, pending, rejected
    verificationDate: '12 Mei 2023',
    joinDate: 'September 2022',
    description:
      'Bengkel Jaya adalah penyedia jasa perbaikan rumah yang berpengalaman lebih dari 10 tahun. Kami menawarkan berbagai layanan perbaikan rumah dengan kualitas terbaik dan harga yang terjangkau.',
    contactInfo: {
      phone: '+62812-3456-7890',
      email: 'bengjay@example.com',
      address: 'Jakarta Selatan, DKI Jakarta',
      serviceAreas: ['Jakarta Selatan', 'Jakarta Timur', 'Jakarta Pusat'],
      maxDistance: '15 km',
    },
    serviceHours: {
      days: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
      hours: '08:00 - 17:00',
    },
    skills: [
      'Perbaikan Listrik',
      'Instalasi Lampu',
      'Pengecekan Tegangan',
      'Pemeliharaan Panel',
      'Perbaikan Kabel',
      'Pemasangan Stop Kontak',
    ],
    experience: {
      years: '10+ tahun',
      level: 'Ahli',
      highlights: [
        'Pemasangan instalasi listrik di lebih dari 500 rumah',
        'Tersertifikasi dari Kementerian Ketenagakerjaan',
        'Pernah menangani 150+ proyek besar',
      ],
    },
    stats: {
      completedJobs: 245,
      cancelledJobs: 3,
      onTimeRate: 98,
      responseRate: 99,
    },
    services: [
      {
        id: 's1',
        title: 'Perbaikan Instalasi Listrik',
        image: '/placeholder.svg?height=150&width=200',
        price: 'Rp 150.000 / jam',
        rating: 4.9,
        reviewCount: 89,
      },
      {
        id: 's2',
        title: 'Instalasi Lampu dan Saklar',
        image: '/placeholder.svg?height=150&width=200',
        price: 'Rp 200.000 / unit',
        rating: 4.7,
        reviewCount: 35,
      },
      {
        id: 's3',
        title: 'Pengecekan Beban Listrik',
        image: '/placeholder.svg?height=150&width=200',
        price: 'Rp 300.000 / rumah',
        rating: 4.8,
        reviewCount: 42,
      },
    ],
    reviews: [
      {
        id: 'r1',
        user: 'Andi Wijaya',
        userPhoto: '/placeholder.svg?height=40&width=40',
        date: '15 Mei 2023',
        rating: 5,
        comment:
          'Sangat puas dengan pekerjaan Bengkel Jaya. Mereka datang tepat waktu, profesional, dan hasil kerjanya rapi. Instalasi listrik saya sekarang bekerja dengan baik.',
        serviceName: 'Perbaikan Instalasi Listrik',
      },
      {
        id: 'r2',
        user: 'Dewi Lestari',
        userPhoto: '/placeholder.svg?height=40&width=40',
        date: '3 Mei 2023',
        rating: 5,
        comment:
          'Teknisi sangat terampil dan ramah. Menjelaskan dengan detail apa yang perlu diperbaiki dan memberikan tips cara perawatan. Sangat direkomendasikan!',
        serviceName: 'Pengecekan Beban Listrik',
      },
      {
        id: 'r3',
        user: 'Budi Santoso',
        userPhoto: '/placeholder.svg?height=40&width=40',
        date: '28 April 2023',
        rating: 4,
        comment:
          'Pelayanan baik dan cepat. Hanya saja ada sedikit keterlambatan dari jadwal yang sudah ditentukan. Tapi secara keseluruhan puas dengan hasilnya.',
        serviceName: 'Instalasi Lampu dan Saklar',
      },
    ],
  });

  const [activeTab, setActiveTab] = useState('services'); // services, reviews, about

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-6xl">
          {/* Header/Profile Card */}
          <div className="mb-8 overflow-hidden rounded-xl bg-white shadow">
            <div className="relative h-32 bg-gradient-to-r from-blue-500 to-blue-600">
              {/* Provider photo */}
              <div className="absolute bottom-0 left-6 -mb-12 overflow-hidden rounded-xl border-4 border-white bg-white shadow-md">
                <Image
                  src={providerData.photo}
                  alt={providerData.name}
                  width={96}
                  height={96}
                  className="h-24 w-24 object-cover"
                />
              </div>
            </div>

            <div className="p-4 pt-16 md:p-6 md:pt-16">
              <div className="flex flex-col justify-between md:flex-row md:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-gray-900">{providerData.name}</h1>
                    {providerData.verificationStatus === 'verified' && (
                      <div className="flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-blue-700">
                        <Shield className="mr-1 h-3.5 w-3.5" />
                        <span className="text-xs font-medium">Terverifikasi</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-1 flex items-center text-sm text-gray-600">
                    <MapPin className="mr-1 h-4 w-4 text-gray-400" />
                    {providerData.contactInfo.address}
                  </div>

                  <div className="mt-2 flex items-center">
                    <div className="flex items-center">
                      <Star className="mr-1 h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{providerData.rating}</span>
                    </div>
                    <span className="mx-1.5 text-gray-400">•</span>
                    <span className="text-gray-600">{providerData.reviewCount} ulasan</span>
                    <span className="mx-1.5 text-gray-400">•</span>
                    <span className="text-gray-600">
                      {providerData.stats.completedJobs} pekerjaan selesai
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex gap-3 md:mt-0">
                  <Link
                    href={`/chat?provider=${providerData.id}`}
                    className="rounded-lg border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                  >
                    Hubungi
                  </Link>
                  <Link
                    href="#services"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    onClick={() => setActiveTab('services')}
                  >
                    Lihat Layanan
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left column - Info */}
            <div className="space-y-6 lg:col-span-1">
              {/* Provider information */}
              <div className="rounded-xl bg-white p-5 shadow">
                <h2 className="mb-4 text-lg font-bold">Informasi Kontak</h2>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <Phone className="mr-3 h-5 w-5 text-gray-500" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Telepon</h4>
                      <p className="text-sm text-gray-600">{providerData.contactInfo.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Mail className="mr-3 h-5 w-5 text-gray-500" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Email</h4>
                      <p className="text-sm text-gray-600">{providerData.contactInfo.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="mr-3 h-5 w-5 text-gray-500" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Area Layanan</h4>
                      <p className="text-sm text-gray-600">
                        {providerData.contactInfo.serviceAreas.join(', ')}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        Radius: {providerData.contactInfo.maxDistance}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="mr-3 h-5 w-5 text-gray-500" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Jam Layanan</h4>
                      <p className="text-sm text-gray-600">
                        {providerData.serviceHours.days.join(', ')}
                        <br />
                        {providerData.serviceHours.hours}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="rounded-xl bg-white p-5 shadow">
                <h2 className="mb-4 text-lg font-bold">Keahlian</h2>
                <div className="flex flex-wrap gap-2">
                  {providerData.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="rounded-xl bg-white p-5 shadow">
                <h2 className="mb-4 text-lg font-bold">Statistik</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-gray-50 p-3 text-center">
                    <span className="block text-lg font-bold text-blue-600">
                      {providerData.stats.completedJobs}
                    </span>
                    <span className="text-xs text-gray-500">Pekerjaan Selesai</span>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-center">
                    <span className="block text-lg font-bold text-green-600">
                      {providerData.stats.onTimeRate}%
                    </span>
                    <span className="text-xs text-gray-500">Tepat Waktu</span>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-center">
                    <span className="block text-lg font-bold text-blue-600">
                      {providerData.stats.responseRate}%
                    </span>
                    <span className="text-xs text-gray-500">Rasio Respon</span>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-center">
                    <span className="block text-lg font-bold text-gray-600">
                      {providerData.experience.years}
                    </span>
                    <span className="text-xs text-gray-500">Pengalaman</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - Services/Reviews/About */}
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="mb-4 flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('services')}
                  className={`mr-4 border-b-2 py-2 text-sm font-medium ${
                    activeTab === 'services'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Layanan
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`mr-4 border-b-2 py-2 text-sm font-medium ${
                    activeTab === 'reviews'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Ulasan
                </button>
                <button
                  onClick={() => setActiveTab('about')}
                  className={`mr-4 border-b-2 py-2 text-sm font-medium ${
                    activeTab === 'about'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Tentang
                </button>
              </div>

              {/* Services Tab */}
              {activeTab === 'services' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Layanan yang Ditawarkan</h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {providerData.services.map(service => (
                      <Link
                        href={`/services/${service.id}`}
                        key={service.id}
                        className="overflow-hidden rounded-lg bg-white shadow transition-shadow hover:shadow-md"
                      >
                        <div className="relative h-40">
                          <Image
                            src={service.image}
                            alt={service.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="mb-1 font-semibold">{service.title}</h3>
                          <p className="mb-2 text-sm text-gray-600">{service.price}</p>
                          <div className="flex items-center text-sm">
                            <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{service.rating}</span>
                            <span className="ml-1 text-gray-500">
                              ({service.reviewCount} ulasan)
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Ulasan dari Pelanggan</h2>
                    <div className="flex items-center">
                      <Star className="mr-1 h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{providerData.rating}</span>
                      <span className="ml-1 text-sm text-gray-500">
                        ({providerData.reviewCount} ulasan)
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {providerData.reviews.map(review => (
                      <div key={review.id} className="rounded-lg bg-white p-4 shadow">
                        <div className="mb-3 flex items-start justify-between">
                          <div className="flex items-center">
                            <Image
                              src={review.userPhoto}
                              alt={review.user}
                              width={40}
                              height={40}
                              className="mr-3 rounded-full"
                            />
                            <div>
                              <h4 className="font-medium">{review.user}</h4>
                              <p className="text-xs text-gray-500">{review.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700">{review.comment}</p>
                        <div className="mt-2 rounded-md bg-gray-50 px-3 py-1">
                          <p className="text-xs text-gray-500">Layanan: {review.serviceName}</p>
                        </div>
                      </div>
                    ))}

                    {providerData.reviews.length > 0 && (
                      <div className="mt-4 text-center">
                        <Link
                          href={`/provider/${providerData.id}/reviews`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          Lihat semua ulasan
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* About Tab */}
              {activeTab === 'about' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="mb-3 text-xl font-bold">Tentang {providerData.name}</h2>
                    <p className="text-gray-700">{providerData.description}</p>
                  </div>

                  <div>
                    <h3 className="mb-3 text-lg font-semibold">Pengalaman</h3>
                    <div className="mb-2 flex items-center">
                      <Calendar className="mr-2 h-5 w-5 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Menjadi penyedia jasa sejak {providerData.joinDate}
                      </span>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-4">
                      <div className="mb-3 flex items-center">
                        <span className="mr-2 rounded-full bg-blue-100 p-1.5">
                          <Briefcase className="h-4 w-4 text-blue-700" />
                        </span>
                        <span className="font-medium">
                          {providerData.experience.level} • {providerData.experience.years}
                        </span>
                      </div>
                      <ul className="ml-4 space-y-2">
                        {providerData.experience.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                            <span className="text-sm">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-lg font-semibold">Verifikasi</h3>
                    <div className="rounded-lg bg-blue-50 p-4">
                      <div className="flex items-center">
                        <div className="mr-4 rounded-full bg-blue-100 p-2">
                          <Shield className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Penyedia Jasa Terverifikasi</h4>
                          <p className="text-sm text-gray-600">
                            Identitas dan kualifikasi telah diverifikasi pada{' '}
                            {providerData.verificationDate}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
