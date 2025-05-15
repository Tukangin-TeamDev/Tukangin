import Link from "next/link"
import Image from "next/image"
import { Search } from "lucide-react"

export function NavbarGuest() {
  return (
    <div className="sticky top-0 z-50 px-4 py-3">
      <header className="bg-white/80 backdrop-blur-md shadow-lg rounded-2xl py-4 px-6 mx-auto max-w-7xl">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/placeholder.svg?height=48&width=48"
                alt="Tukangin Logo"
                width={48}
                height={48}
                className="rounded-full"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">Tukangin</span>
            </Link>

            {/* Navigation - Hidden on mobile */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Layanan
              </Link>
              <Link href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Cara Kerja
              </Link>
              <Link href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Tentang Kami
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
              <Link href="/login" className="px-5 py-2 border border-gray-200 text-gray-800 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all font-medium">
                Masuk
              </Link>
              <Link href="/register" className="px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-md hover:shadow-lg font-medium">
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
  )
}
