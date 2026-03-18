/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@boardly/shared'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/:path*',
      },
      {
        source: '/auth/:path*',
        destination: 'http://localhost:3001/auth/:path*',
      },
      {
        source: '/boards/:path*',
        destination: 'http://localhost:3001/boards/:path*',
      },
      {
        source: '/groups/:path*',
        destination: 'http://localhost:3001/groups/:path*',
      },
      {
        source: '/columns/:path*',
        destination: 'http://localhost:3001/columns/:path*',
      },
      {
        source: '/items/:path*',
        destination: 'http://localhost:3001/items/:path*',
      },
    ]
  },
}

module.exports = nextConfig
