'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import type { Route } from 'next';
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
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

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

export default function ProviderSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
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
      badge: 5, // Contoh
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
        <Link href="/provider/dashboard" className="flex items-center gap-2">
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
          className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 lg:block"
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

      <div className="mt-2 space-y-1 px-3">
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
      </div>

      <div className="mt-auto border-t border-gray-200 p-4">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
              <Store className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {user?.profile?.businessName || user?.profile?.fullName || 'Provider'}
              </h4>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
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
      {/* Desktop Sidebar */}
      <aside
        className={`hidden border-r border-gray-200 bg-white transition-all duration-300 ease-in-out lg:block ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="flex h-full flex-col">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Sidebar */}
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
