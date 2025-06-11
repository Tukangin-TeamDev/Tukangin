'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AdminSidebar from './components/AdminSidebar';
import AdminNavbar from './components/AdminNavbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Pastikan hanya admin yang bisa mengakses
    if (!loading && (!isAuthenticated || (user && user.role !== 'ADMIN'))) {
      router.push('/login?redirectTo=/admin/dashboard');
    }
  }, [user, isAuthenticated, loading, router]);

  // Tampilkan loading screen jika masih memuat atau belum terautentikasi
  if (loading || !isAuthenticated || (user && user.role !== 'ADMIN')) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-lg font-medium text-gray-700">Memuat dashboard admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminNavbar />

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
