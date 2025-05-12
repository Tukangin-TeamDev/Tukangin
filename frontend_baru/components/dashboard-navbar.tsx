"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Bell, ShoppingBag, MessageSquare } from "lucide-react"

export function DashboardNavbar() {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle search functionality
    console.log("Searching for:", searchQuery)
  }

  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 md:px-8">
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
            <span className="text-xl font-bold">Tukangin</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-black hover:text-blue-600 transition-colors border-b-2 border-transparent hover:border-blue-600"
            >
              Home
            </Link>
            <Link
              href="/marketplace"
              className="text-black hover:text-blue-600 transition-colors border-b-2 border-transparent hover:border-blue-600"
            >
              Marketplace
            </Link>
            <Link
              href="/dashboard/orders"
              className="text-black hover:text-blue-600 transition-colors border-b-2 border-transparent hover:border-blue-600"
            >
              Dashboard
            </Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex relative flex-1 max-w-md mx-4">
            <input
              type="text"
              placeholder="Apa yang anda cari"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 px-4 pr-10 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Search className="h-5 w-5 text-gray-500" />
            </button>
          </form>

          {/* User Profile & Notifications */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                3
              </span>
            </button>
            <button className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
              <ShoppingBag className="h-6 w-6" />
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                2
              </span>
            </button>
            <button className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
              <MessageSquare className="h-6 w-6" />
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                5
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
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 px-4 pr-10 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Search className="h-5 w-5 text-gray-500" />
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}
