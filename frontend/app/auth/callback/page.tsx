'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import authService from '@/services/authService';
import { toast } from 'sonner';

export default function AuthCallbackPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updateUserState } = useAuth();
  
  useEffect(() => {
    const processAuth = async () => {
      try {
        // Check if there's an error parameter
        const errorParam = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        
        if (errorParam) {
          setError(errorDescription || errorParam);
          toast.error(`Authentication failed: ${errorDescription || errorParam}`);
          setTimeout(() => router.push('/login'), 3000);
          return;
        }

        // Get session from Supabase
        const session = await authService.handleAuthCallback();
        
        if (!session) {
          setError('Tidak dapat memperoleh sesi. Silakan coba lagi.');
          toast.error('Login gagal. Silakan coba lagi.');
          setTimeout(() => router.push('/login'), 3000);
          return;
        }

        // Update Auth Context with user info from session
        updateUserState(session);
        
        // Get user data from session
        const userData = session.user;
        
        // Determine redirect URL based on the user's role
        const userRole = userData.user_metadata?.role || 'CUSTOMER';
        let redirectTo = '/dashboard';
        
        if (userRole === 'PROVIDER') {
          redirectTo = '/provider/dashboard';
        } else if (userRole === 'ADMIN') {
          redirectTo = '/admin/dashboard';
        }

        toast.success('Login berhasil!');
        router.push(redirectTo as any);
      } catch (err: any) {
        console.error('Error in authentication callback:', err);
        setError('Gagal melakukan autentikasi. Silakan coba lagi.');
        toast.error('Gagal melakukan autentikasi. Silakan coba lagi.');
        setTimeout(() => router.push('/login'), 3000);
      } finally {
        setIsLoading(false);
      }
    };
    
    processAuth();
  }, [router, searchParams, updateUserState]);
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 text-center shadow-md">
        <h1 className="mb-4 text-xl font-bold text-gray-900">
          {error ? 'Autentikasi Gagal' : 'Menyelesaikan Proses Login...'}
        </h1>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
            <p className="text-gray-600">Mohon tunggu, sedang memverifikasi login Anda...</p>
          </div>
        ) : error ? (
          <div className="space-y-4 py-4">
            <p className="text-red-500">{error}</p>
            <p className="text-gray-500">Mengarahkan ke halaman login dalam beberapa detik...</p>
          </div>
        ) : null}
      </div>
    </div>
  );
} 