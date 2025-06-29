'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function NavbarGuest() {
  const pathname = usePathname();
  return (
    <div className="fixed top-0 w-full z-50 px-4 py-3">
      <header className="bg-white/80 backdrop-blur-md shadow-lg rounded-2xl py-4 px-6 mx-auto max-w-7xl">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0 mr-5 md:mr-8">
              <Image
                src="/logo-tukangin.png?height=48&width=48"
                alt="Tukangin Logo"
                width={48}
                height={48}
                className="rounded-full"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">
                Tukangin
              </span>
            </Link>

            {/* Navigation - Hidden on mobile */}
            <nav className="hidden md:flex items-center flex-1 justify-center space-x-2 lg:space-x-6">
              <Link
                href="/"
                className={`text-gray-700 hover:text-blue-600 transition-all py-2 px-3 font-medium relative group text-sm whitespace-nowrap ${
                  pathname === '/' ? 'text-blue-600' : ''
                }`}
              >
                <span className="relative z-10">Beranda</span>
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transition-transform duration-300 ${
                    pathname === '/' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                ></span>
              </Link>
              <Link
                href="/how-it-works"
                className={`text-gray-700 hover:text-blue-600 transition-all py-2 px-3 font-medium relative group text-sm whitespace-nowrap ${
                  pathname.startsWith('/how-it-works') ? 'text-blue-600' : ''
                }`}
              >
                <span className="relative z-10">Cara Kerja</span>
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transition-transform duration-300 ${
                    pathname.startsWith('/how-it-works')
                      ? 'scale-x-100'
                      : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                ></span>
              </Link>
              <Link
                href="/about"
                className={`text-gray-700 hover:text-blue-600 transition-all py-2 px-3 font-medium relative group text-sm whitespace-nowrap ${
                  pathname.startsWith('/about') ? 'text-blue-600' : ''
                }`}
              >
                <span className="relative z-10">Tentang Kami</span>
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transition-transform duration-300 ${
                    pathname.startsWith('/about')
                      ? 'scale-x-100'
                      : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                ></span>
              </Link>
            </nav>

            {/* Search Bar */}
            <div className="hidden md:flex relative flex-1 max-w-md mx-6">
              <input
                type="text"
                placeholder="Apa yang anda cari"
                className="w-full py-2.5 px-5 pr-12 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 p-1.5 rounded-full hover:bg-blue-700 transition-colors">
                <Search className="h-4 w-4 text-white" />
              </button>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-5 py-2 border border-gray-200 text-gray-800 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all font-medium"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-md hover:shadow-lg font-medium"
              >
                Daftar
              </Link>
            </div>
          </div>

          {/* Mobile Search - Only visible on small screens */}
          <div className="md:hidden mt-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Apa yang anda cari"
                className="w-full py-2.5 px-5 pr-12 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 p-1.5 rounded-full hover:bg-blue-700 transition-colors">
                <Search className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
