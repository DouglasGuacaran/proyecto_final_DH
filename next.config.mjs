/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cloudfront-us-east-1.images.arcpublishing.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'sazbeqvdotgnznhvwglg.supabase.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'padelcasamayor.cl',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
