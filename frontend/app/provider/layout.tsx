'use client';

import React, { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  Briefcase,
  ShoppingCart,
  DollarSign,
  Star,
  Store,
  Settings,
  ChevronDown,
  X,
  Menu,
  LogOut,
  Bell,
  Search,
  Moon,
  Sun,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import type { Route } from 'next';

// --- Helper Components ---

type MenuItem = {
  title: string;
  icon: ReactNode;
  path: string;
  badge?: string | number;
  submenu?: {
    title: string;
    path: string;
    badge?: string | number;
  }[];
};

function ProviderSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>('Pesanan');
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: '/provider/dashboard',
    },
    {
      title: 'Layanan Saya',
      icon: <Briefcase className="h-5 w-5" />,
      path: '/provider/services',
    },
    {
      title: 'Pesanan',
      icon: <ShoppingCart className="h-5 w-5" />,
      path: '/provider/orders',
      badge: 5,
      submenu: [
        { title: 'Pesanan Baru', path: '/provider/orders/new', badge: '2' },
        { title: 'Sedang Berjalan', path: '/provider/orders/active' },
        { title: 'Selesai', path: '/provider/orders/completed' },
        { title: 'Dibatalkan', path: '/provider/orders/cancelled' },
      ],
    },
    {
      title: 'Pendapatan',
      icon: <DollarSign className="h-5 w-5" />,
      path: '/provider/earnings',
    },
    {
      title: 'Ulasan & Rating',
      icon: <Star className="h-5 w-5" />,
      path: '/provider/reviews',
    },
    {
      title: 'Profil Toko',
      icon: <Store className="h-5 w-5" />,
      path: '/provider/profile',
    },
    {
      title: 'Pengaturan',
      icon: <Settings className="h-5 w-5" />,
      path: '/provider/settings',
    },
  ];

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title);
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const closeMobileSidebar = () => {
    setMobileOpen(false);
  };

  const SidebarContent = () => (
    <>
      <div className="flex items-center justify-between px-4 py-3">
        <Link href={'/provider/dashboard' as Route} className="flex items-center gap-2">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Image src="/logo-tukangin.png" width={40} height={40} alt="Tukangin Logo" />
              <span className="text-lg font-bold text-green-600">Provider Panel</span>
            </div>
          )}
          {collapsed && (
            <Image src="/logo-tukangin.png" width={30} height={30} alt="Tukangin Logo" />
          )}
        </Link>
        <button
          onClick={toggleSidebar}
          className="hidden rounded-md p-1.5 text-gray-500 hover:bg-gray-100 lg:block"
        >
          <Menu className="h-5 w-5" />
        </button>
        <button
          onClick={closeMobileSidebar}
          className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto px-3">
        {menuItems.map(item => {
          const isActive = pathname.startsWith(item.path);
          const hasSubmenu = item.submenu && item.submenu.length > 0;
          return (
            <div key={item.title} className="mb-2">
              {hasSubmenu ? (
                <div>
                  <button
                    onClick={() => toggleSubmenu(item.title)}
                    className={`flex w-full items-center justify-between rounded-lg p-2 text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-green-50 text-green-600'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-green-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500">{item.icon}</span>
                      {!collapsed && <span>{item.title}</span>}
                    </div>
                    {!collapsed && (
                      <div className="flex items-center gap-1">
                        {item.badge && (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-xs font-medium text-green-800">
                            {item.badge}
                          </span>
                        )}
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            openSubmenu === item.title ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    )}
                  </button>
                  {!collapsed && openSubmenu === item.title && (
                    <div className="ml-6 mt-1 space-y-1 border-l border-gray-200 pl-2">
                      {item.submenu?.map(subItem => (
                        <Link
                          key={subItem.title}
                          href={subItem.path as Route}
                          className={`flex items-center justify-between rounded-lg p-2 text-sm transition-all ${
                            pathname === subItem.path
                              ? 'bg-green-50 text-green-600'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-green-600'
                          }`}
                        >
                          <span>{subItem.title}</span>
                          {subItem.badge && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-xs font-medium text-green-800">
                              {subItem.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.path as Route}
                  className={`flex items-center justify-between rounded-lg p-2 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-green-50 text-green-600'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-green-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-green-600' : 'text-gray-500'}>
                      {item.icon}
                    </span>
                    {!collapsed && <span>{item.title}</span>}
                  </div>
                </Link>
              )}
            </div>
          );
        })}
      </nav>
      <div className="mt-auto border-t border-gray-200 p-4">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
              <Store className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h4 className="truncate text-sm font-medium text-gray-900">
                {user?.profile?.businessName || user?.profile?.fullName || 'Provider'}
              </h4>
              <p className="truncate text-xs text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-red-500"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={logout}
            className="flex w-full items-center justify-center rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-red-500"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        )}
      </div>
    </>
  );

  return (
    <>
      <aside
        className={`hidden border-r border-gray-200 bg-white transition-all duration-300 ease-in-out lg:block ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="flex h-full flex-col">
          <SidebarContent />
        </div>
      </aside>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-4 left-4 z-30 rounded-full bg-green-600 p-3 text-white shadow-lg lg:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
          onClick={closeMobileSidebar}
        ></div>
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <SidebarContent />
        </div>
      </aside>
    </>
  );
}

function ProviderNavbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const notifications = [
    {
      id: 1,
      title: 'Pesanan Baru',
      message: 'Anda menerima pesanan baru untuk layanan "Servis AC"',
      time: '5 menit yang lalu',
      read: false,
    },
    {
      id: 2,
      title: 'Ulasan Diterima',
      message: 'Pelanggan memberikan ulasan bintang 5 untuk pesanan #12345',
      time: '1 jam yang lalu',
      read: false,
    },
    {
      id: 3,
      title: 'Pembayaran Diterima',
      message: 'Pembayaran sebesar Rp 250.000 telah masuk ke saldo Anda',
      time: 'Kemarin',
      read: true,
    },
  ];

  return (
    <header className="z-10 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="hidden lg:block lg:w-64"></div>
        <div className="ml-4 hidden max-w-md flex-1 md:block">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="search"
              placeholder="Cari pesanan, pelanggan..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={toggleTheme}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (showUserMenu) setShowUserMenu(false);
              }}
              className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
              <Bell className="h-5 w-5" />
              {notifications.some(n => !n.read) && (
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <h3 className="font-medium">Notifikasi</h3>
                  <button className="text-xs text-blue-600 hover:underline">
                    Tandai semua telah dibaca
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto py-1">
                  {notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`mb-1 rounded-md p-2 transition-colors ${
                        notification.read ? 'bg-white' : 'bg-green-50'
                      } hover:bg-gray-50`}
                    >
                      <p
                        className={`text-sm font-medium ${
                          notification.read ? '' : 'text-green-600'
                        }`}
                      >
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-500">{notification.message}</p>
                      <p className="mt-1 text-xs text-gray-400">{notification.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="relative ml-2">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                if (showNotifications) setShowNotifications(false);
              }}
              className="flex items-center rounded-full text-sm focus:outline-none"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                <Store className="h-4 w-4" />
              </div>
              <span className="ml-2 hidden text-gray-700 lg:block">
                {user?.profile?.businessName || user?.profile?.fullName || 'Provider'}
              </span>
              <ChevronDown className="ml-1 hidden h-4 w-4 text-gray-500 lg:block" />
            </button>
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                <div className="border-b border-gray-200 px-4 py-2">
                  <p className="truncate text-sm font-medium">
                    {user?.profile?.businessName || user?.profile?.fullName || 'Provider'}
                  </p>
                  <p className="truncate text-xs text-gray-500">{user?.email}</p>
                </div>
                <Link
                  href={'/provider/profile' as Route}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Store className="mr-2 h-4 w-4" />
                  Profil Toko
                </Link>
                <Link
                  href={'/provider/settings' as Route}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Pengaturan
                </Link>
                <button
                  onClick={logout}
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

// --- Main Layout Component ---

export default function ProviderLayout({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!isAuthenticated || (user && user.role !== 'PROVIDER'))) {
      router.push('/login?redirectTo=/provider/dashboard');
    }
  }, [user, isAuthenticated, loading, router]);

  if (loading || !isAuthenticated || (user && user.role !== 'PROVIDER')) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
          <p className="text-lg font-medium text-gray-700">Memuat dashboard provider...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-gray-50">
      <ProviderSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <ProviderNavbar />
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
