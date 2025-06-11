import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface AuthToken {
  id: string;
  role: string;
  iat: number;
  exp: number;
  partial?: boolean;
}

// Page yang dapat diakses tanpa login (public)
const publicPages = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/verify-otp',
  '/',
  '/about',
  '/how-it-works',
  '/marketplace',
];

// Page yang hanya boleh diakses oleh role tertentu
const roleAccess: Record<string, string[]> = {
  '/admin': ['ADMIN'],
  '/admin/dashboard': ['ADMIN'],
  '/provider': ['PROVIDER', 'ADMIN'],
  '/provider/dashboard': ['PROVIDER', 'ADMIN'],
  '/dashboard': ['CUSTOMER', 'PROVIDER', 'ADMIN'],
};

// Fungsi untuk mengecek apakah sebuah rute adalah rute publik
const isPublicPage = (pathname: string): boolean => {
  return publicPages.some(page => {
    // Exact match
    if (page === pathname) return true;
    // Nested public pages, misalnya /marketplace/plumber
    if (page !== '/' && pathname.startsWith(page)) return true;
    return false;
  });
};

// Fungsi untuk mengecek apakah token valid
const isValidToken = (token: string): { isValid: boolean; decodedToken: AuthToken | null } => {
  try {
    const decodedToken = jwtDecode<AuthToken>(token);
    const currentTime = Date.now() / 1000;
    
    if (decodedToken.exp < currentTime || decodedToken.partial) {
      return { isValid: false, decodedToken: null };
    }
    
    return { isValid: true, decodedToken };
  } catch (error) {
    return { isValid: false, decodedToken: null };
  }
};

// Fungsi untuk mengecek apakah role user memiliki akses ke path tertentu
const hasAccess = (pathname: string, role: string): boolean => {
  // Cek apakah rute memerlukan role tertentu
  const exactMatch = roleAccess[pathname];
  if (exactMatch) {
    return exactMatch.includes(role);
  }

  // Cek apakah rute nested memerlukan role tertentu
  for (const [path, roles] of Object.entries(roleAccess)) {
    if (pathname.startsWith(path)) {
      return roles.includes(role);
    }
  }

  // Default: jika tidak ada aturan role untuk path ini, izinkan akses
  return true;
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Jika mengakses API, lanjutkan ke handler API
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }
  
  // Ambil token dari cookie atau header
  const token = request.cookies.get('accessToken')?.value || 
                request.headers.get('authorization')?.split(' ')[1] || 
                '';
  
  // Jika akses rute publik, izinkan
  if (isPublicPage(pathname)) {
    // Jika pengguna sudah login dan mencoba mengakses login/register, redirect ke dashboard
    if (token) {
      const { isValid, decodedToken } = isValidToken(token);
      
      if (isValid && decodedToken && 
         (pathname === '/login' || pathname === '/register')) {
        // Tentukan rute dashboard berdasarkan role
        let dashboardPath = '/dashboard';
        if (decodedToken.role === 'PROVIDER') {
          dashboardPath = '/provider/dashboard';
        } else if (decodedToken.role === 'ADMIN') {
          dashboardPath = '/admin/dashboard';
        }
        
        return NextResponse.redirect(new URL(dashboardPath, request.url));
      }
    }
    
    return NextResponse.next();
  }
  
  // Jika tidak ada token, redirect ke login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Validasi token
  const { isValid, decodedToken } = isValidToken(token);
  
  // Jika token tidak valid, hapus token dan redirect ke login
  if (!isValid || !decodedToken) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('accessToken');
    return response;
  }
  
  // Cek role-based access
  if (!hasAccess(pathname, decodedToken.role)) {
    // Jika tidak memiliki akses, redirect ke dashboard sesuai role
    let dashboardPath = '/dashboard';
    if (decodedToken.role === 'PROVIDER') {
      dashboardPath = '/provider/dashboard';
    } else if (decodedToken.role === 'ADMIN') {
      dashboardPath = '/admin/dashboard';
    }
    
    return NextResponse.redirect(new URL(dashboardPath, request.url));
  }
  
  // Jika semuanya valid, izinkan akses
  return NextResponse.next();
}

// Konfigurasi middleware
export const config = {
  // Jalankan middleware pada semua rute kecuali _next dan folder static
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images|assets|.*\\.png$).*)'],
}; 