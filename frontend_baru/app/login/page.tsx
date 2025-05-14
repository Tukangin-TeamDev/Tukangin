"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff, Mail, Lock, ArrowRight, CheckCircle } from "lucide-react"
import { validateEmail } from "@/lib/validation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (emailError) setEmailError("")
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    if (passwordError) setPasswordError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset errors
    setEmailError("")
    setPasswordError("")

    // Validate inputs
    let isValid = true

    if (!email) {
      setEmailError("Email tidak boleh kosong")
      isValid = false
    } else if (!validateEmail(email)) {
      setEmailError("Format email tidak valid")
      isValid = false
    }

    if (!password) {
      setPasswordError("Password tidak boleh kosong")
      isValid = false
    }

    if (!isValid) return

    // Simulate login process
    setIsLoading(true)

    try {
      // Here you would normally call your authentication API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to dashboard or home page after successful login
      window.location.href = "/dashboard"
    } catch (error) {
      console.error("Login failed:", error)
      setPasswordError("Email atau password salah")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col md:flex-row w-full h-screen overflow-hidden bg-gray-50">
      {/* Left side - Branding and Info */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[rgba(30,131,155,0.25)] to-[rgba(22,163,74,0.25)] relative overflow-hidden">
        <div className="relative h-full w-full flex flex-col items-center justify-center px-12">
          <div className="relative mb-12">
            <div className="absolute -inset-8 bg-gradient-to-r from-blue-500/30 to-primary/30 rounded-full opacity-30 blur-3xl"></div>
            <div className="relative w-80 h-80 rounded-full flex items-center justify-center bg-white/30 backdrop-blur-md border border-white/10 shadow-2xl">
              <Image
                src="/placeholder.svg?height=306&width=306"
                alt="Tukangin Logo"
                width={306}
                height={306}
                className="object-contain drop-shadow-2xl"
              />
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-6 text-center">Tukangin</h1>

          <div className="max-w-md text-center mb-12">
            <h2 className="text-xl font-bold mb-6">
              Platform Terpercaya untuk Menghubungkan Pelanggan dengan jasa Tukang Profesional
            </h2>

            <div className="grid grid-cols-1 gap-4 text-left">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <span>Layanan tukang profesional</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <span>Harga transparan</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <span>Garansi pekerjaan</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <span>Pembayaran aman</span>
              </div>
            </div>
          </div>

          <Link
            href="#"
            className="flex items-center gap-2 text-black/90 hover:text-black transition-colors cursor-pointer group bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-white/20"
          >
            <span className="font-semibold">Pelajari lebih lanjut</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex flex-col justify-center w-full md:w-1/2 p-6 md:p-10 lg:p-16 relative overflow-y-auto">
        {/* Background gradients - subtle and not overwhelming */}
        <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full opacity-30 bg-gradient-to-tl from-blue-100 via-blue-50 to-blue-200 blur-2xl"></div>
        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full opacity-30 bg-gradient-to-br from-blue-50 via-blue-100 to-green-100 blur-2xl"></div>

        <div className="w-full max-w-md mx-auto z-10">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="space-y-8">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">Masuk ke Akun Anda</h1>
                <p className="text-gray-500">Masukkan detail login untuk mengakses akun Tukangin Anda</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    E-mail
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="Masukkan email Anda"
                      className={`w-full h-11 pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${emailError ? "border-red-500" : "border-gray-300"}`}
                    />
                  </div>
                  {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                    <Link href="/forgot-password" className="text-xs text-blue-600 hover:underline">
                      Lupa Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={handlePasswordChange}
                      placeholder="Masukkan kata sandi"
                      className={`w-full h-11 pl-10 pr-10 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${passwordError ? "border-red-500" : "border-gray-300"}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center justify-center w-full h-12 px-4 py-2 rounded-lg text-base font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Memproses..." : "Masuk"}
                </button>

                <div className="text-sm">
                  <span className="text-gray-500">Belum punya akun Tukangin?</span>{" "}
                  <Link href="/register" className="font-medium text-blue-600 hover:underline">
                    Daftar Sekarang
                  </Link>
                </div>
              </form>

              <div className="flex items-center">
                <div className="flex-grow h-px bg-gray-200"></div>
                <span className="px-4 text-sm text-gray-500">atau masuk dengan</span>
                <div className="flex-grow h-px bg-gray-200"></div>
              </div>

              <button
                type="button"
                className="flex items-center justify-center w-full h-12 px-4 py-2 rounded-xl text-sm font-medium border border-gray-300 bg-white hover:bg-gray-50 shadow-sm hover:shadow-md transition-all duration-300 gap-3"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M18.1711 8.36788H17.5V8.33329H10V11.6666H14.6904C14.0309 13.6501 12.1866 15.0001 10 15.0001C7.23859 15.0001 5.00001 12.7615 5.00001 10.0001C5.00001 7.23868 7.23859 5.00009 10 5.00009C11.2958 5.00009 12.4799 5.48118 13.3867 6.27286L15.7921 3.86743C14.2929 2.45686 12.2645 1.66676 10 1.66676C5.39763 1.66676 1.66667 5.39771 1.66667 10.0001C1.66667 14.6025 5.39763 18.3334 10 18.3334C14.6024 18.3334 18.3333 14.6025 18.3333 10.0001C18.3333 9.44117 18.2746 8.89575 18.1711 8.36788Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M2.62744 6.12116L5.36745 8.12953C6.10756 6.29511 7.90092 5.00009 10 5.00009C11.2958 5.00009 12.4799 5.48118 13.3867 6.27286L15.7921 3.86743C14.2929 2.45686 12.2645 1.66676 10 1.66676C6.79558 1.66676 4.02087 3.47042 2.62744 6.12116Z"
                    fill="#EA4335"
                  />
                  <path
                    d="M10 18.3334C12.2142 18.3334 14.2106 17.5832 15.7065 16.2208L13.0913 13.9792C12.2341 14.6335 11.1675 15.0001 10 15.0001C7.82262 15.0001 5.98371 13.6584 5.31731 11.6834L2.57733 13.8434C3.95659 16.5351 6.7615 18.3334 10 18.3334Z"
                    fill="#34A853"
                  />
                  <path
                    d="M18.1711 8.36788H17.5V8.33329H10V11.6666H14.6904C14.3751 12.6084 13.7692 13.4209 12.9902 13.9792L12.9917 13.9784L15.7069 16.22C15.5069 16.4034 18.3333 14.1667 18.3333 10.0001C18.3333 9.44117 18.2746 8.89575 18.1711 8.36788Z"
                    fill="#FBBC05"
                  />
                </svg>
                <span>Lanjutkan dengan Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
