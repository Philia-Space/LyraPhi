/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@philiaspace/phi-dashboard', '@philiaspace/ui-primitives'],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@philiaspace/ui-primitives': path.resolve(__dirname, '../../libs/phi-ui-primitives/src/index.ts'),
      '@philiaspace/phi-dashboard': path.resolve(__dirname, '../../libs/phi-dashboard/src/index.ts'),
    };
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: `${process.env.AUTH_SERVICE_URL || 'http://localhost:8080'}/api/auth/:path*`,
      },
      {
        source: '/api/mondai/:path*',
        destination: `${process.env.MONDAI_SERVICE_URL || 'http://localhost:8087'}/:path*`,
      },
      {
        source: '/api/shiken/:path*',
        destination: `${process.env.SHIKEN_SERVICE_URL || 'http://localhost:8088'}/:path*`,
      },
      {
        source: '/.well-known/:path*',
        destination: `${process.env.AUTH_SERVICE_URL || 'http://localhost:8080'}/.well-known/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
