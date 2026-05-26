import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    const apiUrl = process.env.API_URL ?? 'https://subfreq-wine.vercel.app';
    return [
      { source: '/api/:path*', destination: `${apiUrl}/api/:path*` },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i1.sndcdn.com' },
      { protocol: 'https', hostname: 'i2.sndcdn.com' },
      { protocol: 'https', hostname: '**.sndcdn.com' },
    ],
  },
};

export default nextConfig;
