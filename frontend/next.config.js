/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Prevent monorepo lockfile confusion and stale chunk resolution
  outputFileTracingRoot: path.join(__dirname),
};

module.exports = nextConfig;
