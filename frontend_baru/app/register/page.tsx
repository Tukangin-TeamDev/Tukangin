"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff, Mail, Lock, ArrowRight, CheckCircle, User, Phone, MapPin, Briefcase } from "lucide-react"
import { validateEmail, validatePassword, validateName, validatePhone, validateAddress } from "@/lib/validation"

type UserRole = "pelanggan" | "penyedia"

export default function RegisterPage() {
  const [activeRole, setActiveRole] = useState<UserRole>("pelanggan")

  // Common form fields
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  // Customer specific fields
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")

  // Provider specific fields
  const [providerName, setProviderName] = useState("")
  const [providerPhone, setProviderPhone] = useState("")
  const [providerAddress, setProviderAddress] = useState("")
  const [serviceType, setServiceType] = useState("")
  const [experience, setExperience] = useState("")

  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validate common fields
    if (!email) {
      newErrors.email = "Email tidak boleh kosong"
    } else if (!validateEmail(email)) {
      newErrors.email = "Format email tidak valid"
    }

    if (!password) {
      newErrors.password = "Password tidak boleh kosong"
    } else if (!validatePassword(password)) {
      newErrors.password = "Password harus minimal 8 karakter dengan kombinasi huruf dan angka"
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi password tidak boleh kosong"
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Password dan konfirmasi password tidak cocok"
    }

    if (!agreeToTerms) {
      newErrors.agreeToTerms = "Anda harus menyetujui syarat dan ketentuan"
    }

    // Validate role-specific fields
    if (activeRole === "pelanggan") {
      if (!customerName) {
        newErrors.customerName = "Nama tidak boleh kosong"
      } else if (!validateName(customerName)) {
        newErrors.customerName = "Nama harus minimal 2 karakter"
      }

      if (!customerPhone) {
        newErrors.customerPhone = "Nomor telepon tidak boleh kosong"
      } else if (!validatePhone(customerPhone)) {
        newErrors.customerPhone = "Format nomor telepon tidak valid"
      }
    } else {
      if (!providerName) {
        newErrors.providerName = "Nama tidak boleh kosong"
      } else if (!validateName(providerName)) {
        newErrors.providerName = "Nama harus minimal 2 karakter"
      }

      if (!providerPhone) {
        newErrors.providerPhone = "Nomor telepon tidak boleh kosong"
      } else if (!validatePhone(providerPhone)) {
        newErrors.providerPhone = "Format nomor telepon tidak valid"
      }

      if (!providerAddress) {
        newErrors.providerAddress = "Alamat tidak boleh kosong"
      } else if (!validateAddress(providerAddress)) {
        newErrors.providerAddress = "Alamat harus minimal 5 karakter"
      }

      if (!serviceType) {
        newErrors.serviceType = "Jenis layanan tidak boleh kosong"
      }

      if (!experience) {
        newErrors.experience = "Pengalaman tidak boleh kosong"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Here you would normally call your registration API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to success page or login page after successful registration
      window.location.href = "/register/success"
    } catch (error) {
      console.error("Registration failed:", error)
      setErrors({
        form: "Terjadi kesalahan saat mendaftar. Silakan coba lagi.",
      })
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

      {/* Right side - Registration Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-10 lg:p-12 relative overflow-y-auto">
        {/* Background gradients - subtle and not overwhelming */}
        <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full opacity-30 bg-gradient-to-tl from-blue-100 via-blue-50 to-blue-200 blur-2xl"></div>
        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full opacity-30 bg-gradient-to-br from-blue-50 via-blue-100 to-green-100 blur-2xl"></div>

        <div className="w-full max-w-xl z-10 mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
            <div className="space-y-8">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">Daftar Sekarang</h1>
                <p className="text-gray-500">Buat akun untuk mulai menggunakan layanan Tukangin</p>
              </div>

              {/* Role selection tabs */}
              <div className="relative h-14 bg-gray-100 rounded-full p-2">
                <div
                  className={`absolute inset-y-2 rounded-full bg-blue-600 shadow-lg transition-all duration-300 ${
                    activeRole === "pelanggan" ? "left-2 right-1/2 translate-x-1" : "left-1/2 right-2 -translate-x-1"
                  }`}
                ></div>
                <div className="relative flex h-full">
                  <button
                    type="button"
                    onClick={() => setActiveRole("pelanggan")}
                    className={`flex-1 flex items-center justify-center rounded-full font-medium transition-colors ${
                      activeRole === "pelanggan" ? "text-white" : "text-gray-500"
                    }`}
                  >
                    Pelanggan
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveRole("penyedia")}
                    className={`flex-1 flex items-center justify-center rounded-full font-medium transition-colors ${
                      activeRole === "penyedia" ? "text-white" : "text-gray-500"
                    }`}
                  >
                    Penyedia Jasa
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Common fields */}
                <div className="space-y-4">
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
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Masukkan email Anda"
                        className={`w-full h-11 pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  {/* Role-specific fields */}
                  {activeRole === "pelanggan" ? (
                    <>
                      <div className="space-y-2">
                        <label htmlFor="customerName" className="text-sm font-medium">
                          Nama Lengkap
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            <User className="h-4 w-4" />
                          </div>
                          <input
                            id="customerName"
                            type="text"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Masukkan Nama Lengkap"
                            className={`flex h-12 w-full rounded-xl border bg-white/50 pl-10 pr-4 py-2 text-sm shadow-sm transition-all duration-300 hover:shadow-md focus:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.customerName ? "border-red-500" : "border-gray-300 hover:border-blue-500/50"
                            }`}
                          />
                        </div>
                        {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>}
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="customerPhone" className="text-sm font-medium">
                          Nomor Telepon
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            <Phone className="h-4 w-4" />
                          </div>
                          <input
                            id="customerPhone"
                            type="tel"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            placeholder="Masukkan Nomor Telepon"
                            className={`flex h-12 w-full rounded-xl border bg-white/50 pl-10 pr-4 py-2 text-sm shadow-sm transition-all duration-300 hover:shadow-md focus:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.customerPhone ? "border-red-500" : "border-gray-300 hover:border-blue-500/50"
                            }`}
                          />
                        </div>
                        {errors.customerPhone && <p className="text-red-500 text-xs mt-1">{errors.customerPhone}</p>}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <label htmlFor="providerName" className="text-sm font-medium">
                          Nama Lengkap
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            <User className="h-4 w-4" />
                          </div>
                          <input
                            id="providerName"
                            type="text"
                            value={providerName}
                            onChange={(e) => setProviderName(e.target.value)}
                            placeholder="Masukkan Nama Lengkap"
                            className={`flex h-12 w-full rounded-xl border bg-white/50 pl-10 pr-4 py-2 text-sm shadow-sm transition-all duration-300 hover:shadow-md focus:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.providerName ? "border-red-500" : "border-gray-300 hover:border-blue-500/50"
                            }`}
                          />
                        </div>
                        {errors.providerName && <p className="text-red-500 text-xs mt-1">{errors.providerName}</p>}
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="providerPhone" className="text-sm font-medium">
                          Nomor Telepon
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            <Phone className="h-4 w-4" />
                          </div>
                          <input
                            id="providerPhone"
                            type="tel"
                            value={providerPhone}
                            onChange={(e) => setProviderPhone(e.target.value)}
                            placeholder="Masukkan Nomor Telepon"
                            className={`flex h-12 w-full rounded-xl border bg-white/50 pl-10 pr-4 py-2 text-sm shadow-sm transition-all duration-300 hover:shadow-md focus:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.providerPhone ? "border-red-500" : "border-gray-300 hover:border-blue-500/50"
                            }`}
                          />
                        </div>
                        {errors.providerPhone && <p className="text-red-500 text-xs mt-1">{errors.providerPhone}</p>}
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="providerAddress" className="text-sm font-medium">
                          Alamat
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            <MapPin className="h-4 w-4" />
                          </div>
                          <input
                            id="providerAddress"
                            type="text"
                            value={providerAddress}
                            onChange={(e) => setProviderAddress(e.target.value)}
                            placeholder="Masukkan Alamat"
                            className={`flex h-12 w-full rounded-xl border bg-white/50 pl-10 pr-4 py-2 text-sm shadow-sm transition-all duration-300 hover:shadow-md focus:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.providerAddress ? "border-red-500" : "border-gray-300 hover:border-blue-500/50"
                            }`}
                          />
                        </div>
                        {errors.providerAddress && (
                          <p className="text-red-500 text-xs mt-1">{errors.providerAddress}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="serviceType" className="text-sm font-medium">
                          Jenis Layanan
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            <Briefcase className="h-4 w-4" />
                          </div>
                          <select
                            id="serviceType"
                            value={serviceType}
                            onChange={(e) => setServiceType(e.target.value)}
                            className={`flex h-12 w-full rounded-xl border bg-white/50 pl-10 pr-4 py-2 text-sm shadow-sm transition-all duration-300 hover:shadow-md focus:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.serviceType ? "border-red-500" : "border-gray-300 hover:border-blue-500/50"
                            }`}
                          >
                            <option value="">Pilih Jenis Layanan</option>
                            <option value="perbaikan_listrik">Perbaikan Listrik</option>
                            <option value="servis_ac">Servis AC</option>
                            <option value="renovasi_rumah">Renovasi Rumah</option>
                            <option value="tukang_ledeng">Tukang Ledeng</option>
                            <option value="lainnya">Lainnya</option>
                          </select>
                        </div>
                        {errors.serviceType && <p className="text-red-500 text-xs mt-1">{errors.serviceType}</p>}
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="experience" className="text-sm font-medium">
                          Pengalaman
                        </label>
                        <div className="relative">
                          <select
                            id="experience"
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            className={`flex h-12 w-full rounded-xl border bg-white/50 pl-4 pr-4 py-2 text-sm shadow-sm transition-all duration-300 hover:shadow-md focus:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.experience ? "border-red-500" : "border-gray-300 hover:border-blue-500/50"
                            }`}
                          >
                            <option value="">Pilih Pengalaman</option>
                            <option value="kurang_dari_1_tahun">Kurang dari 1 tahun</option>
                            <option value="1_3_tahun">1-3 tahun</option>
                            <option value="3_5_tahun">3-5 tahun</option>
                            <option value="lebih_dari_5_tahun">Lebih dari 5 tahun</option>
                          </select>
                        </div>
                        {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience}</p>}
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <Lock className="h-4 w-4" />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimal 8 karakter"
                        className={`w-full h-11 pl-10 pr-10 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.password ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    <p className="text-xs text-gray-500 mt-1">
                      Password harus memiliki minimal 8 karakter dengan kombinasi huruf dan angka
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium">
                      Konfirmasi Password
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <Lock className="h-4 w-4" />
                      </div>
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Konfirmasi Password"
                        className={`w-full h-11 pl-10 pr-10 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.confirmPassword ? "border-red-500" : "border-gray-300 hover:border-blue-500/50"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="agreeToTerms" className="text-sm text-gray-500">
                    Dengan mendaftar, saya menyetujui{" "}
                    <Link href="/terms" className="text-blue-600 hover:underline">
                      Syarat dan Ketentuan
                    </Link>{" "}
                    serta{" "}
                    <Link href="/privacy" className="text-blue-600 hover:underline">
                      Kebijakan Privasi
                    </Link>
                  </label>
                </div>
                {errors.agreeToTerms && <p className="text-red-500 text-xs mt-1">{errors.agreeToTerms}</p>}

                {errors.form && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {errors.form}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center justify-center w-full h-12 px-4 py-2 rounded-lg text-base font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Memproses..." : "Daftar"}
                </button>

                <div className="text-sm text-center">
                  <span className="text-gray-500">Sudah punya akun Tukangin?</span>{" "}
                  <Link href="/login" className="font-medium text-blue-600 hover:underline">
                    Masuk
                  </Link>
                </div>
              </form>

              <div className="flex items-center">
                <div className="flex-grow h-px bg-gray-200"></div>
                <span className="px-4 text-sm text-gray-500">atau daftar dengan</span>
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
