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
        source: '/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
