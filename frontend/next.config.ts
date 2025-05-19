/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,

  // Error handling
  eslint: {
    ignoreDuringBuilds: true, // Ubah ke false jika ingin build gagal saat ada error lint
  },
  typescript: {
    ignoreBuildErrors: true, // Ubah ke false jika ingin build gagal saat ada error TS
  },

  // Image optimization
  images: {
    unoptimized: false,
    domains: [
      // Tambahkan domain gambar yang diizinkan di sini, misal:
      // 'images.unsplash.com',
      // 'cdn.example.com',
    ],
  },

  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '127.0.0.1:3000'],
    },
    staticIndicator: true, // Indikator halaman statis di dev
    typedRoutes: true, // Dukungan link statis bertipe (Next.js 15+)
    reactCompiler: true, // Aktifkan jika ingin coba React Compiler (experimental)
  },

  swcMinify: true, // Build lebih cepat

  // Tambahan: jika ingin custom headers/rewrites/redirects
  // async headers() {
  //   return [
  //     {
  //       source: '/(.*)',
  //       headers: [
  //         { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
  //       ],
  //     },
  //   ]
  // },
};

export default nextConfig;
