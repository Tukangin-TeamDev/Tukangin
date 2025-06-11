'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Bell,
  Search,
  Settings,
  HelpCircle,
  User,
  LogOut,
  Moon,
  Sun,
  ChevronDown,
} from 'lucide-react';
import { useTheme } from 'next-themes';

export default function AdminNavbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Contoh data notifikasi
  const notifications = [
    {
      id: 1,
      title: 'Provider Baru',
      message: 'Ada 5 provider baru yang menunggu verifikasi',
      time: '10 menit yang lalu',
      read: false,
      type: 'verification',
    },
    {
      id: 2,
      title: 'Dispute Baru',
      message: 'Ada dispute baru antara provider dan customer yang perlu ditindaklanjuti',
      time: '30 menit yang lalu',
      read: false,
      type: 'dispute',
    },
    {
      id: 3,
      title: 'Integrasi Pembayaran',
      message: 'Pengaturan integrasi pembayaran telah diperbarui',
      time: 'Kemarin',
      read: true,
      type: 'system',
    },
  ];

  return (
    <header className="z-10 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="lg:w-64">
          <h1 className="text-lg font-bold text-gray-800 md:text-xl">Dashboard Admin</h1>
        </div>

        {/* Search Bar */}
        <div className="ml-4 hidden max-w-md flex-1 md:block">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="search"
              placeholder="Cari di seluruh platform..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Notification dropdown */}
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
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <div
                        key={notification.id}
                        className={`mb-1 rounded-md p-2 transition-colors ${
                          notification.read ? 'bg-white' : 'bg-blue-50'
                        } hover:bg-gray-50`}
                      >
                        <div className="flex items-start">
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${notification.read ? '' : 'text-blue-600'}`}>
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-500">{notification.message}</p>
                            <p className="mt-1 text-xs text-gray-400">{notification.time}</p>
                          </div>
                          {!notification.read && <span className="h-2 w-2 rounded-full bg-blue-600" />}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="py-4 text-center text-sm text-gray-500">Tidak ada notifikasi</p>
                  )}
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <button className="w-full rounded-md p-1 text-center text-xs text-blue-600 hover:bg-blue-50">
                    Lihat semua notifikasi
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Help button */}
          <button className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
            <HelpCircle className="h-5 w-5" />
          </button>

          {/* Settings button */}
          <button className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
            <Settings className="h-5 w-5" />
          </button>

          {/* User dropdown */}
          <div className="relative ml-2">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                if (showNotifications) setShowNotifications(false);
              }}
              className="flex items-center rounded-full text-sm focus:outline-none"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <User className="h-4 w-4" />
              </div>
              <span className="ml-1 hidden text-gray-700 lg:block">
                {user?.profile?.fullName || 'Admin'}
              </span>
              <ChevronDown className="ml-1 hidden h-4 w-4 text-gray-500 lg:block" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                <div className="border-b border-gray-200 px-4 py-2">
                  <p className="text-sm font-medium">{user?.profile?.fullName || 'Admin'}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                <a
                  href="/admin/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <User className="mr-2 h-4 w-4" />
                  Profil
                </a>
                <a
                  href="/admin/settings"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Pengaturan
                </a>
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