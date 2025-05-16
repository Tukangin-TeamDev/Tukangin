'use client';

import type React from 'react';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Bell, ShoppingBag, MessageSquare, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CustomerNavbarProps {
  userName: string;
}

export function CustomerNavbar({ userName }: CustomerNavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="sticky top-0 z-50 px-5 py-4">
      <header className="bg-white/80 backdrop-blur-md shadow-lg rounded-2xl py-5 px-8 mx-auto max-w-7xl">
        <div className="container mx-auto">
          <div className="flex items-center justify-between space-x-4">
            {/* Logo */}
            <Link href="/home" className="flex items-center gap-3">
              <Image
                src="/placeholder.svg?height=48&width=48"
                alt="Tukangin Logo"
                width={48}
                height={48}
                className="rounded-full"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text pl-1">
                Tukangin
              </span>
            </Link>

            {/* Navigation - Hidden on mobile */}
            <nav className="hidden md:flex items-center md:gap-8 lg:gap-12">
              <Link
                href="/home"
                className="text-gray-700 hover:text-blue-600 transition-all py-2 px-3 font-medium relative group"
              >
                <span className="relative z-10">Home</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 scale-x-100 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
              <Link
                href="/marketplace"
                className="text-gray-700 hover:text-blue-600 transition-all py-2 px-3 font-medium relative group"
              >
                <span className="relative z-10">Marketplace</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-blue-600 transition-all py-2 px-3 font-medium relative group"
              >
                <span className="relative z-10">Dashboard</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
            </nav>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex relative flex-1 max-w-md mx-8">
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

            {/* User Profile & Notifications */}
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-6">
                <button className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
                  <Bell className="h-6 w-6" />
                  <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center shadow-sm">
                    3
                  </span>
                </button>
                <button className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
                  <ShoppingBag className="h-6 w-6" />
                  <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center shadow-sm">
                    2
                  </span>
                </button>
                <button className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
                  <MessageSquare className="h-6 w-6" />
                  <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center shadow-sm">
                    5
                  </span>
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    alt="User Profile"
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-blue-500 p-0.5 bg-white"
                  />
                </div>
                <span className="font-medium hidden md:block">{userName}</span>
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
                className="text-gray-700 hover:text-blue-600 transition-all py-3 px-4 rounded-lg hover:bg-white flex items-center font-medium"
              >
                <span className="w-1 h-5 bg-blue-600 rounded mr-2"></span>
                Home
              </Link>
              <Link
                href="/marketplace"
                className="text-gray-700 hover:text-blue-600 transition-all py-3 px-4 rounded-lg hover:bg-white flex items-center font-medium group"
              >
                <span className="w-0 group-hover:w-1 h-5 bg-blue-600 rounded mr-0 group-hover:mr-2 transition-all duration-300"></span>
                Marketplace
              </Link>
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-blue-600 transition-all py-3 px-4 rounded-lg hover:bg-white flex items-center font-medium group"
              >
                <span className="w-0 group-hover:w-1 h-5 bg-blue-600 rounded mr-0 group-hover:mr-2 transition-all duration-300"></span>
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
