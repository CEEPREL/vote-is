const path = require('path');
const dotenv = require('dotenv');

// Load env from custom path
dotenv.config({ path: path.resolve(__dirname, '../.env/client/.env') });

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    // add other variables you want exposed to the client
  },
};

module.exports = nextConfig;
