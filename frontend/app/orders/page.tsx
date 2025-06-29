'use client';
import OrdersList from '@/components/orders/OrdersList';

export default function OrdersPage() {
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Pesanan Saya</h1>
      <OrdersList />
    </div>
  );
}
