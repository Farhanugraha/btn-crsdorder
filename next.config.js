/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.allrecipes.com',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'imagesvc.meredithcorp.io',
        pathname: '**'
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'api.btn.co.id',
        pathname: '**'
      }
    ],
    unoptimized: true, // Tambahkan ini untuk development
  },
  
  // Tambahkan ini untuk redirect api/auth errors
  async redirects() {
    return [
      {
        source: '/api/auth/:path*',
        destination: '/',
        permanent: false,
      },
    ];
  },
  
  // Tambahkan ini untuk mengatasi CORS issues
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
        ],
      },
    ];
  },
  
  // Nonaktifkan ESLint selama build jika perlu
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Enable React strict mode
  reactStrictMode: true,
  
  // Tambahkan swcMinify untuk optimasi
  swcMinify: true,
};

module.exports = nextConfig;