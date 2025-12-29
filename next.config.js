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
      }
    ]
  }
};

module.exports = nextConfig;
