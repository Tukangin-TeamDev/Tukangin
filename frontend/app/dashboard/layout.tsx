"use client"

import type React from "react"

import { useState, Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  Home,
  ShoppingBag,
  Package,
  MessageSquare,
  User,
  Settings,
  HelpCircle,
  ChevronDown,
  Search,
  Bell,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false)

  const toggleSubmenu = () => {
    setIsSubmenuOpen(!isSubmenuOpen)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-[280px] bg-white shadow-lg flex flex-col h-screen sticky top-0 border-r border-gray-100">
        <div className="p-6 flex items-center border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/placeholder.svg?height=42&width=42"
              alt="Tukangin Logo"
              width={42}
              height={42}
              className="rounded-full"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">
              Tukangin
            </span>
          </Link>
        </div>

        <div className="px-4 py-5">
          <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl">
            <Image
              src="/placeholder.svg?height=48&width=48"
              alt="User Profile"
              width={48}
              height={48}
              className="rounded-full border-2 border-blue-500 p-0.5 bg-white"
            />
            <div>
              <p className="font-medium">Dono</p>
              <p className="text-sm text-gray-500">Customer</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <div className="mb-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Menu Utama
          </div>
          <ul className="space-y-1.5 mb-6">
            {/* Dashboard */}
            <li>
              <Link
                href="/dashboard"
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition-all",
                  pathname === "/dashboard" &&
                    "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 font-medium shadow-sm"
                )}
              >
                <Home className="h-5 w-5 flex-shrink-0" />
                <span>Dashboard</span>
              </Link>
            </li>

            {/* Cari Layanan */}
            <li>
              <Link href="/marketplace" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition-all">
                <ShoppingBag className="h-5 w-5 flex-shrink-0" />
                <span>Cari Layanan</span>
              </Link>
            </li>

            {/* Pesanan Saya */}
            <li>
              <button
                onClick={toggleSubmenu}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl w-full text-left hover:bg-gray-100 transition-all",
                  (pathname.includes("/dashboard/orders") || isSubmenuOpen) &&
                    "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 font-medium"
                )}
              >
                <Package className="h-5 w-5 flex-shrink-0" />
                <span>Pesanan Saya</span>
                <ChevronDown className={cn("h-4 w-4 ml-auto transition-transform", isSubmenuOpen && "rotate-180")} />
              </button>

              {isSubmenuOpen && (
                <ul className="ml-8 mt-1.5 space-y-1 border-l-2 border-blue-100 pl-3">
                  <li>
                    <Link
                      href="/dashboard/orders/active"
                      className={cn(
                        "flex items-center gap-2 p-2 text-sm rounded-lg hover:bg-gray-100 transition-all",
                        pathname === "/dashboard/orders/active" && "text-blue-700 font-medium bg-blue-50"
                      )}
                    >
                      Aktif
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/orders/completed"
                      className={cn(
                        "flex items-center gap-2 p-2 text-sm rounded-lg hover:bg-gray-100 transition-all",
                        pathname === "/dashboard/orders/completed" && "text-blue-700 font-medium bg-blue-50"
                      )}
                    >
                      Selesai
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/orders/cancelled"
                      className={cn(
                        "flex items-center gap-2 p-2 text-sm rounded-lg hover:bg-gray-100 transition-all",
                        pathname === "/dashboard/orders/cancelled" && "text-blue-700 font-medium bg-blue-50"
                      )}
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
                href="/dashboard/chat"
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition-all",
                  pathname === "/dashboard/chat" && 
                    "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 font-medium shadow-sm"
                )}
              >
                <MessageSquare className="h-5 w-5 flex-shrink-0" />
                <span>Pesan</span>
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </Link>
            </li>
          </ul>

          <div className="mb-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Akun
          </div>
          <ul className="space-y-1.5">
            {/* Profil */}
            <li>
              <Link
                href="/dashboard/profile"
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition-all",
                  pathname === "/dashboard/profile" && 
                    "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 font-medium shadow-sm"
                )}
              >
                <User className="h-5 w-5 flex-shrink-0" />
                <span>Profil</span>
              </Link>
            </li>

            {/* Pengaturan */}
            <li>
              <Link
                href="/dashboard/settings"
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition-all",
                  pathname === "/dashboard/settings" && 
                    "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 font-medium shadow-sm"
                )}
              >
                <Settings className="h-5 w-5 flex-shrink-0" />
                <span>Pengaturan</span>
              </Link>
            </li>

            {/* Bantuan */}
            <li>
              <Link
                href="/dashboard/help"
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition-all",
                  pathname === "/dashboard/help" && 
                    "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 font-medium shadow-sm"
                )}
              >
                <HelpCircle className="h-5 w-5 flex-shrink-0" />
                <span>Bantuan</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Help Card */}
        <div className="p-4 mt-auto">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center justify-center mb-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <HelpCircle className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <h3 className="font-medium text-center mb-2">Butuh Bantuan?</h3>
            <p className="text-xs text-gray-600 text-center mb-3">
              Tim dukungan kami siap membantu Anda 24/7
            </p>
            <Link 
              href="/dashboard/help" 
              className="block text-center text-sm bg-white py-2 px-4 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors"
            >
              Hubungi Dukungan
            </Link>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100">
          <Link 
            href="/logout" 
            className="flex items-center gap-2 p-3 text-gray-600 hover:text-red-600 rounded-xl hover:bg-red-50 transition-all"
          >
            <LogOut className="h-5 w-5" />
            <span>Keluar</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header (sudah diganti dengan Navbar di component) */}
        <div className="sticky top-0 z-50 bg-white shadow-sm">
          <div className="container mx-auto px-6 py-4">
            {/* Mobile search bar (sembunyikan di desktop) */}
            <div className="md:hidden mb-4">
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
            
            {/* Page title and breadcrumb */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">{pathname === "/dashboard" ? "Dashboard" : 
                  (() => {
                    const pageName = pathname.split('/').pop() || '';
                    return pageName.charAt(0).toUpperCase() + pageName.slice(1);
                  })()}</h1>
                <nav className="text-sm breadcrumbs">
                  <ul className="flex gap-2 text-gray-500">
                    <li><Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link></li>
                    {pathname !== "/dashboard" && (
                      <>
                        <li>/</li>
                        <li className="text-blue-600 font-medium">
                          {(() => {
                            const pageName = pathname.split('/').pop() || '';
                            return pageName.charAt(0).toUpperCase() + pageName.slice(1);
                          })()}
                        </li>
                      </>
                    )}
                  </ul>
                </nav>
              </div>
              
              <div className="hidden md:block relative max-w-md">
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
        </div>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <Suspense 
              fallback={
                <div className="w-full h-40 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              }
            >
              {children}
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  )
}
