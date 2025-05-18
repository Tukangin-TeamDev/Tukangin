/** @type {import('next').NextConfig} */
const nextConfig = {
  // Build Configuration
  output: 'standalone',
  reactStrictMode: true,
  
  // Error handling
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Image optimization
  images: {
    unoptimized: true,
  },
  
  // Konfigurasi untuk stabilitas
  experimental: {
    // Server actions yang valid
    serverActions: {
      allowedOrigins: ['localhost:3000', '127.0.0.1:3000'],
    }
  },
  
  // Skip TypeScript type checking
  
}

export default nextConfig
