/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@boardly/shared'],
  // Hardcode environment variables for sandbox/preview deployments
  // This ensures the app works without .env files
  env: {
    NEXT_PUBLIC_USE_MOCK_API: 'true',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/:path*',
      },
    ]
  },
}

module.exports = nextConfig
