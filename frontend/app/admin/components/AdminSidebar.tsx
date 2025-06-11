'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutDashboard,
  TagIcon,
  ShieldAlert,
  BarChart3,
  Tag,
  LifeBuoy,
  Settings,
  ChevronDown,
  X,
  Menu,
  LogOut,
  UserSquare,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

type MenuItem = {
  title: string;
  icon: React.ReactNode;
  path: string;
  badge?: string | number;
  submenu?: {
    title: string;
    path: string;
    badge?: string | number;
  }[];
};

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: '/admin/dashboard',
    },
    {
      title: 'Manajemen Kategori & Zona',
      icon: <TagIcon className="h-5 w-5" />,
      path: '/admin/categories',
      submenu: [
        { title: 'Kategori & Subkategori', path: '/admin/categories' },
        { title: 'Zona & Wilayah', path: '/admin/zones' },
        { title: 'Harga Minimum', path: '/admin/pricing' },
      ],
    },
    {
      title: 'Verifikasi & Moderasi',
      icon: <ShieldAlert className="h-5 w-5" />,
      path: '/admin/verification',
      badge: '8', // Contoh jumlah yang butuh verifikasi
      submenu: [
        { title: 'Provider Baru', path: '/admin/verification/providers', badge: '5' },
        { title: 'Laporan Review', path: '/admin/verification/reviews', badge: '2' },
        { title: 'Laporan Chat', path: '/admin/verification/chats', badge: '1' },
      ],
    },
    {
      title: 'Laporan & Analitik',
      icon: <BarChart3 className="h-5 w-5" />,
      path: '/admin/reports',
      submenu: [
        { title: 'Dashboard Utama', path: '/admin/reports/main' },
        { title: 'Performa Platform', path: '/admin/reports/platform' },
        { title: 'Performa Provider', path: '/admin/reports/providers' },
        { title: 'Analisis Pengguna', path: '/admin/reports/users' },
        { title: 'Laporan Keuangan', path: '/admin/reports/finance' },
      ],
    },
    {
      title: 'Promo & Harga Dinamis',
      icon: <Tag className="h-5 w-5" />,
      path: '/admin/promotions',
      submenu: [
        { title: 'Voucher & Diskon', path: '/admin/promotions/vouchers' },
        { title: 'Atur Surge Pricing', path: '/admin/promotions/surge' },
        { title: 'Kampanye & Event', path: '/admin/promotions/campaigns' },
      ],
    },
    {
      title: 'Ticketing & Dispute',
      icon: <LifeBuoy className="h-5 w-5" />,
      path: '/admin/tickets',
      badge: '3', // Contoh jumlah tiket yang aktif
      submenu: [
        { title: 'Tiket Terbuka', path: '/admin/tickets/open', badge: '3' },
        { title: 'Histori Penyelesaian', path: '/admin/tickets/history' },
        { title: 'Dispute Resolution', path: '/admin/tickets/disputes' },
      ],
    },
    {
      title: 'Pengaturan Platform',
      icon: <Settings className="h-5 w-5" />,
      path: '/admin/settings',
      submenu: [
        { title: 'Komisi & Biaya', path: '/admin/settings/fees' },
        { title: 'Integrasi Pembayaran', path: '/admin/settings/payments' },
        { title: 'Template Notifikasi', path: '/admin/settings/notifications' },
        { title: 'Pengaturan Umum', path: '/admin/settings/general' },
      ],
    },
  ];

  const toggleSubmenu = (title: string) => {
    if (openSubmenu === title) {
      setOpenSubmenu(null);
    } else {
      setOpenSubmenu(title);
    }
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const closeMobileSidebar = () => {
    setMobileOpen(false);
  };

  // Sidebar untuk desktop
  const SidebarContent = () => (
    <>
      <div className="flex items-center justify-between px-4 py-3">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Image src="/logo-tukangin.png" width={40} height={40} alt="Tukangin Logo" />
              <span className="text-lg font-bold text-blue-600">Admin Panel</span>
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
          const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
          const hasSubmenu = item.submenu && item.submenu.length > 0;

          return (
            <div key={item.title} className="mb-2">
              {hasSubmenu ? (
                <div className="space-y-1">
                  <button
                    onClick={() => toggleSubmenu(item.title)}
                    className={`flex w-full items-center justify-between rounded-lg p-2 text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500">{item.icon}</span>
                      {!collapsed && <span>{item.title}</span>}
                    </div>
                    {!collapsed && (
                      <div className="flex items-center gap-1">
                        {item.badge && (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-800">
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
                    <div className="ml-6 space-y-1 pl-2 border-l border-gray-200">
                      {item.submenu?.map(subItem => {
                        const isSubActive = pathname === subItem.path;
                        return (
                          <Link
                            key={subItem.title}
                            href={subItem.path}
                            className={`flex items-center justify-between rounded-lg p-2 text-sm transition-all ${
                              isSubActive
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                            }`}
                          >
                            <span>{subItem.title}</span>
                            {subItem.badge && (
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-800">
                                {subItem.badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.path}
                  className={`flex items-center justify-between rounded-lg p-2 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-blue-600' : 'text-gray-500'}>
                      {item.icon}
                    </span>
                    {!collapsed && <span>{item.title}</span>}
                  </div>
                  {!collapsed && item.badge && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-800">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {/* Admin Profile Section */}
      <div className="mt-auto border-t border-gray-200 p-4">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <UserSquare className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900">
                {user?.profile?.fullName || 'Admin'}
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
        className={`hidden border-r border-gray-200 transition-all duration-300 ease-in-out lg:block ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="flex h-full flex-col">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Sidebar Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-10 bg-gray-900/50 lg:hidden"
          onClick={closeMobileSidebar}
        ></div>
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-20 w-64 transform border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-4 left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>
    </>
  );
}
