'use client';

import type React from 'react';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, Mail, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { validateEmail } from '../../lib/validation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) setEmailError('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (passwordError) setPasswordError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setEmailError('');
    setPasswordError('');

    // Validate inputs
    let isValid = true;

    if (!email) {
      setEmailError('Email tidak boleh kosong');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Format email tidak valid');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password tidak boleh kosong');
      isValid = false;
    }

    if (!isValid) return;

    // Simulate login process
    setIsLoading(true);

    try {
      // Here you would normally call your authentication API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Redirect to dashboard or home page after successful login
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Login failed:', error);
      setPasswordError('Email atau password salah');
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
                src="/placeholder.svg?height=306&width=306"
                alt="Tukangin Logo"
                width={306}
                height={306}
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

      {/* Right side - Login Form */}
      <div className="relative flex h-full w-full flex-col justify-center p-4 sm:p-6">
        {/* Mobile branding (visible on small screens) */}
        <div className="mb-4 flex flex-col items-center lg:hidden">
          <div className="relative mb-2 h-16 w-16 sm:h-20 sm:w-20">
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

        <div className="z-10 mx-auto w-full max-w-md">
          <div className="rounded-2xl border border-gray-100/80 bg-white/80 p-4 shadow-xl backdrop-blur-md sm:p-5">
            <div className="space-y-4 sm:space-y-5">
              <div className="space-y-1 text-center sm:text-left">
                <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Masuk ke Akun Anda</h1>
                <p className="text-xs text-gray-500 sm:text-sm">
                  Masukkan detail login untuk mengakses akun Tukangin Anda
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div className="space-y-1">
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-500">
                      <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="Email"
                      className={`h-10 w-full rounded-xl border bg-white/70 py-2 pl-9 pr-3 text-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 sm:h-11 sm:pl-10 ${
                        emailError
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50'
                          : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {emailError && (
                    <p className="ml-1 text-xs text-red-500 sm:text-sm">{emailError}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="mb-1 flex items-center justify-between">
                    <label htmlFor="password" className="sr-only">
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="ml-auto text-xs text-blue-600 transition-colors hover:text-blue-800 sm:text-sm"
                    >
                      Lupa Password?
                    </Link>
                  </div>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-500">
                      <Lock className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={handlePasswordChange}
                      placeholder="Password"
                      className={`h-10 w-full rounded-xl border bg-white/70 py-2 pl-9 pr-9 text-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 sm:h-11 sm:pl-10 sm:pr-10 ${
                        passwordError
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
                        <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                      ) : (
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="ml-1 text-xs text-red-500 sm:text-sm">{passwordError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex h-10 w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all duration-200 hover:from-blue-700 hover:to-blue-600 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 sm:h-11"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="-ml-1 mr-2 h-4 w-4 animate-spin"
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
                    'Masuk'
                  )}
                </button>

                <div className="text-center">
                  <span className="text-xs text-gray-500 sm:text-sm">
                    Belum punya akun Tukangin?
                  </span>{' '}
                  <Link
                    href="/register"
                    className="text-xs font-medium text-blue-600 transition-colors hover:text-blue-800 sm:text-sm"
                  >
                    Daftar Sekarang
                  </Link>
                </div>
              </form>

              <div className="flex items-center">
                <div className="h-px flex-grow bg-gray-200"></div>
                <span className="px-3 text-xs text-gray-500">atau masuk dengan</span>
                <div className="h-px flex-grow bg-gray-200"></div>
              </div>

              <button
                type="button"
                className="group flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 shadow-sm transition-all duration-300 hover:bg-gray-50 hover:shadow-md sm:h-11 sm:text-sm"
              >
                <svg
                  width="18"
                  height="18"
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
                <span>Lanjutkan dengan Google</span>
              </button>
            </div>
          </div>

          <div className="mt-3 text-center text-xs text-gray-500">
            <p>© {new Date().getFullYear()} Tukangin. Semua hak dilindungi.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
