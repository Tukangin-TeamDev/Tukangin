'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Home,
  ShoppingCart,
  Package,
  MessageSquare,
  User,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleSubmenu = () => {
    setIsSubmenuOpen(!isSubmenuOpen);
  };

  return (
    <div
      className={cn(
        'flex flex-col h-screen transition-all duration-300 bg-white shadow-md relative',
        isCollapsed ? 'w-[70px]' : 'w-[275px]',
        className
      )}
    >
      {/* Mobile toggle button - visible only on small screens */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-10 top-3 md:hidden"
        onClick={toggleSidebar}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Desktop toggle button - visible only on medium and larger screens */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-3 hidden md:flex h-8 w-8 rounded-full bg-white shadow-sm"
        onClick={toggleSidebar}
      >
        <ChevronRight
          className={cn('h-4 w-4 transition-transform', !isCollapsed && 'rotate-180')}
        />
      </Button>

      {/* Header */}
      <div className="p-4 flex items-center">
        <h1
          className={cn(
            'font-bold text-2xl transition-opacity',
            isCollapsed ? 'opacity-0 w-0' : 'opacity-100'
          )}
        >
          Dashboard
        </h1>
        {isCollapsed && <Home className="h-6 w-6 mx-auto" />}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {/* Dashboard */}
          <li>
            <Link
              href="#"
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-[rgba(30,131,155,0.25)] to-[rgba(22,163,74,0.25)]',
                isCollapsed && 'justify-center p-2'
              )}
            >
              <Home className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>Dashboard</span>}
            </Link>
          </li>

          {/* Cari Layanan */}
          <li>
            <Link
              href="#"
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100',
                isCollapsed && 'justify-center p-2'
              )}
            >
              <ShoppingCart className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>Cari Layanan</span>}
            </Link>
          </li>

          {/* Pesanan Saya */}
          <li>
            <button
              onClick={toggleSubmenu}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg w-full text-left hover:bg-gray-100',
                isCollapsed && 'justify-center p-2'
              )}
            >
              <Package className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && (
                <>
                  <span>Pesanan Saya</span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 ml-auto transition-transform',
                      isSubmenuOpen && 'rotate-180'
                    )}
                  />
                </>
              )}
            </button>

            {!isCollapsed && isSubmenuOpen && (
              <ul className="ml-8 mt-1 border-l pl-2 space-y-1">
                <li>
                  <Link
                    href="#"
                    className="flex items-center gap-2 p-2 text-sm hover:text-blue-600"
                  >
                    Aktif
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="flex items-center gap-2 p-2 text-sm hover:text-blue-600"
                  >
                    Selesai
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="flex items-center gap-2 p-2 text-sm hover:text-blue-600"
                  >
                    Dibatalkan
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Pesan */}
          <li>
            <Link
              href="#"
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100',
                isCollapsed && 'justify-center p-2'
              )}
            >
              <MessageSquare className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>Pesan</span>}
            </Link>
          </li>

          {/* Profil */}
          <li>
            <Link
              href="#"
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100',
                isCollapsed && 'justify-center p-2'
              )}
            >
              <User className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>Profil</span>}
            </Link>
          </li>

          {/* Pengaturan */}
          <li>
            <Link
              href="#"
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100',
                isCollapsed && 'justify-center p-2'
              )}
            >
              <Settings className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>Pengaturan</span>}
            </Link>
          </li>

          {/* Bantuan */}
          <li>
            <Link
              href="#"
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100',
                isCollapsed && 'justify-center p-2'
              )}
            >
              <HelpCircle className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>Bantuan</span>}
            </Link>
          </li>
        </ul>
      </nav>

      {/* Help Card - Only visible when sidebar is expanded */}
      {!isCollapsed && (
        <div className="p-4 mt-auto">
          <div className="bg-white rounded-lg p-4 shadow-inner border">
            <div className="flex items-center justify-center mb-2">
              <HelpCircle className="h-5 w-5 text-orange-500" />
            </div>
            <h3 className="font-medium text-center mb-2">Butuh Bantuan?</h3>
            <p className="text-xs text-gray-500 text-center mb-3">
              Jika Anda memiliki pertanyaan atau masalah, tim dukungan kami siap membantu Anda.
            </p>
            <Link href="#" className="block text-center hover:underline">
              Hubungi Dukungan
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
