const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from custom file
dotenv.config({ path: path.resolve(__dirname, '../.env/client/.env') });

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    // other client-safe env vars
  },

  async rewrites() {
    return [
      {
        source: '/auth/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/auth/:path*`,
      },
      {
        source: '/rooms/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/rooms/:path*`,
      },
      {
        source: '/rooms',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/rooms`,
      },
      {
        source: '/vote/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/vote/:path*`,
      },
      {
        source: '/user/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/user/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
