'use client';

import type React from 'react';
import type { Route } from 'next';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, Mail, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { validateEmail } from '../../lib/validation';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push((redirectTo || '/dashboard') as unknown as Route);
    }
  }, [isAuthenticated, router, redirectTo]);

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

    // Login process
    setIsLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        toast.success('Login berhasil!');
        if (result.redirectTo) {
          router.push(result.redirectTo as unknown as Route);
        } else {
          router.push((redirectTo || '/dashboard') as unknown as Route);
        }
      } else if (result.requireOtp) {
        // Redirect to OTP verification
        router.push(
          `/verify-otp?email=${encodeURIComponent(email)}&token=${encodeURIComponent(result.partialToken || '')}` as unknown as Route
        );
      } else if (result.needVerification) {
        // Redirect to email verification
        router.push(`/verify-email?email=${encodeURIComponent(email)}` as unknown as Route);
      } else {
        toast.error(result.message || 'Login gagal');
        setPasswordError(result.message || 'Email atau password salah');
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Terjadi kesalahan saat login');
      setPasswordError('Email atau password salah');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google login via backend
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      // Redirect ke endpoint backend yang handle Google OAuth
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL || ''}/auth/google/login?redirectTo=${encodeURIComponent(window.location.origin + '/auth/callback')}`;
    } finally {
      setIsGoogleLoading(false);
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
            href="/how-it-works"
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
              src="/logo-tukangin.png"
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
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Sedang Masuk...
                    </>
                  ) : (
                    'Masuk'
                  )}
                </button>

                <div className="relative flex items-center py-1">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="mx-3 flex-shrink text-xs text-gray-400">atau</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isGoogleLoading}
                  className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70 sm:h-11"
                >
                  {isGoogleLoading ? (
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
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Menghubungkan...
                    </>
                  ) : (
                    <>
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Masuk dengan Google
                    </>
                  )}
                </button>
              </form>

              <div className="text-center text-sm text-gray-600 sm:text-left">
                Belum punya akun?{' '}
                <Link
                  href="/register"
                  className="font-medium text-blue-600 transition-colors hover:text-blue-800"
                >
                  Daftar sekarang
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
