'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Star,
  Package,
  CreditCard,
  Shield,
  Award,
} from 'lucide-react';
import Link from 'next/link';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  avatar?: string;
  verified: boolean;
  totalOrders: number;
  totalSpent: number;
  averageRating: number;
  loyaltyPoints: number;
  membershipLevel: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
}

const mockProfile: UserProfile = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+62 812-3456-7890',
  address: 'Jl. Sudirman No. 123, Jakarta Pusat',
  joinDate: '2023-01-15',
  verified: true,
  totalOrders: 15,
  totalSpent: 2500000,
  averageRating: 4.8,
  loyaltyPoints: 1250,
  membershipLevel: 'Gold',
};

const getMembershipColor = (level: UserProfile['membershipLevel']) => {
  switch (level) {
    case 'Bronze':
      return 'bg-amber-100 text-amber-800';
    case 'Silver':
      return 'bg-gray-100 text-gray-800';
    case 'Gold':
      return 'bg-yellow-100 text-yellow-800';
    case 'Platinum':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function ProfileView() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProfile(mockProfile);
      setLoading(false);
    }, 1000);
  }, []);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">{rating}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Profil tidak ditemukan</h3>
          <p className="text-gray-500">Terjadi kesalahan saat memuat profil Anda.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback className="text-xl">
                  {profile.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                  {profile.verified && (
                    <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      Terverifikasi
                    </Badge>
                  )}
                </div>
                <Badge
                  className={`${getMembershipColor(profile.membershipLevel)} flex items-center gap-1 w-fit`}
                >
                  <Award className="h-3 w-3" />
                  {profile.membershipLevel} Member
                </Badge>
              </div>
            </div>

            <div className="flex-1"></div>

            <Link href="/profile/edit">
              <Button className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit Profil
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informasi Pribadi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Mail className="h-4 w-4 text-gray-400" />
                    {profile.email}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Telepon</label>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {profile.phone}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Alamat</label>
                <div className="flex items-start gap-2 text-gray-900">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                  {profile.address}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Bergabung Sejak</label>
                <div className="flex items-center gap-2 text-gray-900">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {new Date(profile.joinDate).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Ringkasan Aktivitas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{profile.totalOrders}</div>
                  <div className="text-sm text-gray-600">Total Pesanan</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    Rp {(profile.totalSpent / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-sm text-gray-600">Total Pengeluaran</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    {renderStars(profile.averageRating)}
                  </div>
                  <div className="text-sm text-gray-600">Rating Rata-rata</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{profile.loyaltyPoints}</div>
                  <div className="text-sm text-gray-600">Poin Loyalitas</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Loyalty Points */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Poin Loyalitas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{profile.loyaltyPoints}</div>
                <div className="text-sm text-gray-600">Poin Tersedia</div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress ke Platinum</span>
                  <span>75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <div className="text-xs text-gray-500">250 poin lagi untuk mencapai Platinum</div>
              </div>

              <Button variant="outline" className="w-full">
                Tukar Poin
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/orders" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Package className="h-4 w-4 mr-2" />
                  Lihat Pesanan
                </Button>
              </Link>
              <Link href="/reviews" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Star className="h-4 w-4 mr-2" />
                  Review Saya
                </Button>
              </Link>
              <Button variant="outline" className="w-full justify-start">
                <CreditCard className="h-4 w-4 mr-2" />
                Metode Pembayaran
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Keamanan Akun
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
