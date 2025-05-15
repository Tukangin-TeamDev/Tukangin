'use client';

import type React from 'react';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Bell, ShoppingBag, MessageSquare } from 'lucide-react';

export function DashboardNavbar() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="sticky top-0 z-50 px-4 py-3">
      <header className="bg-white/80 backdrop-blur-md shadow-lg rounded-2xl py-4 px-6 mx-auto max-w-7xl">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image
                src="/placeholder.svg?height=48&width=48"
                alt="Tukangin Logo"
                width={48}
                height={48}
                className="rounded-full"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">
                Tukangin
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-blue-600 transition-colors border-b-2 border-transparent hover:border-blue-600 font-medium"
              >
                Home
              </Link>
              <Link
                href="/marketplace"
                className="text-gray-700 hover:text-blue-600 transition-colors border-b-2 border-transparent hover:border-blue-600 font-medium"
              >
                Marketplace
              </Link>
              <Link
                href="/dashboard/orders"
                className="text-gray-700 hover:text-blue-600 transition-colors border-b-2 border-transparent hover:border-blue-600 font-medium"
              >
                Dashboard
              </Link>
            </nav>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex relative flex-1 max-w-md mx-6">
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
            <div className="flex items-center gap-4">
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
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    alt="User Profile"
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-blue-500 p-0.5 bg-white"
                  />
                </div>
                <span className="font-medium hidden md:block">Dono</span>
              </div>
            </div>
          </div>

          {/* Mobile Search - Only visible on small screens */}
          <div className="md:hidden mt-4">
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
          </div>
        </div>
      </header>
    </div>
  );
}
