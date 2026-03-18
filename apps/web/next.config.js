/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@boardly/shared'],
  env: {
    NEXT_PUBLIC_USE_MOCK_API: 'true',
    NEXT_PUBLIC_API_URL: '',
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
