"use client"

import type React from "react"

import { useState, Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Briefcase,
  Package,
  MessageSquare,
  User,
  Settings,
  HelpCircle,
  ChevronDown,
  Search,
  Bell,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false)

  const toggleSubmenu = () => {
    setIsSubmenuOpen(!isSubmenuOpen)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-[275px] bg-white shadow-md flex flex-col h-screen sticky top-0">
        <div className="p-4 flex items-center">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold">Tukangin</span>
            <span className="text-2xl font-bold text-orange-500">in</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {/* Dashboard Provider */}
            <li>
              <Link
                href="/admin"
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100",
                  pathname === "/admin" && "bg-gray-100",
                )}
              >
                <LayoutDashboard className="h-5 w-5 flex-shrink-0" />
                <span>Dashboard Provider</span>
              </Link>
            </li>

            {/* Layanan Saya */}
            <li>
              <Link
                href="/admin/services"
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100",
                  pathname === "/admin/services" && "bg-gray-100",
                )}
              >
                <Briefcase className="h-5 w-5 flex-shrink-0" />
                <span>Layanan Saya</span>
              </Link>
            </li>

            {/* Pesanan Masuk */}
            <li>
              <button
                onClick={toggleSubmenu}
                className="flex items-center gap-3 p-3 rounded-lg w-full text-left hover:bg-gray-100"
              >
                <Package className="h-5 w-5 flex-shrink-0" />
                <span>Pesanan Masuk</span>
                <ChevronDown className={cn("h-4 w-4 ml-auto transition-transform", isSubmenuOpen && "rotate-180")} />
              </button>

              {isSubmenuOpen && (
                <ul className="ml-8 mt-1 border-l pl-2 space-y-1">
                  <li>
                    <Link
                      href="/admin/orders/pending"
                      className="flex items-center gap-2 p-2 text-sm hover:text-blue-600"
                    >
                      Menunggu Konfirmasi
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/orders/in-progress"
                      className="flex items-center gap-2 p-2 text-sm hover:text-blue-600"
                    >
                      Sedang Dikerjakan
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/orders/completed"
                      className="flex items-center gap-2 p-2 text-sm hover:text-blue-600"
                    >
                      Selesai
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Pesan */}
            <li>
              <Link
                href="/admin/chat"
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100",
                  pathname === "/admin/chat" && "bg-gray-100",
                )}
              >
                <MessageSquare className="h-5 w-5 flex-shrink-0" />
                <span>Pesan</span>
              </Link>
            </li>

            {/* Profil Toko */}
            <li>
              <Link
                href="/admin/profile"
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100",
                  pathname === "/admin/profile" && "bg-gray-100",
                )}
              >
                <User className="h-5 w-5 flex-shrink-0" />
                <span>Profil Toko</span>
              </Link>
            </li>

            {/* Pengaturan */}
            <li>
              <Link
                href="/admin/settings"
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100",
                  pathname === "/admin/settings" && "bg-gray-100",
                )}
              >
                <Settings className="h-5 w-5 flex-shrink-0" />
                <span>Pengaturan</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Help Card */}
        <div className="p-4 mt-auto">
          <div className="bg-gray-100/50 rounded-lg p-4">
            <div className="flex items-center justify-center mb-2">
              <HelpCircle className="h-5 w-5 text-orange-500" />
            </div>
            <h3 className="font-medium text-center mb-2">Butuh Bantuan?</h3>
            <p className="text-xs text-gray-500 text-center mb-3">
              Jika Anda memiliki pertanyaan atau masalah, tim dukungan kami siap membantu Anda.
            </p>
            <Link href="/admin/help" className="block text-center hover:underline">
              Hubungi Dukungan
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold">Dashboard Provider</h1>
          </div>

          {/* Search Bar */}
          <div className="hidden md:block relative w-[500px]">
            <input
              type="text"
              placeholder="Apa yang anda cari"
              className="w-full py-2 px-4 pr-10 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Search className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                3
              </span>
            </button>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Image
                  src="/placeholder.svg?height=40&width=40"
                  alt="User Profile"
                  width={40}
                  height={40}
                  className="rounded-full border border-gray-300"
                />
              </div>
              <span className="font-medium">Bengkel Jaya</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 bg-blue-50">
          <Suspense>{children}</Suspense>
        </main>
      </div>
    </div>
  )
}
