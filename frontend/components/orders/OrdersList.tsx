'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, User, Star, Package, Truck, CheckCircle } from 'lucide-react';

interface Order {
  id: string;
  serviceTitle: string;
  providerName: string;
  date: string;
  time: string;
  location: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  price: number;
  rating?: number;
  image?: string;
}

const mockOrders: Order[] = [
  {
    id: '1',
    serviceTitle: 'Perbaikan AC',
    providerName: 'Tukang AC Jakarta',
    date: '2024-01-15',
    time: '10:00',
    location: 'Jakarta Pusat',
    status: 'completed',
    price: 250000,
    rating: 4.8,
    image: '/api/placeholder/300/200',
  },
  {
    id: '2',
    serviceTitle: 'Instalasi Listrik',
    providerName: 'Listrik Pro',
    date: '2024-01-20',
    time: '14:00',
    location: 'Jakarta Selatan',
    status: 'in-progress',
    price: 500000,
    image: '/api/placeholder/300/200',
  },
  {
    id: '3',
    serviceTitle: 'Perbaikan Plumbing',
    providerName: 'Plumber Expert',
    date: '2024-01-25',
    time: '09:00',
    location: 'Jakarta Barat',
    status: 'confirmed',
    price: 300000,
    image: '/api/placeholder/300/200',
  },
];

const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'confirmed':
      return 'bg-blue-100 text-blue-800';
    case 'in-progress':
      return 'bg-purple-100 text-purple-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4" />;
    case 'confirmed':
      return <CheckCircle className="h-4 w-4" />;
    case 'in-progress':
      return <Truck className="h-4 w-4" />;
    case 'completed':
      return <Package className="h-4 w-4" />;
    case 'cancelled':
      return <Clock className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getStatusText = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return 'Menunggu Konfirmasi';
    case 'confirmed':
      return 'Dikonfirmasi';
    case 'in-progress':
      return 'Sedang Dikerjakan';
    case 'completed':
      return 'Selesai';
    case 'cancelled':
      return 'Dibatalkan';
    default:
      return status;
  }
};

export default function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | Order['status']>('all');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredOrders =
    filter === 'all' ? orders : orders.filter(order => order.status === filter);

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
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex space-x-4">
                <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          className="text-sm"
        >
          Semua
        </Button>
        <Button
          variant={filter === 'pending' ? 'default' : 'outline'}
          onClick={() => setFilter('pending')}
          className="text-sm"
        >
          Menunggu
        </Button>
        <Button
          variant={filter === 'confirmed' ? 'default' : 'outline'}
          onClick={() => setFilter('confirmed')}
          className="text-sm"
        >
          Dikonfirmasi
        </Button>
        <Button
          variant={filter === 'in-progress' ? 'default' : 'outline'}
          onClick={() => setFilter('in-progress')}
          className="text-sm"
        >
          Berlangsung
        </Button>
        <Button
          variant={filter === 'completed' ? 'default' : 'outline'}
          onClick={() => setFilter('completed')}
          className="text-sm"
        >
          Selesai
        </Button>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada pesanan</h3>
            <p className="text-gray-500">
              {filter === 'all'
                ? 'Anda belum memiliki pesanan apapun.'
                : `Tidak ada pesanan dengan status "${getStatusText(filter as Order['status'])}".`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Service Image */}
                  <div className="w-full md:w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>

                  {/* Order Details */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">
                          {order.serviceTitle}
                        </h3>
                        <div className="flex items-center gap-1 text-gray-600">
                          <User className="h-4 w-4" />
                          <span className="text-sm">{order.providerName}</span>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
                        {getStatusIcon(order.status)}
                        {getStatusText(order.status)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(order.date).toLocaleDateString('id-ID')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{order.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{order.location}</span>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div className="flex items-center gap-4">
                        <div className="text-lg font-semibold text-green-600">
                          Rp {order.price.toLocaleString('id-ID')}
                        </div>
                        {order.rating && (
                          <div className="flex items-center">{renderStars(order.rating)}</div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {order.status === 'completed' && !order.rating && (
                          <Button variant="outline" size="sm">
                            Beri Rating
                          </Button>
                        )}
                        {order.status === 'pending' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            Batalkan
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          Detail
                        </Button>
                        {order.status === 'completed' && <Button size="sm">Pesan Lagi</Button>}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
