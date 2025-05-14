import Link from "next/link"
import Image from "next/image"
import { Search } from "lucide-react"

export function NavbarGuest() {
  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 md:px-8">
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
            <span className="text-xl font-bold">Tukangin</span>
          </Link>

          {/* Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#" className="text-black hover:text-blue-600 transition-colors">
              Layanan
            </Link>
            <Link href="#" className="text-black hover:text-blue-600 transition-colors">
              Cara Kerja
            </Link>
            <Link href="#" className="text-black hover:text-blue-600 transition-colors">
              Tentang Kami
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex relative flex-1 max-w-md mx-4">
            <input
              type="text"
              placeholder="Apa yang anda cari"
              className="w-full py-2 px-4 pr-10 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Search className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-2">
            <Link href="/login" className="px-4 py-2 border border-gray-800 rounded-lg hover:bg-gray-50 transition-colors">
              Masuk
            </Link>
            <Link href="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
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
              className="w-full py-2 px-4 pr-10 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Search className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
