'use client';

import type React from 'react';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle,
  User,
  Phone,
  MapPin,
  Briefcase,
} from 'lucide-react';
import {
  validateEmail,
  validatePassword,
  validateName,
  validatePhone,
  validateAddress,
} from '@/lib/validation';

type UserRole = 'pelanggan' | 'penyedia';

export default function RegisterPage() {
  const [activeRole, setActiveRole] = useState<UserRole>('pelanggan');

  // Common form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Customer specific fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Provider specific fields
  const [providerName, setProviderName] = useState('');
  const [providerPhone, setProviderPhone] = useState('');
  const [providerAddress, setProviderAddress] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [experience, setExperience] = useState('');

  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate common fields
    if (!email) {
      newErrors.email = 'Email tidak boleh kosong';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!password) {
      newErrors.password = 'Password tidak boleh kosong';
    } else if (!validatePassword(password)) {
      newErrors.password = 'Password harus minimal 8 karakter dengan kombinasi huruf dan angka';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password tidak boleh kosong';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Password dan konfirmasi password tidak cocok';
    }

    if (!agreeToTerms) {
      newErrors.agreeToTerms = 'Anda harus menyetujui syarat dan ketentuan';
    }

    // Validate role-specific fields
    if (activeRole === 'pelanggan') {
      if (!customerName) {
        newErrors.customerName = 'Nama tidak boleh kosong';
      } else if (!validateName(customerName)) {
        newErrors.customerName = 'Nama harus minimal 2 karakter';
      }

      if (!customerPhone) {
        newErrors.customerPhone = 'Nomor telepon tidak boleh kosong';
      } else if (!validatePhone(customerPhone)) {
        newErrors.customerPhone = 'Format nomor telepon tidak valid';
      }
    } else {
      if (!providerName) {
        newErrors.providerName = 'Nama tidak boleh kosong';
      } else if (!validateName(providerName)) {
        newErrors.providerName = 'Nama harus minimal 2 karakter';
      }

      if (!providerPhone) {
        newErrors.providerPhone = 'Nomor telepon tidak boleh kosong';
      } else if (!validatePhone(providerPhone)) {
        newErrors.providerPhone = 'Format nomor telepon tidak valid';
      }

      if (!providerAddress) {
        newErrors.providerAddress = 'Alamat tidak boleh kosong';
      } else if (!validateAddress(providerAddress)) {
        newErrors.providerAddress = 'Alamat harus minimal 5 karakter';
      }

      if (!serviceType) {
        newErrors.serviceType = 'Jenis layanan tidak boleh kosong';
      }

      if (!experience) {
        newErrors.experience = 'Pengalaman tidak boleh kosong';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Here you would normally call your registration API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Redirect to success page or login page after successful registration
      window.location.href = '/register/success';
    } catch (error) {
      console.error('Registration failed:', error);
      setErrors({
        form: 'Terjadi kesalahan saat mendaftar. Silakan coba lagi.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid h-[100dvh] w-screen overflow-hidden bg-gradient-to-b from-white to-gray-50 lg:grid-cols-2">
      {/* Left side - Branding and Info */}
      <div className="relative hidden bg-gradient-to-br from-blue-500/10 via-blue-600/5 to-blue-700/10 lg:block">
        <div className="absolute inset-0">
          <div className="absolute top-[20%] -left-[10%] h-[40vh] w-[40vh] rounded-full bg-gradient-to-r from-blue-400/20 to-teal-300/20 blur-3xl"></div>
          <div className="absolute bottom-[20%] -right-[10%] h-[40vh] w-[40vh] rounded-full bg-gradient-to-r from-primary-400/20 to-blue-300/20 blur-3xl"></div>
        </div>

        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center p-4">
          <div className="relative mb-4 lg:mb-6">
            <div className="absolute -inset-8 rounded-full bg-gradient-to-r from-blue-500/30 to-primary/30 opacity-30 blur-3xl"></div>
            <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-white/10 bg-white/30 shadow-2xl backdrop-blur-md sm:h-40 sm:w-40 lg:h-48 lg:w-48">
              <Image
                src="/logo-tukangin.png"
                alt="Tukangin Logo"
                width={150}
                height={150}
                className="object-contain drop-shadow-2xl"
              />
            </div>
          </div>

          <h1 className="mb-3 bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-center text-2xl font-bold text-transparent sm:text-3xl lg:text-4xl">
            Tukangin
          </h1>

          <div className="mb-4 max-w-lg text-center lg:mb-6">
            <h2 className="mb-3 text-lg font-bold text-gray-800 sm:text-xl lg:text-2xl">
              Platform Terpercaya untuk Menghubungkan Pelanggan dengan Jasa Tukang Profesional
            </h2>

            <div className="grid max-h-[30vh] grid-cols-2 gap-2 overflow-y-auto text-left sm:gap-3">
              {[
                'Layanan tukang profesional',
                'Harga transparan',
                'Garansi pekerjaan',
                'Pembayaran aman',
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-xl bg-white/50 p-2 shadow-sm transition-all hover:shadow-md backdrop-blur-sm"
                >
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/10 sm:h-8 sm:w-8">
                    <CheckCircle className="h-3 w-3 text-blue-600 sm:h-4 sm:w-4" />
                  </div>
                  <span className="text-xs text-gray-700 sm:text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/home"
            className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:from-blue-700 hover:to-blue-600 hover:shadow-lg"
          >
            <span>Pelajari lebih lanjut</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Right side - Registration Form */}
      <div className="relative flex h-full w-full flex-col px-4 py-2 sm:px-6">
        {/* Mobile branding (visible on small screens) */}
        <div className="mb-2 flex flex-col items-center lg:hidden">
          <div className="relative mb-1 h-14 w-14 sm:h-16 sm:w-16">
            <Image
              src="/placeholder.svg?height=96&width=96"
              alt="Tukangin Logo"
              width={96}
              height={96}
              className="object-contain"
            />
          </div>
          <h1 className="bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-xl font-bold text-transparent sm:text-2xl">
            Tukangin
          </h1>
        </div>

        {/* Background elements */}
        <div className="absolute -bottom-[20vh] -right-[20vh] h-[40vh] w-[40vh] rounded-full bg-gradient-to-tl from-blue-100 via-blue-50 to-blue-200 opacity-20 blur-2xl"></div>
        <div className="absolute -top-[20vh] -left-[20vh] h-[40vh] w-[40vh] rounded-full bg-gradient-to-br from-blue-50 via-blue-100 to-green-100 opacity-20 blur-2xl"></div>

        <div className="z-10 mx-auto flex h-full w-full max-w-lg flex-col">
          <div className="flex flex-1 flex-col justify-center">
            <div className="rounded-2xl border border-gray-100/80 bg-white/80 p-3 shadow-xl backdrop-blur-md sm:p-4">
              <div className="space-y-2 sm:space-y-3">
                <div className="space-y-0.5 text-center sm:text-left">
                  <h1 className="text-lg font-bold text-gray-900 sm:text-xl">Daftar Sekarang</h1>
                  <p className="text-xs text-gray-500">
                    Buat akun untuk mulai menggunakan layanan Tukangin
                  </p>
                </div>

                {/* Role selection tabs */}
                <div className="relative h-9 rounded-full bg-gray-100 p-1.5 sm:h-10">
                  <div
                    className={`absolute inset-y-1.5 rounded-full bg-blue-600 shadow-lg transition-all duration-300 ${
                      activeRole === 'pelanggan'
                        ? 'left-1.5 right-1/2 translate-x-1'
                        : 'left-1/2 right-1.5 -translate-x-1'
                    }`}
                  ></div>
                  <div className="relative flex h-full">
                    <button
                      type="button"
                      onClick={() => setActiveRole('pelanggan')}
                      className={`flex-1 flex items-center justify-center rounded-full text-xs font-medium transition-colors ${
                        activeRole === 'pelanggan' ? 'text-white' : 'text-gray-500'
                      }`}
                    >
                      Pelanggan
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveRole('penyedia')}
                      className={`flex-1 flex items-center justify-center rounded-full text-xs font-medium transition-colors ${
                        activeRole === 'penyedia' ? 'text-white' : 'text-gray-500'
                      }`}
                    >
                      Penyedia Jasa
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
                  {/* Common fields */}
                  <div className="space-y-2 sm:space-y-3">
                    <div className="space-y-0.5">
                      <div className="relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-500">
                          <Mail className="h-4 w-4" />
                        </div>
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="Email"
                          className={`h-9 w-full rounded-xl border bg-white/70 py-2 pl-9 pr-3 text-xs transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 sm:h-10 sm:text-xs ${
                            errors.email
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50'
                              : 'border-gray-200'
                          }`}
                        />
                      </div>
                      {errors.email && <p className="ml-1 text-xs text-red-500">{errors.email}</p>}
                    </div>

                    {/* Role-specific fields */}
                    {activeRole === 'pelanggan' ? (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-0.5">
                          <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-500">
                              <User className="h-4 w-4" />
                            </div>
                            <input
                              id="customerName"
                              type="text"
                              value={customerName}
                              onChange={e => setCustomerName(e.target.value)}
                              placeholder="Nama"
                              className={`h-9 w-full rounded-xl border bg-white/70 py-2 pl-9 pr-3 text-xs transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 sm:h-10 ${
                                errors.customerName
                                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50'
                                  : 'border-gray-200'
                              }`}
                            />
                          </div>
                          {errors.customerName && (
                            <p className="ml-1 text-[10px] text-red-500">{errors.customerName}</p>
                          )}
                        </div>

                        <div className="space-y-0.5">
                          <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-500">
                              <Phone className="h-4 w-4" />
                            </div>
                            <input
                              id="customerPhone"
                              type="tel"
                              value={customerPhone}
                              onChange={e => setCustomerPhone(e.target.value)}
                              placeholder="Telepon"
                              className={`h-9 w-full rounded-xl border bg-white/70 py-2 pl-9 pr-3 text-xs transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 sm:h-10 ${
                                errors.customerPhone
                                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50'
                                  : 'border-gray-200'
                              }`}
                            />
                          </div>
                          {errors.customerPhone && (
                            <p className="ml-1 text-[10px] text-red-500">{errors.customerPhone}</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-0.5">
                          <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-500">
                              <User className="h-4 w-4" />
                            </div>
                            <input
                              id="providerName"
                              type="text"
                              value={providerName}
                              onChange={e => setProviderName(e.target.value)}
                              placeholder="Nama"
                              className={`h-9 w-full rounded-xl border bg-white/70 py-2 pl-9 pr-3 text-xs transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 sm:h-10 ${
                                errors.providerName
                                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50'
                                  : 'border-gray-200'
                              }`}
                            />
                          </div>
                          {errors.providerName && (
                            <p className="ml-1 text-[10px] text-red-500">{errors.providerName}</p>
                          )}
                        </div>

                        <div className="space-y-0.5">
                          <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-500">
                              <Phone className="h-4 w-4" />
                            </div>
                            <input
                              id="providerPhone"
                              type="tel"
                              value={providerPhone}
                              onChange={e => setProviderPhone(e.target.value)}
                              placeholder="Telepon"
                              className={`h-9 w-full rounded-xl border bg-white/70 py-2 pl-9 pr-3 text-xs transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 sm:h-10 ${
                                errors.providerPhone
                                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50'
                                  : 'border-gray-200'
                              }`}
                            />
                          </div>
                          {errors.providerPhone && (
                            <p className="ml-1 text-[10px] text-red-500">{errors.providerPhone}</p>
                          )}
                        </div>

                        <div className="col-span-2 space-y-0.5">
                          <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-500">
                              <MapPin className="h-4 w-4" />
                            </div>
                            <input
                              id="providerAddress"
                              type="text"
                              value={providerAddress}
                              onChange={e => setProviderAddress(e.target.value)}
                              placeholder="Alamat"
                              className={`h-9 w-full rounded-xl border bg-white/70 py-2 pl-9 pr-3 text-xs transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 sm:h-10 ${
                                errors.providerAddress
                                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50'
                                  : 'border-gray-200'
                              }`}
                            />
                          </div>
                          {errors.providerAddress && (
                            <p className="ml-1 text-[10px] text-red-500">
                              {errors.providerAddress}
                            </p>
                          )}
                        </div>

                        <div className="space-y-0.5">
                          <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-500">
                              <Briefcase className="h-4 w-4" />
                            </div>
                            <select
                              id="serviceType"
                              value={serviceType}
                              onChange={e => setServiceType(e.target.value)}
                              className={`h-9 w-full appearance-none rounded-xl border bg-white/70 py-2 pl-9 pr-3 text-xs transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 sm:h-10 ${
                                errors.serviceType
                                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50'
                                  : 'border-gray-200'
                              }`}
                            >
                              <option value="">Pilih Layanan</option>
                              <option value="perbaikan_listrik">Perbaikan Listrik</option>
                              <option value="servis_ac">Servis AC</option>
                              <option value="renovasi_rumah">Renovasi Rumah</option>
                              <option value="tukang_ledeng">Tukang Ledeng</option>
                              <option value="lainnya">Lainnya</option>
                            </select>
                          </div>
                          {errors.serviceType && (
                            <p className="ml-1 text-[10px] text-red-500">{errors.serviceType}</p>
                          )}
                        </div>

                        <div className="space-y-0.5">
                          <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-500">
                              <User className="h-4 w-4" />
                            </div>
                            <select
                              id="experience"
                              value={experience}
                              onChange={e => setExperience(e.target.value)}
                              className={`h-9 w-full appearance-none rounded-xl border bg-white/70 py-2 pl-9 pr-3 text-xs transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 sm:h-10 ${
                                errors.experience
                                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50'
                                  : 'border-gray-200'
                              }`}
                            >
                              <option value="">Pengalaman</option>
                              <option value="kurang_dari_1_tahun">{'<'} 1 tahun</option>
                              <option value="1_3_tahun">1-3 tahun</option>
                              <option value="3_5_tahun">3-5 tahun</option>
                              <option value="lebih_dari_5_tahun">{'>'} 5 tahun</option>
                            </select>
                          </div>
                          {errors.experience && (
                            <p className="ml-1 text-[10px] text-red-500">{errors.experience}</p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-0.5">
                        <div className="relative group">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-500">
                            <Lock className="h-4 w-4" />
                          </div>
                          <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Password"
                            className={`h-9 w-full rounded-xl border bg-white/70 py-2 pl-9 pr-9 text-xs transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 sm:h-10 ${
                              errors.password
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50'
                                : 'border-gray-200'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                          >
                            {showPassword ? (
                              <EyeOff className="h-3.5 w-3.5" />
                            ) : (
                              <Eye className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="ml-1 text-[10px] text-red-500">{errors.password}</p>
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <div className="relative group">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-500">
                            <Lock className="h-4 w-4" />
                          </div>
                          <input
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            placeholder="Konfirmasi Password"
                            className={`h-9 w-full rounded-xl border bg-white/70 py-2 pl-9 pr-9 text-xs transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 sm:h-10 ${
                              errors.confirmPassword
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50'
                                : 'border-gray-200'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-3.5 w-3.5" />
                            ) : (
                              <Eye className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <p className="ml-1 text-[10px] text-red-500">{errors.confirmPassword}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      checked={agreeToTerms}
                      onChange={e => setAgreeToTerms(e.target.checked)}
                      className="mt-0.5 h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="agreeToTerms" className="text-xs text-gray-500">
                      Dengan mendaftar, saya menyetujui{' '}
                      <Link
                        href="/terms"
                        className="text-blue-600 transition-colors hover:text-blue-800"
                      >
                        Syarat dan Ketentuan
                      </Link>
                    </label>
                  </div>
                  {errors.agreeToTerms && (
                    <p className="ml-1 text-xs text-red-500">{errors.agreeToTerms}</p>
                  )}

                  {errors.form && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                      {errors.form}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex h-9 w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-xs font-medium text-white shadow-md transition-all duration-200 hover:from-blue-700 hover:to-blue-600 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 sm:h-10"
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="-ml-1 mr-2 h-3.5 w-3.5 animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Memproses...
                      </>
                    ) : (
                      'Daftar'
                    )}
                  </button>

                  <div className="text-center">
                    <span className="text-xs text-gray-500">Sudah punya akun?</span>{' '}
                    <Link
                      href="/login"
                      className="text-xs font-medium text-blue-600 transition-colors hover:text-blue-800"
                    >
                      Masuk
                    </Link>
                  </div>
                </form>

                <div className="flex items-center">
                  <div className="h-px flex-grow bg-gray-200"></div>
                  <span className="px-3 text-xs text-gray-500">atau</span>
                  <div className="h-px flex-grow bg-gray-200"></div>
                </div>

                <button
                  type="button"
                  className="group flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 shadow-sm transition-all duration-300 hover:bg-gray-50 hover:shadow-md sm:h-10"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
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
                  <span>Google</span>
                </button>
              </div>
            </div>
          </div>

          <div className="py-2 text-center text-xs text-gray-500">
            <p>© {new Date().getFullYear()} Tukangin</p>
          </div>
        </div>
      </div>
    </div>
  );
}
