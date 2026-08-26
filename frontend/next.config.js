/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: {
    // Force Turbopack to treat frontend/ as the workspace root
    // so it doesn't pick up root-level files (instrumentation.ts, app/, etc.)
    root: path.join(__dirname),
  },
};

module.exports = nextConfig;
