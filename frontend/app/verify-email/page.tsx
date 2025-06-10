'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, CheckCircle, RefreshCw, AlertTriangle } from 'lucide-react';

export default function VerifyEmailPage() {
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resendSuccess, setResendSuccess] = useState<boolean>(false);
  const [resendError, setResendError] = useState<boolean>(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);

  // Get email from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, []);

  // Handle countdown for resend cooldown
  useEffect(() => {
    if (secondsLeft <= 0) return;
    
    const timer = setTimeout(() => {
      setSecondsLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const handleResendEmail = async () => {
    if (secondsLeft > 0) return;
    
    setIsLoading(true);
    setResendSuccess(false);
    setResendError(false);
    
    try {
      // Simulate API call for resending verification email
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // API call successful
      setResendSuccess(true);
      setSecondsLeft(60); // Set cooldown to 60 seconds
    } catch (error) {
      console.error('Failed to resend verification email:', error);
      setResendError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[100dvh] w-screen items-center justify-center bg-gradient-to-b from-white to-gray-50 p-4 overflow-hidden">
      <div className="z-10 mx-auto w-full max-w-md">
        <div className="relative rounded-2xl border border-gray-100/80 bg-white/80 p-6 shadow-xl backdrop-blur-md">
          {/* Background elements */}
          <div className="absolute -bottom-[20vh] -right-[20vh] -z-10 h-[40vh] w-[40vh] rounded-full bg-gradient-to-tl from-blue-100 via-blue-50 to-blue-200 opacity-20 blur-2xl"></div>
          <div className="absolute -top-[20vh] -left-[20vh] -z-10 h-[40vh] w-[40vh] rounded-full bg-gradient-to-br from-blue-50 via-blue-100 to-green-100 opacity-20 blur-2xl"></div>

          <div className="text-center">
            {/* Logo */}
            <div className="mb-4 flex justify-center">
              <Image
                src="/placeholder.svg?height=96&width=96" 
                alt="Tukangin Logo"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>

            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-blue-100 p-3">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              Verifikasi Email Anda
            </h1>
            
            <p className="mb-6 text-gray-600">
              Kami telah mengirimkan email verifikasi ke <span className="font-medium">{email || 'alamat email Anda'}</span>. 
              Silakan periksa inbox atau folder spam Anda dan klik link verifikasi untuk mengaktifkan akun.
            </p>

            {/* Resend notification */}
            {resendSuccess && (
              <div className="mb-4 rounded-lg bg-green-50 p-3 flex items-center text-green-700">
                <CheckCircle className="h-5 w-5 mr-2" />
                <p className="text-sm">Email verifikasi berhasil dikirim ulang!</p>
              </div>
            )}

            {resendError && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 flex items-center text-red-700">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <p className="text-sm">Gagal mengirim ulang email. Silakan coba lagi nanti.</p>
              </div>
            )}

            <div className="space-y-4">
              <button
                onClick={handleResendEmail}
                disabled={isLoading || secondsLeft > 0}
                className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 shadow-sm transition-all hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Mengirim...
                  </>
                ) : secondsLeft > 0 ? (
                  `Kirim ulang dalam ${secondsLeft}s`
                ) : (
                  'Kirim Ulang Email Verifikasi'
                )}
              </button>

              <Link
                href="/"
                className="inline-flex h-10 w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg"
              >
                Kembali ke Beranda
              </Link>
            </div>

            <div className="mt-6 text-center text-xs text-gray-500">
              <p>Jika Anda tidak menerima email setelah beberapa menit, periksa folder spam Anda atau hubungi dukungan.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 