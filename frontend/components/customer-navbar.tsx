'use client';

import type React from 'react';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Bell, ShoppingBag, MessageSquare, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

interface CustomerNavbarProps {
  userName: string;
}

export function CustomerNavbar({ userName }: CustomerNavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="fixed top-0 w-full z-50 px-4 py-3">
      <header className="bg-white/80 backdrop-blur-md shadow-lg rounded-2xl py-3 px-4 sm:py-4 sm:px-6 mx-auto max-w-7xl">
        <div className="container mx-auto">
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/home" className="flex items-center gap-2 flex-shrink-0 mr-5 md:mr-8">
              <Image
                src="/logo-tukangin.png?height=48&width=48"
                alt="Tukangin Logo"
                width={36}
                height={36}
                className="rounded-full"
              />
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">
                Tukangin
              </span>
            </Link>

            {/* Navigation - Hidden on mobile */}
            <nav className="hidden md:flex items-center flex-1 justify-center space-x-2 lg:space-x-6">
              <Link
                href="/home"
                className={`text-gray-700 hover:text-blue-600 transition-all py-2 px-3 font-medium relative group text-sm whitespace-nowrap ${
                  pathname.startsWith('/home') ? 'text-blue-600' : ''
                }`}
              >
                <span className="relative z-10">Home</span>
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transition-transform duration-300 ${
                    pathname.startsWith('/home')
                      ? 'scale-x-100'
                      : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                ></span>
              </Link>
              <Link
                href="/marketplace"
                className={`text-gray-700 hover:text-blue-600 transition-all py-2 px-3 font-medium relative group text-sm whitespace-nowrap ${
                  pathname.startsWith('/marketplace') ? 'text-blue-600' : ''
                }`}
              >
                <span className="relative z-10">Marketplace</span>
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transition-transform duration-300 ${
                    pathname.startsWith('/marketplace')
                      ? 'scale-x-100'
                      : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                ></span>
              </Link>
              <Link
                href="/dashboard"
                className={`text-gray-700 hover:text-blue-600 transition-all py-2 px-3 font-medium relative group text-sm whitespace-nowrap ${
                  pathname.startsWith('/dashboard') ? 'text-blue-600' : ''
                }`}
              >
                <span className="relative z-10">Dashboard</span>
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transition-transform duration-300 ${
                    pathname.startsWith('/dashboard')
                      ? 'scale-x-100'
                      : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                ></span>
              </Link>
            </nav>

            {/* Search Bar - Right aligned */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex relative w-48 lg:w-56 xl:w-64 ml-auto"
            >
              <input
                type="text"
                placeholder="Apa yang anda cari"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full py-2 px-4 pr-9 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 p-1 rounded-full hover:bg-blue-700 transition-colors"
              >
                <Search className="h-3.5 w-3.5 text-white" />
              </button>
            </form>

            {/* User Profile & Notifications */}
            <div className="flex items-center gap-3 lg:gap-4 ml-4">
              <div className="hidden md:flex items-center gap-1.5 lg:gap-3">
                <button className="relative p-1.5 text-gray-700 hover:text-blue-600 transition-colors">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center shadow-sm">
                    3
                  </span>
                </button>
                <button className="relative p-1.5 text-gray-700 hover:text-blue-600 transition-colors">
                  <ShoppingBag className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center shadow-sm">
                    2
                  </span>
                </button>
                <button className="relative p-1.5 text-gray-700 hover:text-blue-600 transition-colors">
                  <MessageSquare className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center shadow-sm">
                    5
                  </span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    alt="User Profile"
                    width={32}
                    height={32}
                    className="rounded-full border-2 border-blue-500 p-0.5 bg-white"
                  />
                </div>
                <span className="font-medium hidden md:block text-sm">{userName}</span>
              </div>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-gray-700 hover:bg-gray-100 rounded-full"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Mobile Search - Only visible on small screens */}
          <div className={`md:hidden mt-4 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Apa yang anda cari"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full py-2.5 px-5 pr-12 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 p-1.5 rounded-full hover:bg-blue-700 transition-colors"
              >
                <Search className="h-4 w-4 text-white" />
              </button>
            </form>

            {/* Mobile Navigation */}
            <nav className="mt-4 flex flex-col gap-3 bg-gray-50 rounded-xl p-4">
              <Link
                href="/home"
                className={`text-gray-700 hover:text-blue-600 transition-all py-3 px-4 rounded-lg hover:bg-white flex items-center font-medium ${
                  pathname === '/home' ? 'text-blue-600 bg-white' : ''
                }`}
              >
                <span
                  className={`${pathname === '/home' ? 'w-1' : 'w-0 group-hover:w-1'} h-5 bg-blue-600 rounded ${pathname === '/home' ? 'mr-2' : 'mr-0 group-hover:mr-2'} transition-all duration-300`}
                ></span>
                Home
              </Link>
              <Link
                href="/marketplace"
                className={`text-gray-700 hover:text-blue-600 transition-all py-3 px-4 rounded-lg hover:bg-white flex items-center font-medium group ${
                  pathname === '/marketplace' ? 'text-blue-600 bg-white' : ''
                }`}
              >
                <span
                  className={`${pathname === '/marketplace' ? 'w-1' : 'w-0 group-hover:w-1'} h-5 bg-blue-600 rounded ${pathname === '/marketplace' ? 'mr-2' : 'mr-0 group-hover:mr-2'} transition-all duration-300`}
                ></span>
                Marketplace
              </Link>
              <Link
                href="/dashboard"
                className={`text-gray-700 hover:text-blue-600 transition-all py-3 px-4 rounded-lg hover:bg-white flex items-center font-medium group ${
                  pathname === '/dashboard' ? 'text-blue-600 bg-white' : ''
                }`}
              >
                <span
                  className={`${pathname === '/dashboard' ? 'w-1' : 'w-0 group-hover:w-1'} h-5 bg-blue-600 rounded ${pathname === '/dashboard' ? 'mr-2' : 'mr-0 group-hover:mr-2'} transition-all duration-300`}
                ></span>
                Dashboard
              </Link>

              {/* Mobile notification icons */}
              <div className="flex items-center justify-between py-2 mt-2 border-t border-gray-200 pt-3">
                <button className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  <span>Notifikasi</span>
                  <span className="ml-1 h-5 w-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center shadow-sm">
                    3
                  </span>
                </button>
                <button className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  <span>Pesanan</span>
                  <span className="ml-1 h-5 w-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center shadow-sm">
                    2
                  </span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>
    </div>
  );
}
