import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star } from 'lucide-react';

interface ServiceProvider {
  id: string;
  name: string;
  rating: number;
  location: string;
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

interface PersonalizedRecommendationsProps {
  recommendations: RecommendedService[];
}

export function PersonalizedRecommendations({ recommendations }: PersonalizedRecommendationsProps) {
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
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
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

      {recommendations.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Belum ada rekomendasi</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map(service => (
            <div
              key={service.id}
              className="rounded-lg bg-white overflow-hidden border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300"
            >
              <div className="relative h-36">
                <Image
                  src={service.image || '/placeholder.svg'}
                  alt={service.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div
                  className={`absolute top-2 left-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
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
                <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-blue-600 px-2 py-0.5 rounded-full text-xs font-medium">
                  <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                  <span>{service.rating.toFixed(1)}</span>
                </div>
              </div>

              <div className="p-3">
                <h3 className="font-medium text-sm line-clamp-1">{service.title}</h3>
                <p className="text-xs text-blue-600 mb-1">{service.provider.name}</p>
                <p className="text-xs text-gray-500 line-clamp-2 mb-2">{service.reason}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm text-green-600">
                    {formatPrice(service.price)}
                  </span>
                  <Link
                    href={`/services/${service.id}`}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Detail
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
