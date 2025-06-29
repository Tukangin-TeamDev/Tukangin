'use client';

import { redirect } from 'next/navigation';

export default function ProviderOrdersPage() {
  // Redirect to the "new orders" tab by default
  redirect('/provider/orders/new');
}
